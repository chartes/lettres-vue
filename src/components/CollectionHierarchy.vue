<template>
  <div v-if="!isLoading">
    <b-menu-list>
      <b-menu-item
        v-for="collection of flattenedCollectionsTree([findRoot(collectionId).id])"
        :key="collection.id"
        tag="router-link"
        :active="collection.id === collectionId "
        :label="collection.title"
        :to="{name: 'collection', params: {collectionId: collection.id}}"
        :style="`padding: 0; margin-left: ${ 20 * (collection.depth) }px;`"
      />
    </b-menu-list>
  </div>
</template>

<script>
import { mapGetters, mapState} from "vuex";

export default {
  name: "CollectionHierarchy",
  props: {
    collectionId: {
      type: Number,
      required: true,
    },

  },
  computed: {
    ...mapGetters("collections", ['findRoot', 'flattenedCollectionsTree']),
    ...mapState("collections", ['isLoading'])
  },
};
</script>

<style scoped lang="scss">
::v-deep {
  li a.is-active {
    background-color: #62959C;
  }
}
</style>
