from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered
from django.db import models as dj_models



def _preferred_field_names():
    return [
        "username",
        "email",
        "first_name",
        "last_name",
        "name",
        "full_name",
        "is_active",
        "is_staff",
        "is_superuser",
    ]


def _select_list_display(model, limit=6):
    preferred = _preferred_field_names()
    fields = []
    # Prefer well-known names
    for name in preferred:
        try:
            model._meta.get_field(name)
            fields.append(name)
        except Exception:
            continue
        if len(fields) >= limit:
            return fields
    # Fallback: first non-password, non-binary concrete fields
    for f in model._meta.concrete_fields:
        if f.name in fields:
            continue
        if isinstance(f, (dj_models.BinaryField,)):
            continue
        if f.name.lower() == "password":
            continue
        fields.append(f.name)
        if len(fields) >= limit:
            break
    if not fields:
        fields = ["pk"]
    return fields


def _select_search_fields(model):
    names = []
    for f in model._meta.get_fields():
        if isinstance(getattr(f, "field", f), (dj_models.CharField, dj_models.TextField, dj_models.EmailField)):
            names.append(f.name)
    return names[:6]


def _select_list_filter(model):
    names = []
    for f in model._meta.get_fields():
        field = getattr(f, "field", f)
        if isinstance(field, (dj_models.BooleanField, dj_models.NullBooleanField, dj_models.DateField, dj_models.DateTimeField)):
            names.append(f.name)
        elif isinstance(field, dj_models.ForeignKey):
            names.append(f.name)
    return names[:6]


def _select_readonly(model):
    candidates = {"id", "pk", "created", "created_at", "updated", "updated_at", "last_login"}
    return [n for n in candidates if any(n == f.name for f in model._meta.get_fields())]


def _select_ordering(model):
    for name in ("-created_at", "-created", "-id", "id"):
        bare = name.lstrip("-")
        if any(bare == f.name for f in model._meta.get_fields()):
            return (name,)
    return None


def make_admin_for(model):
    list_display = _select_list_display(model)
    search_fields = _select_search_fields(model)
    list_filter = _select_list_filter(model)
    readonly_fields = _select_readonly(model)
    ordering = _select_ordering(model)

    attrs = {
        "list_display": list_display,
        "search_fields": search_fields,
        "list_filter": list_filter,
        "readonly_fields": readonly_fields,
    }
    if ordering:
        attrs["ordering"] = ordering

    # Create a simple ModelAdmin subclass
    return type(f"{model.__name__}AutoAdmin", (admin.ModelAdmin,), attrs)


def register_accounts_models(app_label="accounts"):
    """
    Automatically register all models from the accounts app with the admin site,
    using a reasonable default ModelAdmin tailored to each model's fields.
    """
    try:
        app_config = apps.get_app_config(app_label)
    except LookupError:
        return

    for model in app_config.get_models():
        try:
            admin_class = make_admin_for(model)
            admin.site.register(model, admin_class)
        except AlreadyRegistered:
            # If already registered elsewhere, skip
            continue
        except Exception:
            # Don't fail admin import if one model causes problems
            continue


# Execute registration at import time
register_accounts_models()