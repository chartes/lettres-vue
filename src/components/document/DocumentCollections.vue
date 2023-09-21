<template>
  <div
    v-if="!collectionsLoading"
  >
    <b-autocomplete
      v-if="editable"
      v-model="searchedCollectionName"
      field="title"
      :disabled="savingCollections"
      :loading="savingCollections"
      :clear-on-select="true"
      :data="filteredCollections"
      :confirm-keys="['Enter']"
      placeholder="Ajouter une collection"
      class="mb-5"
      @select="option => handleSelected(option)"
    >
      <template slot-scope="props">
        <span
          v-for="(pathItem, index) of collectionPath(props.option.id)"
          :key="pathItem.id"
        >
          <template v-if="index > 0"> / </template>
          {{ pathItem.title }}
        </span>
      </template>
    </b-autocomplete>
    <ul>
      <li
        v-for="collection in sortedCollections"
        :key="collection.id"
      >
        <b-tag
          attached
          :closable="editable"
          aria-close-label="Remove from collection"
          size="is-medium"
          class="mb-1"
          @close="removeCollection(collection)"
        >
          <collection-breadcrumb :collection-id="collection.id" />
        </b-tag>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import sortBy from 'lodash/sortBy';
import CollectionBreadcrumb from "../CollectionBreadcrumb.vue";

export default {
  name: "DocumentCollections",
  components: {CollectionBreadcrumb},
  props: {
    editable: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      searchedCollectionName: '',
      savingCollections: false,
      error: false,
    };
  },
  computed: {
    ...mapState("document", ["document", "collections"]),
    ...mapState("collections", {collectionsLoading: "isLoading", allCollectionsById: "collectionsById"}),
    ...mapGetters("collections", {collectionPath: "path"}),
    sortedCollections() {
      return sortBy(this.collections, (c) => this.collectionPathAsText(c.id))
    },
    filteredCollections() {
      const words = this.searchedCollectionName.toLowerCase().trim().split(/\s+/)
      if (words.length === 1 && words[0] === "") {
        return []
      }
      const allCollections = Object.values(this.allCollectionsById);
      const alreadyLinkedCollectionsIds = Object.values(this.collections.map(col => col.id));
      const availableCollections = allCollections.filter((collection) => 
        !alreadyLinkedCollectionsIds.includes(collection.id)
      );
      const possibleCollections = availableCollections.filter(collection => {
        const lowerCasePath = this.collectionPathAsText(collection.id).toLowerCase();
        return words.every((word) => lowerCasePath.includes(word))
      });
      return sortBy(possibleCollections, (c) => this.collectionPathAsText(c.id))
    },
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("collections", {fetchCollections: "fetchAll"}),
    handleSelected(collection) {
      if (collection === null) {
        return
      }
      this.searchedCollectionName = '';
      this.error = false;
      this.savingCollections = true;
      this.$store
        .dispatch("document/addCollection", collection)
        .then(() => {
          this.error = false
        })
        .catch(() => {
          this.error = true
        }).finally(() => {
          this.savingCollections = false;
        });
        this.$store.dispatch("changelog/trackChanges", {
          objId: this.document.id,
          objType: 'document',
          userId: this.$store.state.user.current_user.id,
          msg: `Ajout dans la collection ${collection.title}`
        }).then(() => {
          console.log("changelog collection updated")
        })
        .catch(() => {
          console.log("changelog collection not updated")
        });
    },
    removeCollection(collection) {
      this.error = false;
      this.savingCollections = true;
      this.$store
        .dispatch("document/removeCollection", collection)
        .then(() => {
          this.error = false
        })
        .catch(() => {
          this.error = true
        }).finally(() => {
          this.savingCollections = false
        });
        this.$store.dispatch("changelog/trackChanges", {
          objId: this.document.id,
          objType: 'document',
          userId: this.$store.state.user.current_user.id,
          msg: `Suppression de la collection ${collection.title}`
        }).then(() => {
          console.log("changelog collection updated")
        })
        .catch(() => {
          console.log("changelog collection not updated")
        });

    },
    collectionPathAsText(collectionId) {
        const path = this.collectionPath(collectionId);
        return path.map(c => c.title).join(' ');
    }
  },
};
</script>

<style lang="scss"></style>
