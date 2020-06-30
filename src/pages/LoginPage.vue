<template>
  <div class="container">
    <div
      v-if="current_user"
      class="welcome"
    >
      Bienvenue {{ current_user.username }}
    </div>
    <form
      v-else
      class="login-form"
      @submit.prevent="login"
    >
      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input
            v-model="email"
            class="input"
            type="email"
            placeholder="Email"
          >
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
          >
          <span class="icon is-small is-left">
            <i class="fas fa-lock" />
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="button is-primary">
            Connexion
          </button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>

import {mapState} from 'vuex'

export default {
    name: "LoginPage",
    components: {
        
    },
    data () {
        return {
          email: '',
          password: ''
        }
    },
    computed: {
      ...mapState("user", ["current_user"])
    },
    watch: {
      current_user() {
        this.redirect()
      }
    },
    mounted() {
        this.redirect()
    },
    methods: {
      redirect() {
        if (this.current_user) {
          if (!this.$route.query.from) {
            this.$router.replace('/');
          } else {
            this.$router.replace(this.$route.query.from);
          }
        }
      },
      login () {
          this.$store.dispatch('user/login', {
              email: this.email,
              password: this.password
            })
      }
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.login-form {
  margin-top: 30px;
  width: 400px;
}
</style>