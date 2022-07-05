<template>
  <div
    class="collection-card card"
    :class="selectedCollectionId === collection.id ? 'collection-card__selected' : ''"
    @click="setSelectedCollectionId(collection.id)"
  >
    <div class="card-content">
      <div class="is-flex is-justify-content-space-between">
        <span class="title">{{ collection.title }}</span
        ><span class="collection-card__dates ml-3"
          >{{ collection.dateMin || "..." }} - {{ collection.dateMax || "..." }}
        </span>
      </div>

      <p>{{ collection.description }} ({{ collection.documentCount }} documents)</p>
    </div>
    <footer class="card-footer is-flex is-justify-content-end">
      <p class="pt-2 pr-2 pb-2 pl-3">
        Curated by <a>{{ collection.admin.username }}</a>
      </p>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CollectionCard",
  components: {},
  props: {
    collectionId: { type: Number, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("collections", ["allCollectionsWithParents"]),
    ...mapState("search", ["selectedCollectionId"]),

    collection() {
      return this.allCollectionsWithParents.find(
        (c) => c.id === this.$props.collectionId
      );
    },
  },
  watch: {},
  created() {},
  methods: {
    ...mapActions("search", ["setSelectedCollectionId"]),
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.collection-card {
  background-color: whitesmoke !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  border: 1px solid $coffee;

  &:hover {
    cursor: pointer;
    background-color: $coffee-light !important;
  }

  &__selected {
    background-color: $coffee-light !important;
  }

  &__dates {
    line-height: 2rem;
    white-space: nowrap;
  }

  .title {
    font-size: 1.5rem;
  }

  .card-footer {
    border-top: 1px solid $coffee;
  }
}
</style>
