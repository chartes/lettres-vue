<template>
  <div class="section">
    <div class="container">
      <div class="has-text-centered">
        <pagination />
      </div>

      <ul v-show="!loadingStatus" id="preview-cards" class="pb-5 pt-5">
        <li v-for="doc in documents" :key="doc.id">
          <document-preview-card
            v-if="!!doc.attributes['is-published'] || current_user"
            :doc-id="doc.id"
          />
        </li>
      </ul>

      <div v-if="loadingStatus" class="mt-5">
        <document-preview-card-skeleton v-for="i in 5" :key="i" />
      </div>

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
    DocumentPreviewCard: () => import("../document/DocumentPreviewCard"),
    DocumentPreviewCardSkeleton: () => import("../ui/DocumentPreviewCardSkeleton"),
    Pagination,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("search", ["documents", "loadingStatus"]),
    ...mapState("user", ["current_user"]),
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.section {
  width: 100%;
}
progress {
  margin-top: 30px;
}
</style>
