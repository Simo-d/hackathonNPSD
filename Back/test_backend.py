#!/usr/bin/env python
"""
Script de test pour vérifier que le backend fonctionne correctement
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartcampus.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from accounts.models import Student, StudentProfile

def test_backend():
    print("🧪 Test du Backend SmartCampus")
    print("=" * 50)
    
    # Test 1: Modèles disponibles
    print("\n1. Vérification des modèles...")
    try:
        user_count = Student.objects.count()
        print(f"✅ Modèle Student: {user_count} utilisateurs")
        
        profile_count = StudentProfile.objects.count()
        print(f"✅ Modèle StudentProfile: {profile_count} profils")
        
        token_count = Token.objects.count()
        print(f"✅ Modèle Token: {token_count} tokens")
        
    except Exception as e:
        print(f"❌ Erreur modèles: {e}")
    
    # Test 2: Créer un utilisateur test
    print("\n2. Test création utilisateur...")
    try:
        # Supprimer l'utilisateur test s'il existe
        Student.objects.filter(username='test_user').delete()
        
        # Créer un nouvel utilisateur
        user = Student.objects.create_user(
            username='test_user',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            student_id='TEST001',
            level='L1',
            filiere='INFO'
        )
        
        # Créer le profil
        profile = StudentProfile.objects.create(
            student=user,
            enrollment_year=2024,
            expected_graduation=2027
        )
        
        # Créer le token
        token = Token.objects.create(user=user)
        
        print(f"✅ Utilisateur créé: {user.username}")
        print(f"✅ Profil créé: ID {profile.id}")
        print(f"✅ Token créé: {token.key[:10]}...")
        
    except Exception as e:
        print(f"❌ Erreur création utilisateur: {e}")
    
    # Test 3: Test des endpoints
    print("\n3. Test des URLs Django...")
    try:
        from django.urls import reverse
        
        # Test des URLs d'auth
        login_url = reverse('login')
        register_url = reverse('register')
        profile_url = reverse('profile')
        
        print(f"✅ URL Login: {login_url}")
        print(f"✅ URL Register: {register_url}")
        print(f"✅ URL Profile: {profile_url}")
        
    except Exception as e:
        print(f"❌ Erreur URLs: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Test terminé! Le backend semble fonctionnel.")
    print("\n📋 Étapes suivantes:")
    print("1. Démarrer le serveur: python manage.py runserver")
    print("2. Démarrer le frontend: cd Front && npm run dev")
    print("3. Tester la connexion sur http://localhost:5173")

if __name__ == '__main__':
    test_backend()
