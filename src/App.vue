<template>
  <component :is="layout">
    <router-view :layout.sync="layout" />
  </component>
</template>

<script>
import {mapActions} from "vuex";
import LayoutDefault from "./layouts/LayoutDefault";

export default {
  name: "App",
  data() {
    return {
      layout: LayoutDefault,
    };
  },
  async created() {
    await this.getDocumentsTotal();
    await this.fetchAll();
  },
  methods: {
    ...mapActions("search", ["getDocumentsTotal"]),
    ...mapActions("collections", ["fetchAll"])
  },
};
</script>
