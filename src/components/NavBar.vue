<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand pl-2">
      <router-link
        :to="{ name: 'home' }"
        class="navbar-item title is-4 navbar-title"
      >
        LETTRES
      </router-link>
    </div>

    <div
      class="navbar-menu"
    >
      <div class="navbar-start" />

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <span
              v-if="loggedIn"
              class="button is-light  is-outlined is-uppercase m-r-sm "
            >
              {{ current_user.username }}
            </span>
            <router-link
              v-if="!loggedIn"
              :to="{ name: 'login', query: {from: $route.name}}"
            >
              <a class="button  is-light  is-outlined">
                Connexion
              </a>
            </router-link>
            <span
              v-else
              class="button  is-light is-outlined"
              @click="logout"
            >
              Déconnexion
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
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


<style scoped lang="scss">
@import '@/assets/sass/main.scss';

.navbar {
  background-color: $primary !important;
}
.navbar-brand a {
  color: $white !important;
}
</style>