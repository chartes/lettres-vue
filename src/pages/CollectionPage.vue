<template>
  <div>
    <router-link :to="{ name: 'collections' }" class="mt-5 mb-5"
      ><i class="fas fa-arrow-left ml-1 mr-3"></i>Toutes les collections</router-link
    >
    <collection-card
      :collection-id="parseInt(collectionId)"
      :editable="true"
      class="m-3"
    />
  </div>
</template>

<script>
import CollectionCard from "@/components/CollectionCard.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "CollectionsPage",
  components: { CollectionCard },
  props: {
    collectionId: {
      type: String,
      required: true,
    },
  },
  computed: {},
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("search", ["performSearch", "setSelectedCollectionId"]),
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
