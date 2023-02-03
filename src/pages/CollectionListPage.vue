<template>
  <div class="container">
    <div class="m-5">
      <p class="title">
        Les collections
      </p>
      <!--<p class="has-text-justified mb-2">
        Les collections constituent des ensembles de taille variable constitués autour de logiques décidées par leurs responsables scientifiques. La plus répandue est celle qui consiste à éditer la correspondance active d’un individu. D’autres choix sont également recevables, comme les lettres reçues par un individu (correspondance passive) ou les lettres écrites par des groupes de personnes ayant entre elles un lien familial ou professionnel.
      </p>
      <p class="has-text-justified mb-2">
        Dans l’attente d’une présentation selon des regroupements thématiques, il est actuellement possible d’effectuer une recherche sur cette page selon une liste où les correspondances sont classées par ordre alphabétique du nom de l’individu expéditeur ou destinataire.
      </p>-->
    </div>


    <div v-if="!isLoading">
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
            @click="navigate"
          />
        </router-link>
      </span>

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
      <!-- if admin show default collection of unclassified documents -->
      <div v-if="current_user && current_user.isAdmin">
        <div v-if="searchTerm === ''">
          <!-- Collection cards -->
          <collection-list-item
            v-for="rootCollection of rootCollections"
            :key="rootCollection.id"
            class="m-3"
            :collection-id="rootCollection.id"
          />
        </div>
        <div v-else>
          <collection-search-result
            v-for="collection of searchResults"
            :key="collection.id"
            class="m-3"
            :collection-id="collection.id"
            :search-term="searchTerm"
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
            class="m-3"
            :collection-id="rootCollection.id"
          />
        </div>
        <div v-else>
          <collection-search-result
            v-for="collection of activesearchResults"
            :key="collection.id"
            class="m-3"
            :collection-id="collection.id"
            :search-term="searchTerm"
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
</style>
