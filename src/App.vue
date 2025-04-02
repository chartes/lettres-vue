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
    await this.fetchCollections();
    await this.fetchLanguages();
    await this.fetchInstitutions();
  },
  methods: {
    ...mapActions("search", ["getDocumentsTotal"]),
    ...mapActions("collections", {fetchCollections: "fetchAll"}),
    ...mapActions("languages", {fetchLanguages: "fetch"}),
    ...mapActions("institutions", {fetchInstitutions: "fetch"})
  },
};
</script>
