<template>
  <div class="pt-5 pb-5">
    <ul>
      <li v-for="collection in collections" :key="collection.id">
        <router-link
          tag="a"
          :to="{ name: 'collection', params: { collectionId: collection.id } }"
          >{{ collection.title }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DocumentCollections",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("document", ["collections"]),
  },
  methods: {},
};
</script>

<style lang="scss"></style>
