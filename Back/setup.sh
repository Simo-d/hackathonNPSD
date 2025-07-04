#!/bin/bash

echo "🚀 Initialisation du Backend SmartCampus"
echo "======================================="

# Activer l'environnement virtuel
if [ -d "venv" ]; then
    echo "📦 Activation de l'environnement virtuel..."
    source venv/bin/activate
else
    echo "❌ Environnement virtuel non trouvé. Créez-le avec: python -m venv venv"
    exit 1
fi

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install -r requirements.txt

# Créer les migrations
echo "🔄 Création des migrations..."
python manage.py makemigrations accounts
python manage.py makemigrations schedules
python manage.py makemigrations budget
python manage.py makemigrations transport
python manage.py makemigrations documents
python manage.py makemigrations matching
python manage.py makemigrations collaboration
python manage.py makemigrations dashboard

# Appliquer les migrations
echo "⚙️ Application des migrations..."
python manage.py migrate

# Créer un superutilisateur (optionnel)
echo "👤 Voulez-vous créer un superutilisateur? (y/N)"
read -r create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

# Tester le backend
echo "🧪 Test du backend..."
python test_backend.py

echo ""
echo "✅ Initialisation terminée!"
echo ""
echo "🚀 Pour démarrer le serveur:"
echo "   python manage.py runserver"
echo ""
echo "🌐 Accès:"
echo "   - API: http://localhost:8000/api/"
echo "   - Admin: http://localhost:8000/admin/"
