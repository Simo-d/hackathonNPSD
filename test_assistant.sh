#!/bin/bash

echo "🧠 Test de l'Assistant Intelligent SmartCampus"
echo "============================================="

# Vérifier que les variables d'environnement sont configurées
if [ -f "Front/.env" ]; then
    echo "✅ Fichier .env trouvé"
    
    if grep -q "VITE_OPENROUTER_API_KEY" Front/.env; then
        echo "✅ Clé OpenRouter configurée"
    else
        echo "❌ Clé OpenRouter manquante dans .env"
    fi
else
    echo "❌ Fichier .env manquant"
fi

# Vérifier que les fichiers nécessaires existent
files=(
    "Front/src/pages/IntelligentAssistant.tsx"
    "Front/src/services/openRouterService.ts"
    "Front/src/services/studentContextService.ts"
)

echo ""
echo "📁 Vérification des fichiers..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

# Vérifier la route dans App.tsx
echo ""
echo "🔍 Vérification de la route..."
if grep -q "/intelligent-assistant" Front/src/App.tsx; then
    echo "✅ Route configurée dans App.tsx"
else
    echo "❌ Route manquante dans App.tsx"
fi

# Vérifier le menu dans Sidebar
if grep -q "Assistant Intelligent" Front/src/components/layout/Sidebar.tsx; then
    echo "✅ Menu configuré dans Sidebar"
else
    echo "❌ Menu manquant dans Sidebar"
fi

echo ""
echo "🚀 Instructions pour tester:"
echo "1. Démarrer le backend: cd Back && python manage.py runserver"
echo "2. Démarrer le frontend: cd Front && npm run dev"
echo "3. Aller sur http://localhost:5173"
echo "4. Se connecter et cliquer sur 'Assistant Intelligent'"
echo "5. Poser une question comme 'Comment gérer mon temps d'étude ?'"

echo ""
echo "💡 Questions de test suggérées:"
echo "- Comment mieux organiser mon temps d'étude ?"
echo "- Aide-moi à préparer mes examens de L3 Info"
echo "- Conseils pour gérer mon budget étudiant à Ouarzazate"
echo "- Comment former un groupe d'étude efficace ?"
echo "- Stratégies pour rester motivé pendant les révisions"

echo ""
echo "🔧 En cas de problème:"
echo "- Vérifier la console du navigateur pour les erreurs"
echo "- Vérifier que l'API key OpenRouter est valide"
echo "- Tester avec curl: curl -H 'Authorization: Bearer sk-or-v1-...' https://openrouter.ai/api/v1/models"
