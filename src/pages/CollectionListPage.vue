<template>
  <div class="narrow-container">
    <div class="m-5">
      <!--<p class="has-text-justified mb-2">
        Les collections constituent des ensembles de taille variable constitués autour de logiques décidées par leurs responsables scientifiques. La plus répandue est celle qui consiste à éditer la correspondance active d’un individu. D’autres choix sont également recevables, comme les lettres reçues par un individu (correspondance passive) ou les lettres écrites par des groupes de personnes ayant entre elles un lien familial ou professionnel.
      </p>
      <p class="has-text-justified mb-2">
        Dans l’attente d’une présentation selon des regroupements thématiques, il est actuellement possible d’effectuer une recherche sur cette page selon une liste où les correspondances sont classées par ordre alphabétique du nom de l’individu expéditeur ou destinataire.
      </p>-->
    </div>

    <div v-if="!isLoading">

      <div class="collection-list-header is-flex is-justify-content-space-between is-align-items-center">
        <div class="search-container">
          <b-field>
            <b-input
                v-model="searchTerm"
                placeholder="Rechercher une collection"
                type="search"
                icon-right="close-circle"
                icon-right-clickable
                @icon-right-click="searchTerm=''"
            />
          </b-field>
        </div>
        <span
            v-if="current_user && current_user.isAdmin"
            class="column"
        >
          <router-link
              v-slot="{ navigate }"
              to="/collections/create"
              custom
          >
            <b-button
                type="is-primary"
                label="Créer une collection"
                class="create-collection-btn"
                @click="navigate"
            />
          </router-link>
        </span>
        <span>
          <div class="pagination-controls">
            <a
              class="first-page"
              href=""
            >
            </a>
            <a
              class="previous-page"
              href=""
            >
            </a>
            <input
              class="current-page"
              type="text"
              value="1"
            />
            <span class="label-sur-page">sur</span>
            <span class="total-pages">150</span>
            <a
              class="next-page"
              href=""
            >
            </a>
            <a
              class="last-page"
              href=""
            >
            </a>
          </div>
        </span>
      </div>

      <!-- if admin show default collection of unclassified documents -->
      <div v-if="current_user && current_user.isAdmin">
        <div v-if="searchTerm === ''">
          <!-- Collection cards -->
          <collection-list-item
            v-for="rootCollection of rootCollections"
            :key="rootCollection.id"
            :collection-id="rootCollection.id"
            class="collection-list-item"
          />
        </div>
        <div v-else>
          <collection-search-result
            v-for="collection of searchResults"
            :key="collection.id"
            :collection-id="collection.id"
            :search-term="searchTerm"
            class="collection-list-item"
          />
        </div>
      </div>
      <!-- if not admin (contributor or visitor, do not show default collection of unclassified documents -->
      <div v-else>
        <div v-if="searchTerm === ''">
          <!-- Collection cards -->
          <collection-list-item
            v-for="rootCollection of activeRootCollections"
            :key="rootCollection.id"
            :collection-id="rootCollection.id"
            class="collection-list-item"
          />
        </div>
        <div v-else>
          <collection-search-result
            v-for="collection of activesearchResults"
            :key="collection.id"
            :collection-id="collection.id"
            :search-term="searchTerm"
            class="collection-list-item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapActions, mapGetters, mapState} from "vuex";
import CollectionListItem from "@/components/CollectionListItem.vue"
import CollectionSearchResult from "@/components/CollectionSearchResult.vue"

export default {
  name: "CollectionsPage",
  components: {
    CollectionListItem,
    CollectionSearchResult,
  },
  data() {
    return {
      searchTerm: "",
    }
  },

  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("collections", ["isLoading"]),
    ...mapGetters("collections", ["rootCollections"]),
    searchResults() {
      return this.$store.getters['collections/search'](this.searchTerm)
    },
    activeRootCollections(){
      return this.rootCollections.filter(function(coll){
        if (coll.title !== "Non triées") {
          return coll
        }
      })
    },
    activesearchResults(){
      return this.searchResults.filter(function(coll){
        if (coll.title !== "Non triées") {
          return coll
        }
      })
    }
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/objects/collection.scss";
@import "@/assets/sass/components/_buttons.scss";

.collection-list-header {
  margin-bottom: 15px;
}

.collection-list-item {
  margin-bottom: 50px;
}

input[type=text],
input[type=search] {
  height: auto;
  padding: 4px 30px 5px 10px !important;
  background-color: #FFFFFF;
  border: solid 1px #C5C5C5;
  border-radius: 5px;
  box-shadow: none;
}

.control.has-icons-left .icon,
.control.has-icons-right .icon {
  width: 30px !important;
  height: 100% !important;
  padding: 0;
}


.pagination-controls {
  display: flex;
  align-items: center;

  & > * {
    display: inline-block;
    width: 38px;
    height: 38px;
    margin-right: 4px;
  }
  & > a {
    display: inline-block;
    width: 38px;
    height: 38px;
    background-color: #C3C3C3;
    border-radius: 3.2px;
  }
  & > a.first-page {
    background: #C3C3C3 url(../assets/images/icons/page_debut.svg) center / 28px auto no-repeat;
  }
  & > a.previous-page {
    background: #C3C3C3 url(../assets/images/icons/page_precedent.svg) center / 28px auto no-repeat;
  }
  & > a.next-page {
    background: #C3C3C3 url(../assets/images/icons/page_suivant.svg) center / 28px auto no-repeat;
  }
  & > a.last-page {
    background: #C3C3C3 url(../assets/images/icons/page_fin.svg) center / 28px auto no-repeat;
  }
  & > input[type=text] {
    height: 38px !important;
    padding: 0 !important;
    border: 1px solid #C00055;
    border-radius: 3.2px;

    font-family: $family-primary;
    font-size: 18px;
    color: #CB2158;
    font-weight: 800;
    text-align: center;
    text-decoration: none;

    &:focus {
      outline: 1px solid #C00055;
    }
  }

  & > span.label-sur-page {
    font-family: $family-primary;
    font-size: 11px;
    line-height: 38px;
    color: #979797;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }

  & > span.total-pages {
    background-color: #DFDFDF;
    border-radius: 3.2px;

    font-family: $family-primary;
    font-size: 18px;
    line-height: 38px;
    color: #818181;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
  }
}

</style>
