<template>
  <form
    class="container login-form"
    @submit.prevent="authenticate"
  >
    <article class="message m-t-xxl">
      <div class="message-header">
        <p>
          Connexion
        </p>
      </div>
      <div class="message-body">
        <div
          v-if="current_user"
          class="welcome"
        >
          Bienvenue {{ current_user.username }}
        </div>

        <div class="field">
          <p class="control has-icons-left has-icons-right">
            <input
              v-model="email"
              class="input"
              type="text"
              placeholder="Nom d'utilisateur ou email"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
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
            >
            <span class="icon is-small is-left">
              <i class="fas fa-lock" />
            </span>
          </p>
        </div>
        <router-link :to="{name: 'forgot-password'}">
          Mot de passe oublié
        </router-link>
      </div>
      <div class="message-footer">
        <div class="field">
          <span class="control">
            <button
              class="button  is-success"
            >
              Valider
            </button>
            <span
              v-show="error"
              class="control has-text-danger is-pulled-right p-t-sm"
            >Nom d'utilisateur ou mot de passe incorrect(s)</span>
          </span>
        </div>
      </div>
    </article>
  </form>
</template>

<script>

import {mapState, mapGetters} from 'vuex'

export default {
    name: "LoginPage",
    components: {
        
    },
    data () {
        return {
          email: '',
          password: '',
          error: false
        }
    },
    computed: {
      ...mapState("user", ["current_user"]),
      ...mapGetters("user", [
      "isAuthenticated"
    ]),
    },
    created() {
      if (this.isAuthenticated) {
        this.$router.push({path: this.$route.query.from})
      }
    },
    mounted() {
      this.error = false
    },
    methods: {
        authenticate () {
          this.error = false
          return this.$store
            .dispatch('user/login', {
              email: this.email,
              password: this.password
            })
            .then(() => { 
	      this.$router.push({name: "home"})
            }).catch(() => {
              this.error=true
            })
        }
      }

}
</script>

<style scoped  lang="scss">
@import "@/assets/sass/main.scss";

.message {
  background-color: #FFFFFF;
  box-shadow: -6px 6px 30px 0 #00000050;

  .message-header {
    background-color: #CB2158;
    border: none;
    border-radius: 5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 12px 20px;
    margin-bottom: 10px;

    p {
      font-family: $family-apptitle;
      font-size: 30px;
      color: #FFFFFF;
      font-weight: 200;
      letter-spacing: 0;

      @include on-tablet {
        font-size: $font-size-title-tablet;
      }

      @include on-mobile {
        font-size: $font-size-title-mobile;
      }

    }
  }

  .message-body {
    padding-top: 40px;
    padding-bottom: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    @include on-mobile {
      padding-top: 10px;
    }

    & > * {
      margin-bottom: 20px;
    }

    input[type="text"] {
      padding-left: 40px !important;
    }
  }

  .message-body,
  .message-footer {
    padding-left: 30px;
    padding-right: 30px;

    @include on-mobile {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .message-footer {
    justify-content: flex-end;
    gap: 12px;
    border-top: none;
    padding-top: 20px;
    padding-bottom: 20px;

    button {
      width: auto;
      height: auto;
      background-color: #CB2158;
      border-radius: 5px;
      padding: 6px 10px;
      margin: 0 !important;

      font-family: $family-primary;
      font-size: 18px;
      line-height: 1;
      font-weight: 500;
      color: #FFFFFF;
      letter-spacing: 0;
      text-transform: uppercase;

      &:hover {
        background-color: #CB2158;
        color: #FFFFFF;
      }
    }
  }

  .message-body::after {
    content: "";
    display: block;
    width: 100%;
    margin-top: 60px;
    height: 1px;
    border-top: 1px solid #CB2158;
  }

}

</style>
