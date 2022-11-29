<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand pl-2">
      <router-link :to="{ name: 'home' }" class="navbar-item title is-4 navbar-title">
        LETTRES
      </router-link>
    </div>

    <div class="navbar-menu is-align-items-center">
      <div class="navbar-start">
        <router-link :to="{ name: 'about' }" class="navbar-start-item">
          À propos
        </router-link>
        <search-box class="ml-5 navbar-start-item" />
      </div>

      <div class="navbar-end is-align-items-center">
        <div v-if="isAuthenticated" class="navbar-item is-hoverable">
          <a>
            <i :title="current_user.username" class="fas fa-user-check fa-2x" />
          </a>

          <div class="navbar-dropdown is-align-items-center">
            <hr class="navbar-divider" />
            <p v-if="current_user" class="menu-label">Mes travaux</p>
            <ul v-if="current_user" class="menu-list">
              <li>
                <router-link :to="{ name: 'bookmarks' }" active-class="is-active">
                  <i class="fas fa-bookmark" />Mes favoris
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'history' }" active-class="is-active">
                  <i class="fas fa-history" />Mon historique
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'locks' }" active-class="is-active">
                  <i class="fas fa-lock" />Mes verrous
                </router-link>
              </li>
            </ul>
            <hr class="navbar-divider" />
            <p v-if="current_user" class="menu-label">Administration</p>
            <ul v-if="current_user" class="menu-list">
              <li>
                <router-link :to="{ name: 'document-creation' }" active-class="is-active">
                  <i class="fas fa-file-alt" />Documents
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'collections' }" active-class="is-active">
                  <i class="fas fa-list" />Collections
                </router-link>
              </li>
              <li>
                <a class="">Gestion des référentiels</a>
                <ul>
                  <li>
                    <router-link :to="{ name: 'places' }" active-class="is-active">
                      <i class="fas fa-map-marker-alt" />Lieux identifiés
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'persons' }" active-class="is-active">
                      <i class="fas fa-users" />Personnes identifiées
                    </router-link>
                  </li>
                </ul>
              </li>
              <li>
                <a class="">Gestion des témoins</a>
                <ul>
                  <li>
                    <router-link :to="{ name: 'witnesses' }" active-class="is-active">
                      <i class="fas fa-book" />Témoins
                    </router-link>
                  </li>
                </ul>
              </li>
              <li>
                <a class="">Gestion des collaborateurs</a>
                <ul>
                  <li>
                    <router-link :to="{ name: 'users' }" active-class="is-active">
                      <i class="fas fa-users-cog" />Collaborateurs
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="logout"> Déconnexion </a>
          </div>
        </div>
        <div>
          <router-link
            v-if="!isAuthenticated"
            :to="{ name: 'login', query: { from: $route.name } }"
          >
            <a title="Connectez-vous">
              <i class="fas fa-user-times fa-2x" />
            </a>
          </router-link>
        </div>
        <div class="navbar-end is-align-items-center">
          <router-link :to="{ name: 'documentation' }" class="navbar-start-item">
            Documentation
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import background_image from "@/assets/images/about.jpg";
import SearchBox from "@/components/SearchBox";

export default {
  name: "NavBar",
  components: {
    SearchBox,
  },
  data: function () {
    return {
      background_image: background_image,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapGetters("user", ["isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
#intro {
  background-image: url("../assets/images/about.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 200px;
  width: auto;
}
.navbar {
  background-color: rgba(133, 18, 33, 0.9) !important;
  box-shadow: 0px 2px 3px 1px rgb(10 10 10 / 30%);
}
.navbar-brand a {
  color: $white !important;
  font-family: $bitter-family;
  letter-spacing: 16px;
}
.navbar-start-item:not(:last-child)::after {
  content: "|";
  display: inline-block;
  color: $white;
  padding-left: 0.75rem;
}
.navbar-start-item {
  color: $white !important;
  padding-left: 0.75rem;
}
.navbar-item > span {
  background-color: rgba(133, 18, 33, 0.9) !important;
}
.navbar-start-item:hover,
.navbar-start-item:focus {
  text-decoration: underline dotted;
  color: $white !important;
  background-color: transparent !important;
}
.fas {
  color: $white !important;
  padding-right: 0.75rem;
}
</style>
