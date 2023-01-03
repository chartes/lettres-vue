<template>
  <div class="collection-card card">
    <div class="columns is-vcentered">
      <div
        class="column is-2 has-text-centered"
      >
        <img
          id="card_image"
          class="card-img-left m-2 is-inline-block"
          :src="getImgUrl(collectionId)"
          alt="Card image cap"
        >
      </div>
      <div class="column">
        <div class="card-content">
          <div class="is-flex is-justify-content-space-between mb-4">
            <div>
              <span class="title is-flex is-justify-content-space-between">
                <router-link
                  :to="{ name: 'collection', params: { collectionId: collection.id } }"
                  class="mb-5"
                >
                  {{ collection.title }}
                </router-link>
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

          <span v-html="collection.description" />
          <div class="is-flex">
            <p class="pt-2 pr-2 pb-2 pl-3 ml-auto">
              Gérée par&nbsp;<a>{{ collection.admin.username }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Collection children -->
    <footer
      v-if="collection.children.length > 0"
      class="card-footer collect-card__children is-flex is-flex-direction-column"
    >
      <button
        class="show-children"
        @click="toggleExpanded(collection.id)"
      >
        <i
          :class="`fas fa-caret-${expandedById[collection.id] ? 'down': 'right'}`"
          class="caret"
        />&nbsp;Parcourir les collections
      </button>
      <div v-if="expandedById[collection.id]">
        <div
          v-for="childCollection of flattenedCollectionsTree(collection.children, parentExpanded)"
          :key="childCollection.id"
          :style="`margin-left: ${ 20 * childCollection.depth + (childCollection.children.length > 0 ? 0 : 20)}px;`"
        >
          <button
            v-if="childCollection.children.length > 0"
            class="expand-collection"
            @click="toggleExpanded(childCollection.id)"
          >
            <i :class="`fas fa-caret-${expandedById[childCollection.id] ? 'down': 'right'}`" />
          </button><router-link :to="{name: 'collection', params: {collectionId: childCollection.id}}">
            {{ childCollection.title }}&nbsp;-&nbsp; {{ childCollection.documentCount }} document{{ childCollection.documentCount > 1 ? "s" : "" }}
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

import {mapState, mapGetters} from "vuex";

export default {
  name: "CollectionListItem",
  props: {
    collectionId: {
      type: Number,
      required: true,
    }
  },
  data() {
    const collectionsTree =  this.$store.getters["collections/flattenedCollectionsTree"]([this.collectionId])
    return {
      expandedById: Object.fromEntries(collectionsTree.map(col => [col.id, false])),
    }
  },
  computed: {
    ...mapState("collections", ["collectionsById"]),
    ...mapGetters("collections", ["flattenedCollectionsTree"]),
    collection() {
      return this.$store.state.collections.collectionsById[this.collectionId]
    }
  },
  methods: {
    toggleExpanded(collectionId) {
      this.expandedById[collectionId] = !this.expandedById[collectionId]
    },
    parentExpanded(collection) {
      return collection.parent === null || this.expandedById[collection.parent]
    },
    getImgUrl: function (img) {
      let defaultImage = "@/assets/images/collections/collection1.jpg" // just set default
      try {
        return require('@/assets/images/collections/collection' + img + '.jpg')
      }   catch (e) {
        //console.log('mon erreur : ',e)
        return require('@/assets/images/collections/default.jpg')
      }
    },
  },
};
</script>

<style scoped lang="scss">
.collection-card {

  button.show-children {
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
}
</style>
