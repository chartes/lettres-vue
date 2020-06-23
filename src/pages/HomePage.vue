<template>
  <div>
    Home Page
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    name: "HomePage",
    components: {
    },
     data(){
        return {
            carousels: [
                { text: 'Slide 1', color: 'primary' },
                { text: 'Slide 2', color: 'info' },
                { text: 'Slide 3', color: 'success' },
                { text: 'Slide 4', color: 'warning' },
                { text: 'Slide 5', color: 'danger' }
            ]
        }
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";


</style>