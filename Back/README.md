# SmartCampus Backend

## Description
Backend API pour l'application SmartCampus - Une plateforme intelligente de gestion de la vie étudiante.

## Fonctionnalités

### 1. Gestion des Comptes Étudiants (accounts)
- Authentification et inscription
- Profils étudiants détaillés
- Préférences pour le matching IA

### 2. Gestion des Emplois du Temps (schedules)
- Emplois du temps personnalisés
- Devoirs et examens
- Rappels automatiques

### 3. Gestion Budgétaire (budget)
- Suivi des dépenses par catégories
- Budgets mensuels
- Alertes et objectifs d'épargne

### 4. Transport (transport)
- Collaboration avec taxis et bus
- Trajets partagés entre étudiants
- Notifications en temps réel

### 5. Documents Administratifs (documents)
- Stockage et organisation
- Rappels d'échéances
- Partage sécurisé

### 6. Matching IA (matching)
- Formation de groupes d'étude intelligents
- Algorithmes de compatibilité
- Clustering basé sur ML

### 7. Espace Collaboratif (collaboration)
- Forums étudiants
- Événements et sessions d'étude
- Partage d'astuces et sondages

## Installation

### Prérequis
- Python 3.8+
- pip
- virtualenv (recommandé)

### Setup

1. **Créer un environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configuration**
Créer un fichier `.env` avec:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

4. **Migrations de base de données**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

6. **Lancer le serveur**
```bash
python manage.py runserver
```

## Technologies Utilisées

- **Django 4.2** - Framework web
- **Django REST Framework** - API REST
- **SQLite** - Base de données (développement)
- **Scikit-learn** - Machine Learning pour le matching
- **Pandas** - Manipulation de données
- **Pillow** - Traitement d'images

## Architecture

```
smartcampus/
├── accounts/          # Gestion des utilisateurs
├── schedules/         # Emplois du temps et cours
├── budget/           # Gestion budgétaire
├── transport/        # Transport et trajets
├── documents/        # Documents administratifs
├── matching/         # Algorithmes de matching IA
├── collaboration/    # Forums et collaboration
└── smartcampus/      # Configuration principale
```

## API Endpoints

### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/logout/` - Déconnexion
- `GET /api/auth/profile/` - Profil utilisateur

### Modules (à implémenter)
- `/api/schedules/` - Emplois du temps
- `/api/budget/` - Gestion budgétaire
- `/api/transport/` - Transport
- `/api/documents/` - Documents
- `/api/matching/` - Matching IA
- `/api/collaboration/` - Collaboration

## Algorithme de Matching IA

Le système utilise plusieurs approches:

1. **Compatibilité par scores** - Calcul de compatibilité entre étudiants
2. **Clustering K-means** - Formation automatique de groupes
3. **Facteurs de compatibilité**:
   - Emploi du temps (40%)
   - Niveau académique (30%)
   - Préférences d'étude (20%)
   - Communication (10%)

## Développement

### Ajouter de nouvelles fonctionnalités
1. Créer les modèles dans `models.py`
2. Créer les serializers dans `serializers.py`
3. Implémenter les vues dans `views.py`
4. Ajouter les URLs dans `urls.py`
5. Faire les migrations

### Tests
```bash
python manage.py test
```

### Déploiement
1. Configurer les variables d'environnement de production
2. Utiliser PostgreSQL en production
3. Configurer les fichiers statiques
4. Mettre en place HTTPS

## Sécurité

- Authentification par tokens
- Validation des données d'entrée
- Permissions par rôles
- Protection CSRF
- CORS configuré

## Contributions

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Support

Pour toute question ou problème, contactez l'équipe de développement.
