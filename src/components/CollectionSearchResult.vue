<template>
  <div class="collection-card card">
    <div class="card-content">
      <div class="is-flex is-justify-content-space-between mb-4">
        <div>
          <collection-breadcrumb
            v-if="collection.parent !== null"
            :collection-id="collection.parent"
          />
          <span class="title is-flex is-justify-content-space-between">
            <router-link
              :to="{ name: 'collection', params: { collectionId: collection.id } }"
              class="mb-5"
              v-html="title"
            />
          </span>
        </div>
        <div class="ml-auto">
          Documents&nbsp;:&nbsp;{{
            collection.documentCount
          }}
        </div>
        <div class="ml-5">
          {{ collection.dateMin || "..." }} -
          {{ collection.dateMax || "..." }}
        </div>
      </div>

      <span
        class="description"
        v-html="description"
      />
      <div class="is-flex">
        <p class="pt-2 pr-2 pb-2 pl-3 ml-auto">
          Gérée par&nbsp;<a>{{ collection.admin.username }}</a>
        </p>
      </div>
    </div>

    <!-- Collection children -->
    <footer
      class="card-footer collect-card__children is-flex is-flex-direction-column"
    >
      <button
        class="show-hierarchy"
        @click="toggleHierarchy(collection.id)"
      >
        <i
          :class="`fas fa-caret-${hierarchyShown ? 'down': 'right'}`"
          class="caret"
        />&nbsp;Parcourir les collections
      </button>
      <div v-if="hierarchyShown">
        <collection-hierarchy :collection-id="collectionId" />
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
.collection-card {

  button.show-hierarchy {
    line-height: 1.5;
    font-size: 1rem;
    align-self: start;
    background: none;
    border: none;
  }

  button.expand-collection {
    background: none;
    border: none;
    line-height: 1.5;
    font-size: 1rem;
    padding: 0;
    width: 20px;
  }

  button .caret {
    width: 20px;
  }

  .card-footer {
    padding: 10px;
  }

  .title::v-deep, .description::v-deep {
    mark {
      background-color: yellow;
      color: black;
    }
  }
}
</style>
