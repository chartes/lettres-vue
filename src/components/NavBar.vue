<template>
  <nav
    class="navbar is-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <span class="navbar-item title is-4 navbar-title">Projet LETTRES</span>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
    >
      <div class="navbar-start">
        <router-link
          :to="{ name: 'landing' }"
          class="navbar-item"
        >
          Accueil
        </router-link>
        <search-box
          id="search-box"
          class="navbar-item"
        />
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <span
              v-if="loggedIn"
              class="button is-light is-uppercase is-info m-r-sm"
            >
              {{ current_user.username }}
            </span>
            <router-link
              v-if="!loggedIn"
              :to="{ name: 'login' }"
            >
              <a class="button is-primary">
                Connexion
              </a>
            </router-link>
            <span
              v-else
              class="button is-light"
              @click="logout"
            >
              Se déconnecter
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import { mapState, mapGetters } from "vuex";
import SearchBox from "./ui/SearchBox";

export default {
  name: "NavBar",
  components: { SearchBox },
  data() {
    return {
      currentPage: 1,
      displayedDocId: null
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapGetters("user", ["loggedIn"])
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
  }
};
</script>