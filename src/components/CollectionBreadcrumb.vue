<template>
  <b-breadcrumb size="is-small">
    <b-breadcrumb-item
      v-for="pathCollection of path"
      :key="pathCollection.id"
      tag="router-link"
      :to="{name: 'collection', params: {collectionId: pathCollection.id}}"
    >
      {{ pathCollection.title }}
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>


export default {
  name: "CollectionBreadcrumb",
  props: {
    collectionId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    path() {
      return this.$store.getters["collections/path"](this.collectionId)
    },
  },
};
</script>

<style scoped lang="scss">
</style>
