<template>
  <div>
    <div
      v-if="current_user"
      class="welcome"
    >
      Bienvenue {{ current_user.username }}
    </div>
    <form
      v-else
      @submit.prevent="login"
    >
      <label for="email">
        Email:
      </label>
      <input
        v-model="email"
        type="email"
        name="email"
        value
      >
          
      <label for="password">
        Password:
      </label>
      <input
        v-model="password"
        type="password"
        name="password"
        value
      >
      
      <button
        type="submit"
        name="login-btn"
      >
        Login
      </button>
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
        if (this.current_user) {
            this.$router.replace(this.$route.query.from);
        }
      }
    },
    mounted() {
        if (this.current_user) {
            this.$router.replace(this.$route.query.from);
        }
    },
    methods: {
        login () {
          this.$store.dispatch('user/login', {
              email: this.email,
              password: this.password
            })
        }
      }

}
</script>

<style>

</style>