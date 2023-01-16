<template>
  <div>
    <section>
      <b-field label="Collections">
        <b-taginput
          v-model="tags"
          :data="filteredTags"
          autocomplete
          :open-on-focus="true"
          field="title"
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
      filteredTags: null,
      isSelectOnly: false,
      tags: [],

      init: false,
    };
  },
  computed: {
    ...mapState("collections", {allCollections: "collectionsById"}),
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
      this.filteredTags = Object.values(this.allCollections).filter((option) => {
        return (
          option.title.toString().toLowerCase().indexOf(text.toLowerCase()) >=
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
