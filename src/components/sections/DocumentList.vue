<template>
  <div
    v-if="documents && documents.length > 0"
    class="section"
  >
    <div class="container">
      <div class="has-text-centered">
        <pagination />
      </div>
      <ul
        id="preview-cards"
        class="pb-5 pt-5"
      >
        <li
          v-for="doc in documents"
          :key="doc.id"
        >
          <document-preview-card
            v-if="!!doc.attributes['is-published'] || current_user"
            :doc-id="doc.id"
          />
        </li>
      </ul>
      <div class="has-text-centered">
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Pagination from "../ui/Pagination";

export default {
  name: "DocumentList",
  components: {
    DocumentPreviewCard: () =>
      import(
        /* webpackChunkName: "home-pages" */ "../document/DocumentPreviewCard"
      ),
    Pagination
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("document", ["documents", "documentLoading"]),
    ...mapState("user", ["current_user"])
  },
  methods: {}
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.section {
  width: 100%;
}
</style>
