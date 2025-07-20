import axios from 'axios';

async function testSearchCompanies() {
  try {
    console.log("🧪 Test de recherche d'entreprise via recherche-entreprises.api.gouv.fr...");
    const query = '';
    const pageSize = 5;
    const activite_principale = '62.02A'; // Conseil pour les affaires et autres conseils de gestion
    const code_postal = '94130';
    const tranche_effectif_salarie = '01'; // 0 salarié
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=${pageSize}` +
     `&activite_principale=${encodeURIComponent(activite_principale)}` +
      `&code_postal=${encodeURIComponent(code_postal)}` //+
     // `&tranche_effectif_salarie=${encodeURIComponent(tranche_effectif_salarie)}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      const data = response.data;
      console.log(`✅ Connexion à l'API recherche-entreprises.api.gouv.fr réussie`);
      console.log(`🏢 ${data.total_results} entreprises trouvées pour "${query}"`);
      if (data.results && data.results.length > 0) {
        console.log('\n📋 Premiers résultats:');
        data.results.forEach((company: any, index: number) => {
          console.log(`\n${index + 1}. **${company.nom_entreprise}**`, company);
          console.log(`   SIREN: ${company.siren}`);
          console.log(`   SIRET siège: ${company.siret_siege_social}`);
          console.log(`   Forme: ${company.forme_juridique}`);
          console.log(`   Activité: ${company.activite_principale}`);
          console.log(`   Adresse: ${company.adresse_siege_social}`);
        });
      }
    } else {
      console.log("❌ Erreur de connexion à l'API recherche-entreprises.api.gouv.fr");
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error instanceof Error ? error.message : String(error));
  }
}

// Exécuter le test si ce fichier est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  //testDataGouvAPIs();
  testSearchCompanies();
} 