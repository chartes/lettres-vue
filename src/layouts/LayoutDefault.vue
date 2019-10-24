<template>
  <v-app>
    <v-app-bar
      app
      text
      color="red darken-4"
    >
      <v-toolbar-title @click="$router.push('/')">
        <v-btn
          text
          dark
        >
          projet lettres
        </v-btn>
      </v-toolbar-title>

      <v-spacer /> 

      <v-btn
        v-if="current_user"
        text
        dark
      >
        {{ current_user.username }}
      </v-btn>
      <v-btn
        v-else
        text
        dark
        @click="$router.push('/login')"
      >
        Connexion
      </v-btn>
    </v-app-bar>  
    <v-content>
      <v-container>
        <slot />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import {mapState} from 'vuex'
 

export default {
    name: "LayoutDefault",
    
    computed: {
      ...mapState("user", ["current_user"])
    },

    created() {
       //this.$store.dispatch('user/fetchCurrent');
    }
}
</script>

<style>

</style>