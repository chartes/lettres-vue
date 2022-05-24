<template>
  <b-menu :activable="false" class="collection-tree-node">
    <b-menu-list>
      <b-menu-item
        @click="setSelectedCollectionId(collection.id)"
        class="collection collection-title"
        :class="selectedCollectionId === collection.id ? 'is-active' : ''"
        :label="collection.titleWithCount"
        :animation="null"
      >
      </b-menu-item>
      <b-menu-item
        v-for="child in collection.children"
        class="collection"
        :class="selectedCollectionId === child.id ? 'is-active' : ''"
        :label="`•  ${child.titleWithCount}`"
        :key="child.id"
        @click="setSelectedCollectionId(child.id)"
        :animation="null"
      >
        <ul class="collection-children">
          <li v-for="c in child.children" :key="c.id">
            <collection-tree-node :collection="child" :depth="depth + 1" />
          </li>
        </ul>
      </b-menu-item>
    </b-menu-list>
  </b-menu>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CollectionTreeNode",
  components: {},
  props: {
    collection: { type: Object, default: () => {}, required: true },
    depth: { type: Number, default: 0 },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("search", ["selectedCollectionId"]),
  },
  methods: {
    ...mapActions("search", ["setSelectedCollectionId"]),

    selectCollection() {
      console.warn("select", this.collection.id);
      this.setSelectedCollectionId(this.collection.id);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
.collection-tree-node {
  .collection {
    padding-left: 12px;
    margin-left: 0px;
    display: block;
    white-space: pre;

    border-radius: 2px;

    &:hover {
      cursor: pointer;
    }
  }
  .is-active {
    font-weight: bold !important;
    background-color: $coffee-light !important;
  }
  .collection-title {
    padding-left: 0px;
    text-transform: uppercase;
  }
  .collection-children {
    border-left: 1px solid $coffee;
  }
}
</style>
