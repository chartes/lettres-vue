<template>
  <button
    class="button" 
    @click="clickHandler"
  >
    {{ label }}
  </button>
</template>

<script>
  export default {
    name: 'LaunchButton',
    props: {label: { type:String,  required: true, default: 'button'}},
    methods: {
      clickHandler () {
        this.$el.blur()
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>

</style>