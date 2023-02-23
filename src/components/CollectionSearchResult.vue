<template>
  <div class="collection-card card">
    <!-- Card header : thummbnail, title, documents count, dates -->
    <div
      class="card-header is-flex is-align-items-center"
      :class="hierarchyShown ? 'expanded': ''"
    >
      <div class="collection-thumbnail">
      </div>
      <div class="collection-title-wrapper">
        <collection-breadcrumb
          v-if="collection.parent !== null"
          :collection-id="collection.parent"
          class="collection-parent-title"
        />
        <router-link
          :to="{ name: 'collection', params: { collectionId: collection.id } }"
          class="collection-title"
          v-html="title"
        />
      </div>
      <div class="collection-infos is-flex is-flex-direction-column">
        <div class="collection-dates is-flex">
          <span>{{ collection.dateMin || "..." }}</span>
          <span>{{ collection.dateMax || "..." }}</span>
        </div>
        <div>
          <span class="documents-count">{{ collection.documentCount }}</span>
          <span class="documents-count-label"> documents</span>
        </div>
      </div>
    </div>
    <!-- Card body : description -->
    <div class="card-body card-content">
      <div
          class="collection-description"
          v-html="description"
      />
      <div class="collection-metadata is-flex">
        <p>
          <label>Curateur :</label>&nbsp;<a>{{ collection.admin.username }}</a>
        </p>
      </div>
    </div>
    <!-- Card footer : collection children -->
    <footer
      v-if="collection.children.length > 0"
      class="card-footer collect-card__children is-flex is-flex-direction-column"
      :class="hierarchyShown ? 'expanded': ''"
    >
      <button
          class="show-children show-hierarchy"
          @click="toggleHierarchy(collection.id)"
      >
        Parcourir la collection
      </button>
      <div v-if="hierarchyShown">
        <collection-hierarchy
            :collection-id="collectionId"
            class="child-collection"
        />
      </div>
    </footer>
  </div>
</template>

<script>

import escapeRegExp from "lodash/escapeRegExp"

import CollectionHierarchy from "./CollectionHierarchy.vue";
import CollectionBreadcrumb from "./CollectionBreadcrumb.vue";

export default {
  name: "CollectionSearchResult",
  components: {
    CollectionHierarchy,
    CollectionBreadcrumb,
  },
  props: {
    collectionId: {
      type: Number,
      required: true,
    },
    searchTerm: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      hierarchyShown: false
    }
  },
  computed: {
    collection() {
      return this.$store.state.collections.collectionsById[this.collectionId]
    },
    title() {
      return this.highlight(this.collection.title)
    },
    description() {
      if (this.collection.description === null) {
        return null;
      }
      return this.highlight(this.collection.description)
    },
  },
  methods: {
    toggleHierarchy() {
      this.hierarchyShown = !this.hierarchyShown
    },
    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_collection.collection-list-item.scss";
</style>
