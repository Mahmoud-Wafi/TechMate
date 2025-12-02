from django.contrib import admin
from django.apps import apps
from django.db import models as dj_models



def _app_label():
    # Prefer the current package name (this file lives in the app package).
    pkg = __package__ or "tutorials"
    return pkg.split(".")[0]


def _field_names(model):
    # Return non-relational, non-auto field names suitable for list_display
    names = []
    for f in model._meta.get_fields():
        # skip reverse relations and many-to-many through relations
        if f.auto_created and not getattr(f, "concrete", False):
            continue
        # skip many-to-many and one-to-many relations for list_display
        if getattr(f, "many_to_many", False) or getattr(f, "one_to_many", False):
            continue
        # skip large text fields for list_display (they're unwieldy)
        if isinstance(f, (dj_models.TextField,)):
            continue
        names.append(f.name)
    return names


def _search_fields(model):
    # Use CharField/TextField for search_fields
    return [
        f.name
        for f in model._meta.get_fields()
        if isinstance(f, (dj_models.CharField, dj_models.TextField))
    ]


def _list_filter(model):
    # Use boolean, date/datetime, FK and choice/integer-like fields for filters
    filter_types = (dj_models.BooleanField, dj_models.DateField, dj_models.DateTimeField, dj_models.ForeignKey, dj_models.IntegerField)
    return [
        f.name
        for f in model._meta.get_fields()
        if isinstance(f, filter_types)
    ]


def register_all_models(app_label=None):
    if app_label is None:
        app_label = _app_label()
    app_config = apps.get_app_config(app_label)
    for model in app_config.get_models():
        # Already registered models are skipped
        if model in admin.site._registry:
            continue

        # Build a lightweight ModelAdmin class with sensible defaults.
        attrs = {}
        display = _field_names(model)[:10]  # limit to 10 columns to keep the list compact
        if display:
            attrs["list_display"] = display
        search = _search_fields(model)
        if search:
            attrs["search_fields"] = search
        filters = _list_filter(model)
        if filters:
            attrs["list_filter"] = filters

        admin_class = type(f"{model.__name__}Admin", (admin.ModelAdmin,), attrs)
        try:
            admin.site.register(model, admin_class)
        except admin.sites.AlreadyRegistered:
            # ignore if some other code registered it
            pass


# Register when this module is imported by Django
register_all_models()