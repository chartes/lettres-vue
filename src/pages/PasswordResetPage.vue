<template>
  <div 
    class="container login-form"
  >
    <article class="message m-t-xxl">
      <div class="message-header">
        <p>Réinitialisation de votre mot de passe.</p>
      </div>
      <form
          v-if="!success"
          class="container login-form"
          @submit.prevent="resetPassword"
      >
        <p
            v-show="error"
            class="control has-text-danger m-b-sm"
        >
          {{ error }}
        </p>
        <div class="message-body">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input
                  v-model="password"
                  autocomplete="off"
                  class="input"
                  type="text"
                  required
                  minlength="5"
                  placeholder="Nouveau mot de passe"
                >
                <span class="icon is-small is-left">
                  <i class="fas fa-lock" />
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input
                  v-model="password2"
                  class="input"
                  type="password"
                  required
                  minlength="5"
                  placeholder="Confirmation du mot de passe"
                >
                <span class="icon is-small is-left">
                  <i class="fas fa-lock" />
                </span>
              </p>
            </div>
        </div>
        <div class="message-footer">
            <div class="field">
              <span class="control">
                <button
                  class="button  is-success"
                >
                  Valider
                </button>
              </span>
            </div>
        </div>
      </form>
      <p v-show="success">
        Le changement de votre mot de passe a été effectué.
      </p>
    </article>
  </div>
</template>

<script>

export default {
    name: "PasswordResetPage",
    data () {
        return {
          password: '',
          password2: '',
          error: false,
          success: false,
        }
    },
    computed: {
      token() { 
        return this.$route.query.token
      },
      passwordsMatch() {
        return this.password == this.passwordConfirmation
      },
    },
    methods: {
        resetPassword () {
          this.$store
            .dispatch('user/resetPassword', {
              token: this.token,
              password: this.password,
              password2: this.password2,
            })
            .then(() => {
              this.error = false;
              this.success = true;
            }).catch(({response}) => {
              if (response.data.error) {
                this.error = response.data.error
              } else {
                this.error = "Une erreur est survenue. Veuillez renouveler votre demande."
              }
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
    border: none;

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

    .control.has-icons-left .icon,
    .control.has-icons-right .icon {
      padding: 0;
    }

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