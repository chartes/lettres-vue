<template>
  <div class="container">
    <div v-if="isAuthenticated" class="welcome">
      Bienvenue {{ current_user.username }}
    </div>
    <form v-else class="login-form" @submit.prevent="authenticate">
      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input v-model="email" class="input" type="email" placeholder="Email" />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
          <span class="icon is-small is-right">
            <i class="fas fa-check" />
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input
            v-model="password"
            class="input"
            type="password"
            placeholder="Mot de passe"
            value
            name="password"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-lock" />
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="button is-primary">Connexion</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { EventBus } from "@/modules/http-common";

export default {
  name: "LoginPage",
  components: {},
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters("user", ["isAuthenticated"]),
    ...mapState("user", ["current_user"]),
  },
  watch: {},
  created() {
    if (this.isAuthenticated) {
      console.log(this.$route.query.from);
      this.$router.push({ path: this.$route.query.from });
    }
  },
  mounted() {
    EventBus.$on("failedRegistering", (msg) => {
      this.errorMsg = msg;
    });
    EventBus.$on("failedAuthentication", (msg) => {
      this.errorMsg = msg;
    });
  },
  methods: {
    authenticate() {
      this.$store
        .dispatch("user/login", { email: this.email, password: this.password })
        .then(() => {
          this.$router.push({ name: "home" });
        });
    },
    register() {
      this.$store
        .dispatch("user/register", { email: this.email, password: this.password })
        .then(() => {
          this.$router.push({ name: "home" });
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.login-form {
  margin-top: 30px;
  width: 400px;
}
</style>
