<template>
  <article>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <p class="title has-text-centered">
            Lettres
          </p>
          <p class="subtitle has-text-centered">
            de la Première Modernité
          </p>
          <div class="columns is-centered">
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/about"
                type="is-primary is-fullwidth"
              >
                Le portail
              </b-button>
            </div>
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/search"
                type="is-primary is-fullwidth"
              >
                Faire une recherche
              </b-button>
            </div>
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/collections"
                type="is-primary is-fullwidth"
              >
                Découvrir les collections
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Des correspondances du XV<sup>e</sup> au XVII<sup>e</sup> siècle
          </h2>
          <p class="has-text-justified mb-2">
            LPM présente le contenu de lettres missives de la fin du Moyen Âge et du début de l’époque moderne (vers
            1460-vers 1660). Il réunit des correspondances de toute nature – politiques, diplomatiques, commerciales ou
            savantes –, émanant d’hommes et de femmes d’État ou de personnages plus humbles, à travers des collections
            qui
            rassemblent des milliers de lettres ou qui contiennent quelques lettres seulement.
          </p>
          <h2 class="subtitle">
            Un portail d’éditions collaboratives
          </h2>
          <p class="has-text-justified mb-2">
            LPM rassemble des projets conduits par des partenaires différents qui mettent en commun leurs apports
            éditoriaux à travers une unique application de recherche. La participation aux entreprises éditoriales peut
            se
            faire à différents niveaux, conception et proposition de nouvelles collections, signalisation et
            téléchargement d’images d’originaux, renseignement des métadonnées, transcription et annotation éditoriale.
          </p>
          <h2 class="subtitle">
            Actualités
          </h2>
          <p class="has-text-justified mb-2">
            [Boutons de nouvelles collections et une ou des collections plus anciennes de manière aléatoire et
            changeante]

            [Des indications chiffrées
            • nombre de lettres (items)
            • nombre de collections]
          </p>
        </div>
      </div>
    </section>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/about"
                type="is-primary is-fullwidth"
              >
                Le portail
              </b-button>
            </div>
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/search"
                type="is-primary is-fullwidth"
              >
                Faire une recherche
              </b-button>
            </div>
            <div class="column is-4">
              <b-button
                tag="router-link"
                to="/collections"
                type="is-primary is-fullwidth"
              >
                Découvrir les collections
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: "HomePage",

  data() {
    return {
      isComponentModalActive: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
