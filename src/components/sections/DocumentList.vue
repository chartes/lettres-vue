<template>
  <div class="section">
    <div class="container">
      <div v-show="!loadingStatus">
        <div
          v-show="documents && documents.length > 5"
          class="has-text-centered"
        >
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

        <div
          v-show="documents && documents.length > 5"
          class="has-text-centered"
        >
          <pagination />
        </div>
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
