#!/usr/bin/env python3
"""
Generate secure secrets for TechMate deployment.
Run this script to generate SECRET_KEY and JWT_SECRET_KEY for production.
"""

import secrets
import sys


def generate_secret_key():
    """Generate a secure Django SECRET_KEY"""
    return secrets.token_urlsafe(50)


def generate_jwt_secret():
    """Generate a secure JWT secret"""
    return secrets.token_urlsafe(50)


def main():
    print("\n" + "=" * 60)
    print("TechMate Deployment Secrets Generator")
    print("=" * 60 + "\n")

    secret_key = generate_secret_key()
    jwt_secret = generate_jwt_secret()

    print("Copy these to your .env.production or Railway variables:\n")
    print("-" * 60)
    print(f"SECRET_KEY={secret_key}")
    print(f"SESSION_SECRET={secret_key}")
    print(f"JWT_SECRET_KEY={jwt_secret}")
    print("-" * 60)

    print("\n✅ Secrets generated successfully!")
    print("\nNext steps:")
    print("1. Copy the secrets above")
    print("2. Add them to Railway environment variables")
    print("3. Set CORS_ALLOWED_ORIGINS to your Vercel frontend URL")
    print("4. Deploy!\n")


if __name__ == "__main__":
    main()
