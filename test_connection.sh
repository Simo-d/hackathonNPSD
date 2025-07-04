#!/bin/bash

echo "🎯 Test Frontend-Backend SmartCampus"
echo "===================================="

# Variables
BACKEND_URL="http://localhost:8000"
API_URL="$BACKEND_URL/api"

# Fonction pour tester un endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local description=$3
    
    echo "🔍 Test: $description"
    echo "   $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$endpoint")
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "   ✅ Succès ($http_code)"
    elif [ "$http_code" -eq 401 ] || [ "$http_code" -eq 403 ]; then
        echo "   ⚠️  Authentification requise ($http_code)"
    else
        echo "   ❌ Erreur ($http_code)"
    fi
    echo ""
}

echo "1. Test de connectivité backend..."
if curl -s "$BACKEND_URL" > /dev/null; then
    echo "   ✅ Backend accessible"
else
    echo "   ❌ Backend non accessible - Démarrez avec: python manage.py runserver"
    exit 1
fi

echo ""
echo "2. Test des endpoints API..."

# Test des endpoints d'authentification
test_endpoint "$API_URL/auth/login/" "POST" "Endpoint de connexion"
test_endpoint "$API_URL/auth/register/" "POST" "Endpoint d'inscription"
test_endpoint "$API_URL/auth/profile/" "GET" "Endpoint de profil"

# Test des endpoints dashboard
test_endpoint "$API_URL/dashboard/stats/" "GET" "Statistiques dashboard"
test_endpoint "$API_URL/dashboard/stats/activities/" "GET" "Activités récentes"
test_endpoint "$API_URL/dashboard/stats/upcoming/" "GET" "Éléments à venir"

echo "3. Test avec token d'authentification..."

# Créer un utilisateur test et obtenir un token
echo "   Création d'un utilisateur test..."
token_response=$(curl -s -X POST "$API_URL/auth/register/" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "password_confirm": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "student_id": "TEST001",
        "level": "L1",
        "filiere": "INFO",
        "enrollment_year": 2024,
        "expected_graduation": 2027
    }')

# Extraire le token de la réponse
token=$(echo "$token_response" | python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('token', ''))
except:
    pass
")

if [ -n "$token" ]; then
    echo "   ✅ Token obtenu: ${token:0:10}..."
    
    # Test avec authentification
    echo "   Test du profil avec authentification..."
    profile_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Token $token" \
        "$API_URL/auth/profile/")
    
    profile_code="${profile_response: -3}"
    if [ "$profile_code" -eq 200 ]; then
        echo "   ✅ Profil accessible avec token"
    else
        echo "   ❌ Erreur accès profil ($profile_code)"
    fi
    
    # Test dashboard avec auth
    echo "   Test du dashboard avec authentification..."
    dashboard_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Token $token" \
        "$API_URL/dashboard/stats/")
    
    dashboard_code="${dashboard_response: -3}"
    if [ "$dashboard_code" -eq 200 ]; then
        echo "   ✅ Dashboard accessible avec token"
    else
        echo "   ❌ Erreur accès dashboard ($dashboard_code)"
    fi
else
    echo "   ❌ Impossible d'obtenir un token"
fi

echo ""
echo "4. Nettoyage..."
# Supprimer l'utilisateur test
if [ -n "$token" ]; then
    echo "   Suppression de l'utilisateur test..."
    # Note: Il faudrait implémenter un endpoint de suppression
fi

echo ""
echo "✅ Tests terminés!"
echo ""
echo "📋 Résumé:"
echo "   - Backend: Accessible"
echo "   - Authentification: $([ -n "$token" ] && echo "Fonctionnelle" || echo "À vérifier")"
echo "   - Dashboard: $([ "$dashboard_code" -eq 200 ] && echo "Fonctionnel" || echo "À vérifier")"
echo ""
echo "🚀 Pour tester l'interface:"
echo "   cd Front && npm run dev"
echo "   Puis ouvrir: http://localhost:5173"
