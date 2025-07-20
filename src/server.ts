import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


class DataGouvMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'data-gouv-mcp-server',
        version: '1.0.0',
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_companies',
            description: 'Rechercher des entreprises via l\'API recherche-entreprises.api.gouv.fr',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Recherche par nom (optionnel)',
                },
                activite_principale: {
                  type: 'string',
                  description: 'Code NAF/APE (optionnel)',
                },
                categorie_entreprise: {
                  type: 'string',
                  description: 'Catégorie d\'entreprise (optionnel : PME, ETI, GE)',
                },
                departement: {
                  type: 'string',
                  description: 'departement français sur 2 chiffres (optionnel, 1 ou plusieurs, liste séparée par des virgules)',
                },
                code_postal: {
                  type: 'string',
                  description: 'Code postal de 5 chiffres (optionnel, 1 ou plusieurs codes postaux, liste séparée par des virgules)',
                },
                tranche_effectif_salarie: {
                  type: 'string',
                  description: 'Tranche d\'effectif salarié INSEE (optionnel : 00 : 0 salarié, 01 : 1 ou 2 salariés, 02 : 3 à 5 salariés, 03 : 6 à 9 salariés, 11 : 10 à 19 salariés, 12 : 20 à 49 salariés, 21 : 50 à 99 salariés, 22 : 100 à 199 salariés, 31 : 200 à 249 salariés, 32 : 250 à 499 salariés, 41 : 500 à 999 salariés, 42 : 1 000 à 1 999 salariés, 51 : 2 000 à 4 999 salariés, 52 : 5 000 à 9 999 salariés, 53 : 10 000 salariés et plus)',
                },
                est_association: {
                  type: 'boolean',
                  description: 'Est une association (optionnel)',
                },
                est_bio: {
                  type: 'boolean',
                  description: 'Uniquement les entreprises ayant un établissement certifié par l\'agence bio (optionnel)',
                },
                est_organisme_formation: {
                  type: 'boolean',
                  description: 'Uniquement les entreprises ayant un établissement organisme de formation',
                },
                est_qualiopi: {
                  type: 'boolean',
                  description: 'Uniquement les entreprises ayant ayant une certification de la marque « Qualiopi »',
                }
              },
              required: ['query'],
            },
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_companies':
            return await this.searchCompanies(args) as any;
          default:
            throw new Error(`Outil inconnu: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erreur lors de l'exécution de l'outil ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        } as any;
      }
    });
  }

  // Recherche d'entreprises
  private async searchCompanies(args: any) {
    const { query, page = 1, page_size = 10, activite_principale, departement, categorie_entreprise, code_postal, tranche_effectif_salarie, est_association, est_bio, est_organisme_formation, est_qualiopi } = args;
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: page_size.toString(),
    });
    if (activite_principale) {
      params.append('activite_principale', activite_principale);
    }
    if (code_postal) {
      params.append('code_postal', code_postal);
    }
    if (departement) {
      params.append('departement', departement);
    }
    if (categorie_entreprise) {
      params.append('categorie_entreprise', categorie_entreprise);
    }
    if (tranche_effectif_salarie) {
      params.append('tranche_effectif_salarie', tranche_effectif_salarie);
    }
    if (est_association) {
      params.append('est_association', est_association);
    }
    if (est_bio) {
      params.append('est_bio', est_bio);
    }
    if (est_organisme_formation) {  
      params.append('est_organisme_formation', est_organisme_formation);
    }
    if (est_qualiopi) {
      params.append('est_qualiopi', est_qualiopi);
    }
    const response = await axios.get(`https://recherche-entreprises.api.gouv.fr/search?${params}`);
    const data = response.data;
    const results = (data.results || []).map((c: any) => {
      // Champs principaux
      const siege = c.siege || {};
      const dirigeants = c.dirigeants || [];
      return {
        nom_raison_sociale: c.nom_raison_sociale || c.nom_entreprise || c.nom_complet,
        siren: c.siren,
        siret_siege_social: c.siret_siege_social || siege.siret,
        forme_juridique: c.forme_juridique,
        activite_principale: c.activite_principale,
        adresse_siege_social: c.adresse_siege_social || siege.adresse || siege.geo_adresse,
        statut_entreprise: c.statut_entreprise || c.etat_administratif,
        categorie_entreprise: c.categorie_entreprise,
        date_creation: c.date_creation,
        nombre_etablissements: c.nombre_etablissements,
        nombre_etablissements_ouverts: c.nombre_etablissements_ouverts,
        dirigeants: dirigeants.map((d: any) => `${d.nom || ''} ${d.prenoms || ''} (${d.qualite || ''}, date_de_naissance=${d.date_de_naissance || ''})`).filter(Boolean).join(', '),
        nature_juridique: c.nature_juridique,
        section_activite_principale: c.section_activite_principale,
        tranche_effectif_salarie: c.tranche_effectif_salarie,
        annee_categorie_entreprise: c.annee_categorie_entreprise,
      };
    });
    return {
      content: [
        {
          type: 'text',
          text: `Résultats de recherche d'entreprise pour "${query}" (${data.total_results || results.length} résultats):\n\n${results.map((c: any) =>
            `🏢 **${c.nom_raison_sociale || 'Nom inconnu'}**\n` +
            `SIREN: ${c.siren || 'N/A'}\n` +
            `SIRET siège: ${c.siret_siege_social || 'N/A'}\n` +
            `Forme juridique: ${c.forme_juridique || 'N/A'}\n` +
            `Activité principale: ${c.activite_principale || 'N/A'}\n` +
            `Section activité principale: ${c.section_activite_principale || 'N/A'}\n` +
            `Catégorie: ${c.categorie_entreprise || 'N/A'}\n` +
            `Nature juridique: ${c.nature_juridique || 'N/A'}\n` +
            `Tranche effectif salarié: ${c.tranche_effectif_salarie || 'N/A'}\n` +
            `Année catégorie entreprise: ${c.annee_categorie_entreprise || 'N/A'}\n` +
            `Adresse siège: ${c.adresse_siege_social || 'N/A'}\n` +
            `Statut: ${c.statut_entreprise || 'N/A'}\n` +
            `Date de création: ${c.date_creation || 'N/A'}\n` +
            `Nombre d'établissements: ${c.nombre_etablissements || 'N/A'} (ouverts: ${c.nombre_etablissements_ouverts || 'N/A'})\n` +
            (c.dirigeants ? `Dirigeants: ${c.dirigeants}\n` : '') +
            `---`
          ).join('\n\n')}`
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Serveur MCP data.gouv.fr démarré');
  }
}

// Démarrage du serveur
const server = new DataGouvMCPServer();
server.run().catch(console.error); 