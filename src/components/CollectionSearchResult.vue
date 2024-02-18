<template>
  <div class="collection-card card">
    <!-- Card header : thummbnail, title, documents count, dates -->
    <div
      class="card-header is-flex is-align-items-center"
      :class="expandedById[collection.id] ? 'expanded': ''"
    >
      <div class="collection-thumbnail">
        <img
          id="card_image"
          class="card-img-left is-inline-block"
          :src="getImgUrl(collectionId)"
          alt="Card image cap"
        >
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
          <span>{{ current_user ? collection.dateMin || "..." : collection.dateMinPub || "..." }}</span>
          <span>{{ current_user ? collection.dateMax || "..." : collection.dateMaxPub || "..." }}</span>
        </div>
        <div v-if="current_user">
          <span class="documents-count">{{ collection.documentCount }}</span>
          <span class="documents-count-label"> document{{ collection.documentCount > 1 ? "s" : "" }}</span>
        </div>
        <div v-else>
          <span class="documents-count">{{ collection.publishedCount }}</span>
          <span class="documents-count-label"> document{{ collection.publishedCount > 1 ? "s" : "" }}</span>
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
      :class="expandedById[collection.id] ? 'expanded': ''"
    >
      <button
        class="show-children"
        @click="toggleExpanded(collection.id)"
      >
        Parcourir la collection
      </button>
      <div v-if="expandedById[collection.id]">
        <div
          v-for="childCollection of flattenedCollectionsTree(collection.children, parentExpanded)"
          :key="childCollection.id"
          :style="`margin-left: ${ 20 * childCollection.depth + (childCollection.children.length > 0 ? 0 : 20)}px;`"
          class="child-collection"
          :class="expandedById[childCollection.id] ? 'expanded': ''"
        >
          <button
            v-if="childCollection.children.length > 0"
            class="expand-collection"
            @click="toggleExpanded(childCollection.id)"
          />
          <router-link :to="{name: 'collection', params: {collectionId: childCollection.id}}">
            {{ childCollection.title }}&nbsp;-&nbsp; {{ childCollection.documentCount }} document{{ childCollection.documentCount > 1 ? "s" : "" }}
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

import escapeRegExp from "lodash/escapeRegExp"
import {mapState, mapGetters} from "vuex";
import CollectionBreadcrumb from "./CollectionBreadcrumb.vue";

export default {
  name: "CollectionSearchResult",
  components: {
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
    const collectionsTree =  this.$store.getters["collections/flattenedCollectionsTree"]([this.collectionId])
    return {
      expandedById: Object.fromEntries(collectionsTree.map(col => [col.id, false])),
    }
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("collections", ["collectionsById"]),
    ...mapGetters("collections", ["flattenedCollectionsTree"]),
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
    toggleExpanded(collectionId) {
      this.expandedById[collectionId] = !this.expandedById[collectionId]
    },
    parentExpanded(collection) {
      return collection.parent === null || this.expandedById[collection.parent]
    },
    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
    getImgUrl: function (img) {
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
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_collection.collection-list-item.scss";
</style>
