#!/usr/bin/env python3
"""
Script to create the admin user for the Chicken Shop Management System.
Run this script from the backend directory with the virtual environment activated.
"""

import bcrypt
from app.database import SessionLocal
from app.models.models import User
from datetime import datetime

def create_admin_user():
    """Create the admin user with proper password hashing."""
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == 'admin').first()
        if existing_admin:
            print("Admin user already exists. Updating password...")
            # Hash password using bcrypt directly
            hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            existing_admin.hashed_password = hashed_password.decode('utf-8')
            existing_admin.is_active = True
            existing_admin.is_superuser = True
            existing_admin.is_approved = True
            db.commit()
            print("Admin user updated successfully!")
            return

        # Create new admin user
        hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        admin_user = User(
            email='admin@chicken.com',
            username='admin',
            full_name='Super Admin',
            hashed_password=hashed_password.decode('utf-8'),
            is_active=True,
            is_superuser=True,
            is_approved=True,
            created_at=datetime.now()
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("Admin user created successfully!")
        print(f"Username: {admin_user.username}")
        print(f"Password: admin123")
        print(f"Email: {admin_user.email}")
        print(f"Is Superuser: {admin_user.is_superuser}")

    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()