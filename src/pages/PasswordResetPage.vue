<template>
  <form
    class="container login-form"
    @submit.prevent="resetPassword"
  >
    <article class="message m-t-xxl">
      <div class="message-header">
        <p>Réinitialisation de votre mot de passe.</p>
      </div>
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
              class="button is-success"
            >
              Valider
            </button>
            <p
              v-show="error"
              class="control has-text-danger is-pulled-right p-t-sm"
            >
              {{ error }}
            </p>
          </span>
        </div>
        <p
          v-show="success"
          class="control has-text-success p-t-sm"
        >
          Le changement de votre mot de passe a été effectué.
        </p>
      </div>
    </article>
  </form>
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

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_form.scss";

</style>
