<template>
  <article>
    <section>
      <div class="narrow-container">
        <!--<div class="row">
          {{ allCollections }}
        </div>-->
        <div
          class="numbers row is-flex"
          style="text-align: center;"
        >
          <div class="column col_meta">
            <div class="is-flex is-flex-direction-column">
              <div class="row metadata-label">
                <span>LETTRES</span>
              </div>
              <div class="row">
                <router-link
                  :to="{ name: 'search' }"
                  class="navbar-start-item"
                >
                  <span class="metadata">{{ documentsTotal }}</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="column col_meta">
            <div class="is-flex is-flex-direction-column">
              <div class="row metadata-label">
                <span>COLLECTIONS</span>
              </div>
              <div class="row">
                <router-link
                  :to="{ name: 'collections' }"
                  class="navbar-start-item"
                >
                  <span
                    class="metadata"
                  >
                    {{ collectionsCount }}
                  </span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="column col_meta">
            <div class="is-flex is-flex-direction-column">
              <div class="row metadata-label">
                <span>PERSONNES</span>
              </div>
              <div class="row">
                <router-link
                  :to="{ name: 'persons' }"
                  class="navbar-start-item"
                >
                  <span class="metadata">{{ personsCount }}</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="column col_meta">
            <div class="is-flex is-flex-direction-column">
              <div class="row metadata-label">
                <span>LIEUX</span>
              </div>
              <div class="row">
                <router-link
                  :to="{ name: 'places' }"
                  class="navbar-start-item"
                >
                  <span class="metadata">{{ placesCount }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div
          class="homepage-intro row m-auto is-flex is-justify-content-center"
        >
          <div class="content is-inline-block">
            <h3>Des correspondances <br> du XV<sup>e</sup> au XVII<sup>e</sup> siècle</h3>
            <p class="has-text-justified">
              Ecco présente le contenu de lettres missives de la fin du Moyen Âge et du début de l’époque moderne (vers
              1460-vers 1660). Il réunit des correspondances de toute nature – politiques, diplomatiques, commerciales ou
              savantes –, émanant d’hommes et de femmes d’État ou de personnages plus humbles, à travers des collections
              qui
              rassemblent des milliers de lettres ou qui contiennent quelques lettres seulement.
            </p>
          </div>
          <div class="content is-inline-block">
            <h3>Un portail d’éditions <br> collaboratives</h3>
            <p class="has-text-justified mb-2">
              Ecco rassemble des projets conduits par des partenaires différents qui mettent en commun leurs apports
              éditoriaux à travers une unique application de recherche. La participation aux entreprises éditoriales peut
              se
              faire à différents niveaux, conception et proposition de nouvelles collections, signalisation et
              téléchargement d’images d’originaux, renseignement des métadonnées, transcription et annotation éditoriale.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="narrow-container">
        <div class="row m-auto is-flex">
          <div class="content is-inline-block">
            <h3>Focus</h3>
            <!--<p class="has-text-justified mb-2">
              [Boutons de nouvelles collections et une ou des collections plus anciennes de manière aléatoire et
              changeante]
            </p>-->
          </div>
        </div>
        <div class="row m-auto">
          <div
            class="container columns cards"
          >
            <div
              v-for="featured in featured_collections"
              :key="featured.id"
              class="column is-4 is-inline-block"
            >
              <div class="card">
                <router-link
                  :to="{ name: 'collection', params: {collectionId: featured.id } }"
                >
                  <div class="card-header is-flex is-justify-content-center">
                    <div class="card-image-parent">
                      <img
                        id="card_image"
                        class="card-img-top is-inline-block"
                        :src="getImgUrl(featured.id)"
                        alt="Card image cap"
                      >
                    </div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      collection {{ featured.id }}
                    </h5>
                    <p
                      v-if="current_user"
                      class="card-text"
                    >
                      {{ featured.documentCount }} documents
                    </p>
                    <p
                      v-else
                      class="card-text"
                    >
                      {{ featured.publishedCount }} documents
                    </p>
                  </div>
                  <div class="card-footer is-flex">
                    Curateur :&nbsp;<a>{{ featured.admin.username }}</a>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- featured manual <div class="row m-auto">
          <div class="container columns is-vcentered m-5">
            <div class="column is-4 padding-5">
              <div class="card has-text-centered">
                <router-link
                  :to="{ name: 'collection', params: { collectionId: 1 } }"
                >
                  <img
                    id="card_image"
                    class="card-img-top m-5 is-inline-block"
                    src="../assets/images/collections/collection1.jpg"
                    alt="Card image cap"
                  >
                  <div class="card-body has-text-centered">
                    <h5 class="card-title px-6">
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
                </router-link>
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
                  <h5 class="card-title px-6">
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
                  <h5 class="card-title px-6">
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
        </div>-->
      </div>  
    </section>
  </article>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "HomePage",
  data: function () {
      return {
          collectionsCount: 0,
          documentsTotal: 0,
          personsCount: 0,
          placesCount: 0
      };
  },
  computed: {
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
      allCollectionsWithParents: "allCollectionsWithParents",
      allCollections: "collectionsById",
    }),
    ...mapState("user", ["current_user"]),
    featured_collections: function () {
      let featured_collectionIds=[1, 2, 78];
      let featured = Object.values(this.allCollections).filter(item=> {
        return featured_collectionIds.includes(item.id)
      });
      console.log('featured : ', featured)
      return featured;
    }
  },
  async created() {
    console.log("clear state on collection navigation")
    await this.resetSearchState();
    await this.counts();
    this.$store.state.layout.showLeftSideBar = false;
  },
  methods: {
    ...mapActions("search", ["resetSearchState", "getCounts"]),
    counts: async function () {
      let response = await this.getCounts();
      this.documentsTotal = response["documents"];
      this.personsCount = response["persons"];
      this.placesCount = response["placenames"];
      this.collectionsCount = response["collections"];
    },
    getImgUrl: function (img) {
      try {
        return require('@/assets/images/collections/collection' + img + '.jpg')
      } catch (e) {
        //console.log('erreur image de collection : ',e)
        try {
          return require('@/assets/images/collections/collection' + this.findRoot(img).id + '.jpg')
        } catch (e) {
          return require('@/assets/images/collections/default.jpg')
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";


article > section:first-child > .narrow-container {
  margin-top: 115px;

  @include on-tablet {
    margin-top: 50px;
  }

  @include on-mobile {
    margin-top: 25px;
    margin-bottom: 50px;
  }

}

article > section > .narrow-container > .numbers,
article > section > .narrow-container {
  margin-bottom: 85px;

  @include on-mobile {
    margin-bottom: 50px;
  }
}
article > section > .narrow-container > .numbers {
  @include on-mobile {
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
}
article > section .homepage-intro {
  gap: 95px;

  @include on-tablet {
    gap: 40px;
  }

  @include on-mobile {
    flex-direction: column;
    gap: 0;
  }
}

article > section .content h3 {
  font-family: $family-primary;
  font-size: 28px;
  color: #000000;
  margin-bottom: 40px;

  @include on-tablet {
    font-size: $font-size-title-tablet;
    margin-bottom: 20px;
  }

  @include on-mobile {
    font-size: $font-size-title-mobile;
    margin-bottom: 20px;
  }
}

article > section .content p {
  font-family: $family-primary;
  font-size: 20px;
  line-height: 1.25;

  @include on-tablet {
    font-size: $font-size-text-tablet;
  }

  @include on-mobile {
    font-size: $font-size-text-mobile;
  }
}

#card_image {
  max-height: 250px;
}
.metadata-label > span {
  font-family: $family-primary;
  font-size: 16px;
  font-weight: 600 !important;
  line-height: 1;
  color: #6D7278;
  text-align: center;
  text-transform: uppercase;

  @include on-mobile {
    font-size: 13px;
  }
}
.metadata {
  font-family: $family-primary;
  font-size: 50px;
  line-height: 1;
  font-weight: 700;
  text-align: center;

  @include on-tablet {
    font-size: 40px;
  }

  @include on-mobile {
    font-size: 25px;
  }
}

.column.col_meta {
  flex: 28% 0 0;
  padding: 0;
  border-right: solid 8px;
  border-right-color: rgba(180, 0, 80);

  @include on-mobile {
    flex: 50% 0 0 !important;
    margin-bottom: 20px;
    border: none !important;

    &:nth-child(2) {
      border-right: none;
    }
  }
}
.col_meta:first-child,
.col_meta:last-child {
  flex: 22% 0 0;
}
.col_meta:last-child {
  border: none;
}
.col_meta > div {
  padding: 10px 0 15px;

  @include on-mobile {
    float: none !important;
  }

}
.col_meta:first-child > div {
  float: left;
}
.col_meta:last-child > div {
  float: right;
}
.col_meta:nth-child(2n+1) .metadata {
  color: #FF0052;
}
.col_meta:nth-child(2n) .metadata {
  color: #C00055;
}


.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
  margin: 0;

  @include on-small-tablet {
    gap: 20px
  }
}

.cards .column {
  flex: calc( 33.33% - 20px) 0 0;
  width: calc( 33.33% - 20px) !important;
  padding: 0;

  @include on-small-tablet {
    flex: calc( 50% - 10px) 0 0;
    width: calc( 50% - 10px) !important;
  }

  @include on-small-mobile {
    flex: 100% 0 0;
    width: 100% !important;
  }
}

.card {
  height: 100%;
  overflow: hidden;
  background-color: #F0F0F0;
  border-radius: 10px;
  box-shadow: none;
  padding: 25px 25px 30px;

  a {
    font-family: $family-primary;
    font-size: 18px;
    font-weight: 400;
    color: #4A4A4A;

    @include on-mobile {
      font-size: 16px;
    }

    &:hover {
      .card-body {
        h5.card-title {
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 2px;
        }
      }
    }
  }

  .card-header {
    box-shadow: none;
    padding-bottom: 25px;

    .card-image-parent {
      width: 170px;
      height: 170px;
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        margin: 0;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  .card-body {
    h5.card-title {
      font-size: 20px;
      font-weight: 500;
      color: #C00055;

      @include on-mobile {
        font-size: 18px;
      }
    }
  }

  .card-footer {
    padding-top: 30px;

    @include on-tablet {
      flex-direction: column;
    }

  }
}

.portail_button {
  background-color: transparent;
  color: white;
}
section > .container {
  @include on-tablet {
    max-width: 100% !important;
    margin: 0 $container-tablet-margin !important;
  }
}


/*.search_row {
  background-color: rgba(35, 9, 20);
  padding: 5px;
}*/
/*a.button {
  border: none !important;
  outline: none !important;
}*/

</style>
