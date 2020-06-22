<template>
  <aside class="menu">
    <search-box class="mt-5 mb-5" />
    <p class="menu-label">
      Général
    </p>
    <ul class="menu-list">
      <li><a><i class="fas fa-question-circle" />À propos</a></li>
      <li><a><i class="fas fa-info-circle" />Documentation</a></li>
    </ul>
    <p class="menu-label">
      Mes travaux
    </p>
    <ul class="menu-list">
      <li><a><i class="fas fa-bookmark" />Mes favoris</a></li>
      <li><a><i class="fas fa-lock" />Mes verrous</a></li>
      <li><a><i class="fas fa-history" />Mon historique</a></li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li>
        <a class="">Gestion des référentiels</a>
        <ul>
          <li><a><i class="fas fa-users" />Personnes identifiées</a></li>
          <li><a><i class="fas fa-map-marker-alt" />Lieux identifiés</a></li>
        </ul>
      </li>
      <li>
        <a class="">Gestion des collaborateurs</a>
        <ul>
          <li><a><i class="fas fa-users-cog" />Collaborateurs</a></li>
        </ul>
      </li>
    </ul>
  </aside>
</template>


<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SearchBox from "./ui/SearchBox";

export default {
  name: "NavBar",
  components: { SearchBox },
  data() {
    return {};
  },
  computed: {},
  methods: {
  }
};
</script>

<style scoped lang="scss">
aside {
  position: relative;
  float: left;
  display: block;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  padding-bottom: 0;
  padding-left: 30px;
}
i {
  margin-right: 0px;
  width: 30px;
}
</style>