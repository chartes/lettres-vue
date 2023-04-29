<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand">
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
          ecco
        </router-link>
      </div>

      <div class="navbar-menu is-align-items-center">
        <ul class="navbar-end is-align-items-center">
          <li class="navbar-start-item">
            <router-link
              :to="{ name: 'search' }"
              @click.native="clearState()"
            >
              Recherche
            </router-link>
          </li>
          <li class="navbar-start-item">
            <router-link
              :to="{ name: 'collections' }"
            >
              Collections
            </router-link>
          </li>
          <li class="navbar-start-item">
            <router-link
              :to="{ name: 'documentation' }"
            >
              Documentation
            </router-link>
          </li>
        </ul>
        <div class="navbar-end is-align-items-center">
          <div
            v-if="isAuthenticated"
            class="navbar-item is-hoverable"
          >
            <a
              :title="current_user.username"
              class="user-account active"
            />
            <div class="navbar-dropdown is-align-items-center">
              <div
                v-if="current_user"
                class="item user-name"
              >
                <span>{{ current_user.username }}</span>
              </div>
              <div
                v-if="current_user"
                class="item"
              >
                <div
                  v-if="current_user.roles.includes('admin')"
                  class="item is-inline-block user-role"
                >
                  <span>Administrateur</span>
                </div>
                <div
                  v-else-if="current_user.roles.includes('contributor')"
                  class="item is-inline-block"
                >
                  <span class="is-inline-block">Role : Contributeur</span>
                </div>
              </div>
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
                    Mes favoris
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'history' }"
                    active-class="is-active"
                  >
                    Mon historique
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'locks' }"
                    active-class="is-active"
                  >
                    Mes verrous
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
                    :to="{ name: 'places' }"
                    active-class="is-active"
                  >
                    Gestion des Lieux
                  </router-link>
                </li><li>
                  <router-link
                    :to="{ name: 'persons' }"
                    active-class="is-active"
                  >
                    Gestion des Personnes
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'witnesses' }"
                    active-class="is-active"
                  >
                    Gestion des Témoins
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'users' }"
                    active-class="is-active"
                  >
                    Gestion des Utilisateurs
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'document-creation' }"
                    active-class="is-active"
                  >
                    Créer un nouveau document
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
              <a
                title="Connectez-vous"
                class="user-account"
              />
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
import {mapState, mapGetters, mapActions} from "vuex";
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
    ...mapActions("search", ["resetSearchState"]),
    clearState() {
      this.$store.state.collections.selectedCollection = {};
      this.resetSearchState();
      //this.$store.state.layout.showLeftSideBar = false;
    },
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
  position: relative;
  display: flex;
  background-color: rgba(127, 0, 56) !important;
  box-shadow: 0 2px 3px 1px rgb(10 10 10 / 30%);

  @include on-small-tablet {
    padding-bottom: 40px;
  }

  .title {
    padding: 2px 5px 5px 0;
    font-family: $family-apptitle;
    font-size: 60px;
    font-weight: 300;
    line-height: 1;
    text-transform: none;
    text-decoration: none !important;

    @include on-small-tablet {
      font-size: 54px;
    }
  }

  & > .container {
    display: flex;
    max-width: $nav-max-width !important;

    @include on-small-desktop {
      max-width: 100% !important;
      margin-left: $container-small-desktop-margin;
      margin-right: $container-small-desktop-margin;
    }

    @include on-tablet {
      justify-content: space-between;
      margin-left: $container-tablet-margin;
      margin-right: $container-tablet-margin;
    }

    @include on-mobile {
      margin-left: $container-mobile-margin;
      margin-right: $container-mobile-margin;
    }

    .navbar-brand {

      @include on-tablet {
        margin-left: 0;
        margin-right: 0;
      }

    }
  }

  /* Partie gauche : Logo */
  .navbar-brand {
    a {
      color: $white !important;

      & > img {
        padding: 10px 30px 0 0;

        @include on-small-tablet {
          width: 90%;
          padding-right: 10px;
        }
      }
    }
  }

  /* Partie droite : menu-items et user-button */
  .navbar-menu {
    display: flex !important;
    flex: auto;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;

    @include on-small-tablet {
      justify-content: space-between;
    }

    /* Menu Recherche-Collections-Documentation */
    & > .navbar-end:first-child {
      display: flex !important;
      margin-left: auto !important;

      @include on-small-tablet {
        position: absolute;
        width: 100vw;
        left: -12px;
        top: 67px;
      }
    }

    /* User */
    & > .navbar-end:last-child {
      padding: 0 !important;
      margin-left: auto !important;

      @include on-small-tablet {
        margin-top: 7px;
      }

      .navbar-item {
        display: flex;
        padding: 20px 0.75rem;
      }
    }

  }

  .user-account {
    display: inline-block;
    width: 38px;
    height: 38px;
    background: url('../assets/images/icons/compte_off.svg') center / cover no-repeat;

    @include on-mobile {
      width: 32px;
      height: 32px;
    }

    &.active {
      background: url(../assets/images/icons/compte_on.svg)
    }
  }

  .navbar-dropdown {
    background-color: #583243;
    box-shadow: -6px 6px 30px 0 #00000080;
    border-top: #FF0052 5px solid;
    border-radius: 0;

    width: max-content;
    min-width: 274px;
    padding: 15px 0 18px 20px;
    right: 0 !important;
    left: auto !important;
    top:78px;

    font-family: $family-secondary;
    font-size: 18px;
    color: $white !important;

    /* display:block !important; */

    @include on-tablet {
      position: absolute;
      display: none;
    }

  }
  .navbar-dropdown .user-name {
    font-size: 18px;
    font-weight: 500;
    color: #D4508B;
  }
  .navbar-dropdown .user-role {
    margin-top: -4px;
    font-size: 18px;
    font-weight: 400;
    font-style: italic;
    color: #C04B7F;
  }
  .menu-label {
    display: flex;
    margin: 20px 0 5px !important;
    font-size: 18px;
    color: #D4508B;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: uppercase;
  }
  .menu-label:after {
    content:"";
    flex: 1;
    border-bottom:1px solid #C00055;
    height:1em;
    margin-left: 4px;
    transform: translateY(-2px);
  }
  .navbar-divider {
    margin-top: 30px;
    background-color: #C00055 !important;
    margin-left: -20px;
  }
  .navbar-dropdown ul > li > a {
    color: $white !important;
  }
  .navbar-dropdown ul > li > a:hover {
    text-decoration: underline !important;
    text-decoration-style: dotted !important;
  }
  .navbar-dropdown>a {
    color: $white !important;
  }
  .navbar-dropdown a.navbar-item {
    padding: 0;
  }

  .navbar-start-item {
    padding-left: 0.75rem;

    @include on-mobile {
      padding-left: 0.4rem;
    }
  }

  .navbar-start-item:not(:last-child)::after {
    content: "|";
    display: inline-block;
    color: $white;
    padding-left: 12px;
    padding-right: 2px;
    transform: scale(1 , 2) translateY(-2px);

    @include on-small-tablet {
      transform: scale(1, 1.1) translateY(-3px);
    }

    @include on-mobile {
      padding-left: 0.4rem;
    }
  }

  .navbar-start-item a {
    padding-bottom: 3px;
    font-family: $family-secondary;
    font-size: 18px;
    vertical-align: top;
    font-weight: 200;
    text-transform: uppercase;
    color: $white !important;

    @include on-small-tablet {
      font-size: 15px;
    }
  }
  .navbar-start-item a.router-link-active {
    font-weight: 600;
  }
  .navbar-start-item a.router-link-active,
  .navbar-start-item a:hover,
  .navbar-start-item a:focus {
    border-bottom: solid 4px #FF0052;
    color: $white !important;
    background-color: transparent !important;
  }
  .menu-list a {
    padding: 8px 0;
  }
  .menu-list a.is-active {
    background: transparent !important;
  }
  .navbar-dropdown a.navbar-item:hover,
  .menu-list a:hover {
    background: transparent !important;
    text-decoration: underline !important;
    text-decoration-style: dotted !important;
  }
}

</style>
