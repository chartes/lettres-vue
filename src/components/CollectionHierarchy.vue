<template>
  <div v-if="!isLoading">
    <div
      v-for="collection of flattenedCollectionsTree([findRoot(collectionId).id])"
      :key="collection.id"
      :style="`margin-left: ${ 20 * (collection.depth + 1) }px;`"
    >
      <router-link
        :to="{name: 'collection', params: {collectionId: collection.id}}"
        :class="collection.id === collectionId ? 'active' : ''"
      >
        {{ collection.title }}
      </router-link>
    </div>
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

.router-link-active, .active {
  color: black;
  text-decoration: underline;
}
</style>
