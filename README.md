# 🎓 SmartCampus - Gestion Intelligente de la Vie Étudiante

## 📋 Description du Projet

**SmartCampus** est une plateforme intelligente développée pour le **Hack4Impact Hackathon du 4 Juillet 2025** à la **Faculté Polydisciplinaire de Ouarzazate**. Cette application vise à centraliser et simplifier tous les aspects de la vie étudiante grâce à des technologies modernes et l'intelligence artificielle.

## 🎯 Objectifs

- **Centraliser** tous les services universitaires et sociaux
- **Simplifier** la gestion quotidienne des étudiants
- **Optimiser** les ressources et le temps des étudiants
- **Connecter** la communauté étudiante via des outils collaboratifs
- **Automatiser** les tâches répétitives grâce à l'IA

## ✨ Fonctionnalités Principales

### 📅 **Gestion de l'Emploi du Temps**
- Emplois du temps personnalisés et synchronisés
- Gestion des devoirs avec deadlines
- Rappels automatiques pour examens et cours
- Vue hebdomadaire et mensuelle

### 💰 **Gestion Budgétaire Étudiante**
- Suivi détaillé des dépenses par catégories
- Budgets mensuels avec alertes
- Objectifs d'épargne intelligents
- Calcul automatique du reste à vivre

### 🚌 **Transport Collaboratif**
- Options de transport en temps réel
- Intégration avec taxis et bus locaux
- Covoiturage entre étudiants
- Notifications sur horaires et disponibilités

### 📄 **Documents Administratifs**
- Stockage sécurisé des documents
- Suivi des échéances administratives
- Demandes de documents en ligne
- Partage contrôlé entre étudiants

### 🤖 **Matching IA pour Groupes d'Étude**
- Formation automatique de groupes compatibles
- Algorithmes basés sur emploi du temps, niveau, objectifs
- Analyse de compatibilité personnalisée
- Interface de communication intégrée

### 🧠 **Assistant Intelligent Personnalisé** ⭐ NOUVEAU
- Chatbot IA avec GPT-4 via OpenRouter
- Conseils personnalisés basés sur le contexte étudiant
- Adapté culturellement au contexte marocain
- Support 24/7 pour études, budget, motivation

### 👥 **Espace Collaboratif**
- Forum questions/réponses entre étudiants
- Événements étudiants (sessions de révision, afterworks)
- Partage d'astuces et bons plans
- Sondages pour améliorer l'expérience

## 🏗️ Architecture Technique

### **Backend - Django REST API**
```
smartcampus/
├── accounts/          # Gestion des utilisateurs étudiants
├── schedules/         # Emplois du temps et cours
├── budget/           # Gestion budgétaire
├── transport/        # Transport et covoiturage
├── documents/        # Documents administratifs
├── matching/         # Algorithmes de matching IA
├── collaboration/    # Forums et événements
└── smartcampus/      # Configuration Django
```

### **Frontend - React TypeScript**
```
src/
├── components/       # Composants réutilisables
├── pages/           # Pages principales
├── hooks/           # Hooks personnalisés
├── types/           # Types TypeScript
└── utils/           # Utilitaires
```

## 🛠️ Technologies Utilisées

### **Backend**
- **Django 4.2** - Framework web robuste
- **Django REST Framework** - API RESTful
- **SQLite** - Base de données (développement)
- **Scikit-learn** - Machine Learning pour matching
- **Pandas** - Manipulation de données
- **OpenAI API** - Intelligence artificielle

### **Frontend**
- **React 18** avec TypeScript
- **Vite** - Build tool moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **React Query** - Gestion des données
- **React Router** - Navigation
- **Axios** - Client HTTP

### **Outils IA**
- **K-means Clustering** - Formation de groupes
- **Algorithmes de compatibilité** - Matching personnalisé
- **Analyse NLP** - Traitement des préférences
- **Apprentissage supervisé** - Amélioration continue

## 🚀 Installation et Démarrage

### **Prérequis**
- Python 3.8+
- Node.js 16+
- Git

### **1. Cloner le projet**
```bash
git clone [url-du-repo]
cd Hackathon
```

### **2. Configuration Backend**
```bash
cd Back
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows

pip install -r requirements.txt
cp .env.example .env

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### **3. Configuration Frontend**
```bash
cd Front
npm install
npm run dev
```

### **4. Accès à l'application**
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin

## 🎮 Utilisation

### **Connexion**
- Créez un compte étudiant ou utilisez les identifiants de démonstration
- Remplissez votre profil avec vos préférences d'étude

### **Tableau de Bord**
- Vue d'ensemble de vos cours, devoirs, budget
- Actions rapides pour les tâches courantes
- Notifications en temps réel

### **Matching IA**
- Configurez vos préférences d'étude
- Laissez l'IA trouver des partenaires compatibles
- Rejoignez ou créez des groupes d'étude

### **Gestion Budgétaire**
- Ajoutez vos revenus et dépenses
- Suivez vos objectifs d'épargne
- Recevez des alertes budgétaires

## 🤖 Algorithme de Matching IA

### **Facteurs de Compatibilité**
1. **Emploi du temps** (40%) - Disponibilités communes
2. **Niveau académique** (30%) - Filière, niveau, GPA
3. **Préférences d'étude** (20%) - Style, taille de groupe
4. **Communication** (10%) - Moyens de communication préférés

### **Processus de Matching**
```python
# Calcul de compatibilité entre étudiants
compatibility_score = (
    schedule_overlap * 0.4 +
    academic_similarity * 0.3 +
    study_preferences * 0.2 +
    communication_match * 0.1
)

# Formation de groupes par clustering
groups = KMeans(n_clusters=optimal_groups).fit(student_features)
```

## 📊 Indicateurs de Performance

### **Métriques de Succès**
- **Taux d'adoption** : Nombre d'étudiants actifs
- **Satisfaction matching** : Score moyen de compatibilité
- **Économies budgétaires** : Moyenne des économies réalisées
- **Utilisation transport** : Réduction des trajets individuels
- **Engagement communautaire** : Activité sur forum et événements

### **Objectifs Quantifiables**
- 80% des étudiants utilisent la plateforme régulièrement
- 90% de satisfaction sur le matching IA
- 25% d'économies budgétaires en moyenne
- 40% de réduction des trajets individuels

## 🔒 Sécurité et Confidentialité

### **Protection des Données**
- Chiffrement des données sensibles
- Authentification sécurisée par tokens
- Respect du RGPD et des normes de confidentialité
- Contrôle granulaire des permissions de partage

### **Sécurité Technique**
- Validation des entrées utilisateur
- Protection CSRF et XSS
- Rate limiting sur l'API
- Logs de sécurité et monitoring

## 🌍 Impact Social et Environnemental

### **Impact Social**
- **Réduction des inégalités** : Accès équitable aux ressources
- **Renforcement communautaire** : Liens entre étudiants
- **Amélioration académique** : Meilleurs résultats via collaboration
- **Inclusion numérique** : Plateforme accessible et intuitive

### **Impact Environnemental**
- **Réduction carbone** : Optimisation des transports
- **Économie de papier** : Dématérialisation des documents
- **Partage de ressources** : Réduction du gaspillage
- **Sensibilisation** : Éducation aux enjeux environnementaux

## 🚧 Roadmap de Développement

### **Phase 1 - MVP (Hackathon - 1 jour)**
- ✅ Architecture backend Django
- ✅ Interface frontend React
- ✅ Authentification et profils
- ✅ Modules de base (planning, budget, transport)
- ✅ Algorithme de matching simple

### **Phase 2 - Version Beta (1 mois)**
- 🔄 Intégration API externes (Google Calendar, SMS)
- 🔄 Matching IA avancé avec machine learning
- 🔄 Interface mobile responsive
- 🔄 Tests utilisateurs avec étudiants pilotes

### **Phase 3 - Version Stable (3 mois)**
- 📋 Déploiement en production
- 📋 Intégration systèmes universitaires
- 📋 Formation du personnel administratif
- 📋 Marketing et adoption à grande échelle

### **Phase 4 - Évolutions (6 mois+)**
- 📋 Application mobile native
- 📋 Intégration IoT (capteurs campus)
- 📋 Analytics avancées et BI
- 📋 Expansion vers d'autres universités

## 👥 Équipe de Développement

### **Rôles et Responsabilités**
- **Product Owner** : Définition des besoins utilisateurs
- **Tech Lead** : Architecture et développement backend
- **Frontend Developer** : Interface utilisateur et UX
- **Data Scientist** : Algorithmes IA et analytics
- **UI/UX Designer** : Design et expérience utilisateur

### **Méthodologie Agile**
- Sprints de 2 semaines
- Daily standups
- Retrospectives et amélioration continue
- Tests utilisateurs réguliers

## 📈 Business Model

### **Modèle Freemium**
- **Version gratuite** : Fonctionnalités de base pour tous
- **Version Premium** : Fonctionnalités avancées (analytics, priorité matching)
- **Version Institutionnelle** : Intégration complète pour l'université

### **Sources de Revenus**
1. **Abonnements Premium** étudiants
2. **Licences institutionnelles** universités
3. **Partenariats** (transports, commerces locaux)
4. **Services additionnels** (tutorat, formations)

## 🏆 Avantages Concurrentiels

### **Innovation Technique**
- **IA de matching** propriétaire et optimisée
- **Architecture microservices** scalable
- **Interface utilisateur** moderne et intuitive
- **Intégrations natives** avec écosystème étudiant

### **Avantages Stratégiques**
- **First mover advantage** sur le marché marocain
- **Expertise locale** des besoins étudiants
- **Partenariats institutionnels** privilégiés
- **Communauté engagée** d'early adopters

## 🎯 Prochaines Étapes

### **Post-Hackathon Immédiat**
1. **Finalisation MVP** avec retours jury
2. **Tests utilisateurs** avec étudiants FPO
3. **Présentation** à l'administration universitaire
4. **Recherche de financement** et partenaires

### **Développement à Court Terme**
1. **Équipe élargie** avec compétences complémentaires
2. **Partenariats tech** (cloud, APIs, paiements)
3. **Validation marché** avec autres universités
4. **Propriété intellectuelle** et marques déposées

## 📞 Contact et Contribution

### **Équipe SmartCampus**
- **Email** : smartcampus@fp-ouarzazate.ma
- **GitHub** : [Repository du projet]
- **LinkedIn** : [Profil de l'équipe]
- **Documentation** : [Wiki technique]

### **Contributions**
Les contributions sont les bienvenues ! Consultez notre guide de contribution pour :
- Signaler des bugs
- Proposer des fonctionnalités
- Contribuer au code
- Améliorer la documentation

### **Licence**
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

---

## 🙏 Remerciements

Merci à :
- **Faculté Polydisciplinaire de Ouarzazate** pour l'organisation
- **Hack4Impact** pour l'opportunité
- **Communauté étudiante** pour les retours et tests
- **Mentors et jury** pour leurs conseils précieux

---

*Développé avec ❤️ pour la communauté étudiante lors du Hack4Impact Hackathon 2025*

**#SmartCampus #Hack4Impact #FPOuarzazate #InnovationÉtudiante #IA #Education**
