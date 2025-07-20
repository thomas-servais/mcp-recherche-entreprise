# Serveur MCP data.gouv.fr

Un serveur MCP (Model Context Protocol) pour accéder aux données de [data.gouv.fr](https://www.data.gouv.fr), la plateforme française de données ouvertes.

## 🚀 Fonctionnalités

Ce serveur MCP fournit actuellement l'outil suivant pour interagir avec l'API recherche-entreprises.api.gouv.fr :

### Recherche d'entreprises
- **`search_companies`** : Rechercher des entreprises via l'API recherche-entreprises.api.gouv.fr

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. Clonez le repository :
```bash
git clone <repository-url>
cd mcp-data-gouv-server
```

2. Installez les dépendances :
```bash
npm install
```

3. Copiez le fichier d'exemple d'environnement :
```bash
cp env.example .env
```

4. Compilez le projet :
```bash
npm run build
```

## 🚀 Utilisation

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## 🔧 Configuration

Le serveur utilise les variables d'environnement suivantes (optionnelles) :

- `API_RATE_LIMIT` : Limite de taux pour les requêtes API
- `API_TIMEOUT` : Timeout pour les requêtes API en millisecondes

## 📖 API des outils

### search_companies
Rechercher des entreprises via l'API recherche-entreprises.api.gouv.fr.

**Paramètres :**
- `query` (requis) : Recherche libre (nom, SIREN, SIRET, etc.)
- `page` (optionnel) : Numéro de page (défaut: 1)
- `page_size` (optionnel) : Nombre de résultats par page (défaut: 10)
- `activite_principale` (optionnel) : Code NAF/APE
- `code_postal` (optionnel) : Code postal (5 chiffres ou liste séparée par des virgules)
- `tranche_effectif_salarie` (optionnel) : Tranche d'effectif salarié INSEE
- `est_association` (optionnel) : Est une association
- `est_bio` (optionnel) : Uniquement les entreprises certifiées bio
- `est_organisme_formation` (optionnel) : Uniquement les organismes de formation
- `est_qualiopi` (optionnel) : Uniquement les entreprises certifiées Qualiopi

## 🔗 Intégration avec un client MCP

Pour utiliser ce serveur avec un client MCP, ajoutez la configuration suivante à votre fichier de configuration MCP :

```json
{
  "mcpServers": {
    "data-gouv": {
      "command": "node",
      "args": ["/path/to/mcp-data-gouv-server/dist/server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 📝 Exemples d'utilisation

### Recherche d'entreprises par nom
```
search_companies({
  "query": "Apple",
  "page_size": 5
})
```

### Recherche d'entreprises par code postal
```
search_companies({
  "query": "",
  "code_postal": "75001",
  "page_size": 10
})
```

### Recherche d'entreprises par activité
```
search_companies({
  "query": "",
  "activite_principale": "62.02A",
  "page_size": 5
})
```

### Recherche d'associations
```
search_companies({
  "query": "association",
  "est_association": true,
  "page_size": 10
})
```

## 🧪 Tests

Le projet inclut des scripts de test pour vérifier le bon fonctionnement :

```bash
# Test des APIs
npm run test:apis

# Test de l'intégration avec Cursor
npm run test:cursor
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 🔗 Liens utiles

- [API recherche-entreprises.api.gouv.fr](https://recherche-entreprises.api.gouv.fr/)
- [Spécification MCP](https://modelcontextprotocol.io/)
- [Plateforme data.gouv.fr](https://www.data.gouv.fr/) 