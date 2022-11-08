<template>
  <div>
    <section>
      <b-field label="Collections">
        <b-taginput
          v-model="tags"
          :data="filteredTags"
          autocomplete
          :open-on-focus="true"
          field="attributes.title"
          placeholder="Henri IV"
          @typing="getFilteredTags"
        >
        </b-taginput>
      </b-field>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      filteredTags: this.allCollectionsWithParents,
      isSelectOnly: false,
      tags: [],

      init: false,
    };
  },
  computed: {
    ...mapState("collections", ["allCollectionsWithParents", "collectionsSearchResults"]),
    ...mapState("search", ["selectedCollections"]),
  },
  watch: {
    tags() {
      this.setSelectedCollections(this.tags);
      this.performSearch();
    },
  },
  async created() {
    await this.fetchAll();
    this.tags = this.selectedCollections;
  },
  methods: {
    ...mapActions("collections", ["fetchAll"]),
    ...mapActions("search", ["setSelectedCollections", "performSearch"]),
    getFilteredTags(text) {
      this.filteredTags = this.allCollectionsWithParents.filter((option) => {
        return (
          option.attributes.title.toString().toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
</style>
