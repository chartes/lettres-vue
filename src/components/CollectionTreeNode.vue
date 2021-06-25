<template>
  <div :id="`collection-${collection.id}`">
    <b-collapse
      class="collection-tree"
      :class="depth > 0 ? 'with-border' : ''"
      animation="none"
      :open.sync="isOpen"
    >
      <div
        slot="trigger"
        class="collection tag is-medium is-white"
        :class="collection.id === selectedCollectionId ? 'is-active' : ''"
      >
        <span
          class="collection-title is-pulled-left is-unselectable"
          role="button"
          @click.prevent="selectCollection"
        >
          {{ collection.titleWithCount }}
        </span>
        <span class="arrow">
          <i
            v-if="collection.children"
            class="is-pulled-right"
            :class="isOpen ? 'fas fa-caret-down' : 'fas fa-caret-up'"
          />
        </span>
      </div>
      <div style="height: 100%">
        <collection-tree-node
          v-for="child in collection.children"
          :key="child.id"
          :collection="child"
          :depth="depth + 1"
        />
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "CollectionTreeNode",
  components: {},
  props: {
    collection: { type: Object, default: () => {}, required: true },
    depth: { type: Number, default: 0 },
  },
  data() {
    return {
      isOpen: true,
    };
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

.collection-tree {
  padding-left: 24px;
  padding-right: 24px;
}
.collection-tree.collapse {
  width: 100%;
  .with-border {
    /*
    border: 1px solid lightgrey;
    border-right: none;
    border-top: none;
    border-bottom: none;
    */
  }
  .collection {
    padding-left: 20px;
    &:hover {
      border-radius: 2px;
      color: $menu-item-active-color;
      background-color: lightgrey;
    }
  }
  .is-active {
    border-radius: 2px;
    color: $menu-item-active-color;
    background-color: $primary;
  }

  .tag {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    height: 35px;
  }
  .collection-title {
    width: 100%;
  }
}
</style>
