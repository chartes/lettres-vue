<template>
  <aside class="menu">
    <search-box class="mt-5 mb-2" />
    <router-link :to="{ name: 'search' }">
      <b-button
        icon-right="sliders-h"
        icon-pack="fa"
        class="mb-5 is-pulled-right toggle-form-btn"
        type="is-text"
        @click="setAdvancedSearchFormVisibility"
      >
        Recherche avancée
      </b-button>
    </router-link>
    <p class="menu-label">
      Général
    </p>
    <ul class="menu-list">
      <li>
        <router-link
          :to="{ name: 'home' }"
          exact-active-class="is-active"
        >
          <i class="fas fa-home" />Accueil
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'about' }"
          active-class="is-active"
        >
          <i class="fas fa-question-circle" />À propos
        </router-link>
      </li>
      <li v-if="lastSeenDocId">
        <router-link
          :to="{ name: 'document', params: { docId: lastSeenDocId } }"
          active-class="is-active"
        >
          <i class="fas fa-file" />Dernière consultation
        </router-link>
      </li>

      <li>
        <router-link
          :to="{ name: 'documentation' }"
          active-class="is-active"
        >
          <i class="fas fa-info-circle" />Documentation
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'search' }"
          exact-active-class="is-active"
        >
          <i class="fas fa-search" />Documents
        </router-link>
      </li>
    </ul>
    <p
      v-if="current_user"
      class="menu-label"
    >
      Mes travaux
    </p>
    <ul
      v-if="current_user"
      class="menu-list"
    >
      <li>
        <router-link
          :to="{ name: 'bookmarks' }"
          active-class="is-active"
        >
          <i class="fas fa-bookmark" />Mes favoris
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'history' }"
          active-class="is-active"
        >
          <i class="fas fa-history" />Mon historique
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'locks' }"
          active-class="is-active"
        >
          <i class="fas fa-lock" />Mes verrous
        </router-link>
      </li>
    </ul>
    <p
      v-if="current_user"
      class="menu-label"
    >
      Administration
    </p>
    <ul
      v-if="current_user"
      class="menu-list"
    >
      <li>
        <router-link
          :to="{ name: 'document-creation' }"
          active-class="is-active"
        >
          <i class="fas fa-file-alt" />Documents
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'collections' }"
          active-class="is-active"
        >
          <i class="fas fa-list" />Collections
        </router-link>
      </li>
      <li>
        <a class="">Gestion des référentiels</a>
        <ul>
          <li>
            <router-link
              :to="{ name: 'places' }"
              active-class="is-active"
            >
              <i class="fas fa-map-marker-alt" />Lieux identifiés
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'persons' }"
              active-class="is-active"
            >
              <i class="fas fa-users" />Personnes identifiées
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <a class="">Gestion des témoins</a>
        <ul>
          <li>
            <router-link
              :to="{ name: 'witnesses' }"
              active-class="is-active"
            >
              <i class="fas fa-book" />Témoins
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <a class="">Gestion des collaborateurs</a>
        <ul>
          <li>
            <router-link
              :to="{ name: 'users' }"
              active-class="is-active"
            >
              <i class="fas fa-users-cog" />Collaborateurs
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SearchBox from "@/components/SearchBox";

export default {
  name: "NavBar",
  components: { SearchBox },
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["lastSeenDocId"]),
  },
  methods: {
    ...mapActions("layout", ["toggleAdvancedSearchForm", "showAdvancedSearchForm"]),

    setAdvancedSearchFormVisibility() {
      if (this.$route.name === "search") {
        console.log("toggle");
        this.toggleAdvancedSearchForm();
      } else {
        console.log("show");
        this.showAdvancedSearchForm();
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

aside {
  padding-left: 30px;
}
i {
  margin-right: 0px;
  width: 30px;
}
a.is-active {
  color: white !important;
  background-color: $primary !important;
}

.menu-label {
  clear: both;
}
</style>
