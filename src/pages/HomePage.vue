<template>
  <article>
    <section>
      <div class="container m-5">
        <div
          id="intro"
          class="bg-image content is-vcentered  pt-5"
        >
          <p class="title has-text-centered">
            Lettres
          </p>
          <p class="subtitle has-text-centered">
            de la Première Modernité
          </p>
          <div class="columns is-centered mx-5">
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
      <div class="container m-5">
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
      </div>
    </section>
    <section>
      <div class="container m-5">
        <h2 class="subtitle">
          Actualités
        </h2>
        <p class="has-text-justified mb-2">
          [Boutons de nouvelles collections et une ou des collections plus anciennes de manière aléatoire et
          changeante]
        </p>
        <p>
          [Des indications chiffrées
          • nombre de lettres (items)
          • nombre de collections]
        </p>
        <div class="container columns is-vcentered m-5">
          <div class="column is-4 padding-5">
            <div class="card has-text-centered">
              <img
                id="card_image"
                class="card-img-top m-5 is-inline-block"
                src="../assets/images/collections/collection1.jpg"
                alt="Card image cap"
              >
              <div class="card-body has-text-centered">
                <h5 class="card-title">
                  La correspondance de Catherine de Médicis
                </h5>
                <p class="card-text">
                  4708 documents
                </p>
              </div>
              <div class="card-footer is-flex is-justify-content-center">
                <b-button
                  tag="router-link"
                  to="/collections/1"
                  type="is-primary"
                >
                  Découvrir la collection
                </b-button>
              </div>
            </div>
          </div>
          <div class="column is-4 padding-5">
            <div class="card has-text-centered">
              <img
                id="card_image"
                class="card-img-top m-5 is-inline-block"
                src="../assets/images/collections/collection2.jpg"
                alt="Card image cap"
              >
              <div class="card-body has-text-centered">
                <h5 class="card-title">
                  La correspondance de Catherine de Médicis de 1571
                </h5>
                <p class="card-text">
                  257 documents
                </p>
              </div>
              <div class="card-footer is-flex is-justify-content-center">
                <b-button
                  tag="router-link"
                  to="/collections/2"
                  type="is-primary"
                >
                  Découvrir la sous-collection
                </b-button>
              </div>
            </div>
          </div>
          <div class="column is-4 padding-5">
            <div class="card has-text-centered">
              <img
                id="card_image"
                class="card-img-top m-5 is-inline-block"
                src="../assets/images/collections/collection3.jpg"
                alt="Card image cap"
              >
              <div class="card-body has-text-centered">
                <h5 class="card-title">
                  La correspondance de Henri IV
                </h5>
                <p class="card-text">
                  XXX documents
                </p>
              </div>
              <div class="card-footer is-flex is-justify-content-center">
                <b-button
                  tag="router-link"
                  to="/collections/3"
                  type="is-primary"
                >
                  Découvrir la collection
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import background_image from "../assets/images/about.jpg"

export default {
  name: "HomePage",
  computed: {
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
      allCollectionsWithParents: "allCollectionsWithParents",
    }),
  },
  data: function () {
    return {
      background_image: background_image
    }
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("search", ["performSearch"]),
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
#intro {
  background-image: url("../assets/images/about.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height:200px;
  width:auto;
}
#card_image {
  max-width: 250px;
}
</style>
