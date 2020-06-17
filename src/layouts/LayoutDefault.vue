<template>
  <section>
    <nav-bar />
    <section class="section">
      <div class="container">
        <slot />
      </div>
    </section>
  </section>
</template>

<script>

import {mapState} from 'vuex'
import NavBar from '@/components/NavBar.vue'


export default {
    name: "LayoutDefault",
    components: {NavBar},
    
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
