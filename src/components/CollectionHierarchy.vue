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
        :style="`padding-left: ${ 20 * (collection.depth) }px;`"
        :class="collection.id === collectionId ? 'is-active' : ''"
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
  li.is-active {
    background-color: #CB2158;

    a {
      background: none;
      padding: 4px 10px 5px;
    }
  }

  li {
    font-size: 16px;

    &:first-child a:not(.is-active) {
      color: #CB2158;
      font-weight: 500;
    }

    &:first-child a {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #CCCCCC;
      margin-bottom: 10px;
    }

    a {
      position: relative;
    }

    &:not(:first-child) a::after {
      content: "";
      position: absolute;
      left: -1px;
      top: 12px;
      display: inline-block;
      width: 10px;
      height: 11px;
      border-left: 1px solid #FF0052;
      border-bottom: 1px solid #FF0052;
    }
  }
}
</style>
