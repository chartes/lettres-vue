<template>
  <div class="container">
    <div class="m-5">
      <p class="title">Les collections</p>
      <p class="has-text-justified mb-2">
        Les collections constituent des ensembles de taille variable constitués autour de logiques décidées par leurs responsables scientifiques. La plus répandue est celle qui consiste à éditer la correspondance active d’un individu. D’autres choix sont également recevables, comme les lettres reçues par un individu (correspondance passive) ou les lettres écrites par des groupes de personnes ayant entre elles un lien familial ou professionnel.
      </p>
      <p class="has-text-justified mb-2">
        Dans l’attente d’une présentation selon des regroupements thématiques, il est actuellement possible d’effectuer une recherche sur cette page selon une liste où les correspondances sont classées par ordre alphabétique du nom de l’individu expéditeur ou destinataire.
      </p>
    </div>
    <div>
      <span class="column" v-for="c in allCollectionsWithParents" :key="c.id">
        <collection-card-list :collection-id="String(c.id)" :editable="true" class="m-3" />
      </span>
    </div>
  </div>
</template>

<script>
import CollectionCardList from "@/components/CollectionCardList.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "CollectionsPage",
  components: { CollectionCardList },
  computed: {
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
      allCollectionsWithParents: "allCollectionsWithParents",
    }),
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
</style>
