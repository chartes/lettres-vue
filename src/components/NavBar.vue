<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand pl-2">
        <a 
          href="https://www.chartes.psl.eu"
          target="_blank"
        >
          <img
            :src="require('@/assets/images/head_logo.png')"
        
            alt="Card image cap"
          >
        </a>
        <router-link
          :to="{ name: 'home' }"
          class="navbar-item title is-4 navbar-title is-inline-block"
        >
          Lettres
        </router-link>
      </div>

      <div class="navbar-menu is-align-items-center">
        <div class="navbar-end is-align-items-center">
          <router-link
            :to="{ name: 'search' }"
            class="navbar-start-item"
          >
            Recherche
          </router-link>
          <router-link
            :to="{ name: 'collections' }"
            class="navbar-start-item"
          >
            Collections
          </router-link>
          <router-link
              :to="{ name: 'documentation' }"
              class="navbar-start-item"
          >
            Documentation
          </router-link>

          <!--<search-box
            v-show="!showLeftSideBar || $route.name !== 'search'"
            class="ml-5 navbar-start-item"
          />-->
        </div>

        <div class="navbar-end is-align-items-center">
          <div
            v-if="isAuthenticated"
            class="navbar-item is-hoverable"
          >
            <a>
              <i
                :title="current_user.username"
                class="fas fa-user-check fa-2x"
              />
            </a>

            <div class="navbar-dropdown is-align-items-center">
              <div
                v-if="current_user"
                class="item"
              >
                <span>User : {{ current_user.username }}</span>
              </div>
              <div
                v-if="current_user"
                class="item"
              >
                <div
                  v-if="current_user.roles.includes('admin')"
                  class="item is-inline-block"
                >
                  <span class="is-inline-block">Role : Administrateur</span>
                </div>
                <div
                  v-else-if="current_user.roles.includes('contributor')"
                  class="item is-inline-block"
                >
                  <span class="is-inline-block">Role : Contributeur</span>
                </div>
              </div>

              <!--<hr class="navbar-divider" />-->
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
              <!--<hr class="navbar-divider" />-->
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
                    :to="{ name: 'places' }"
                    active-class="is-active"
                  >
                    <i class="fas fa-map-marker-alt" />Gestion des Lieux
                  </router-link>
                </li><li>
                  <router-link
                    :to="{ name: 'persons' }"
                    active-class="is-active"
                  >
                    <i class="fas fa-users" />Gestion des Personnes
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'witnesses' }"
                    active-class="is-active"
                  >
                    <i class="fas fa-book" />Gestion des Témoins
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'users' }"
                    active-class="is-active"
                  >
                    <i class="fas fa-users-cog" />Gestion des Utilisateurs
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'document-creation' }"
                    active-class="is-active"
                  >
                    <i class="fas fa-file-alt" />Créer un nouveau document
                  </router-link>
                </li>
              </ul>
              <hr class="navbar-divider">
              <a
                class="navbar-item"
                @click="logout"
              > Déconnexion </a>
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
        <!--<div class="navbar-end is-align-items-center">
          <router-link :to="{ name: 'documentation' }" class="navbar-start-item">
            Documentation
          </router-link>
        </div>-->
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from "vuex";
//import SearchBox from "@/components/SearchBox";

export default {
  name: "NavBar",
  components: {
    /*SearchBox,*/
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar"]),
    ...mapGetters("user", ["isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout")
      .then(() => {
      this.$router.push('/login')
    })
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.navbar {
  background-color: rgba(127, 0, 56) !important;
  box-shadow: 0px 2px 3px 1px rgb(10 10 10 / 30%);

  .title {
    padding: 5px;
    font-family: $family-apptitle;
    font-size: 60px;
    line-height: 1;
    text-transform: none;
  }

  & > .container {
    max-width: 1180px !important;

    @include respond-small-desktop {
      max-width: 100% !important;
      margin-left: $container-small-desktop-margin;
      margin-right: $container-small-desktop-margin;
    }
  }
}
.navbar-brand a {
  color: $white !important;

  & > img {
    padding: 10px 30px 0 0;
  }
}

.navbar-start-item:not(:last-child)::after {
  content: "|";
  display: inline-block;
  color: $white;
  padding-left: 12px;
  padding-right: 2px;
  transform: scale(1 , 2) translateY(-2px);
}
.navbar-dropdown {
  background-color: rgb(79, 5, 49, 0.9) !important;
  color: $white !important;
  border-top-color: $red !important;
  border-top-width: 0.5em;
  width: max-content;
  padding: 10px;
  right: 0 !important;
  left: auto !important;
}
.navbar-dropdown div>span {
  color: $red !important;
}
.menu-label {
  display: flex;
}
.menu-label:after {
  content:"";
  flex: 1;
  border-bottom:2px solid;
  border-bottom-color: $red !important;
  height:1em;
  margin-left: 1em;
}
.navbar-divider {
  background-color: $red !important;
}
.navbar-dropdown ul>li>a {
  color: $white !important;
}
.navbar-dropdown p {
  color: $red !important;
}
.navbar-dropdown>a {
  color: $white !important;
}
.navbar-start-item {
  font-family: $family-secondary;
  font-size: 18px;
  vertical-align: top;
  font-weight: 200;
  text-transform: uppercase;
  color: $white !important;
  padding-left: 0.75rem;
}
.navbar-item > span {
  background-color: rgba(133, 18, 58, 0.9) !important;
}
.navbar-start-item:hover,
.navbar-start-item:focus {
  text-decoration: underline 1px white;
  color: $white !important;
  background-color: transparent !important;
}
.fas {
  color: $white !important;
  padding-right: 0.75rem;
}
</style>
