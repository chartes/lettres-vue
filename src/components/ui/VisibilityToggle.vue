<template>
  <a
    href="#"
    @click.prevent="clickHandler"
  >
    <span v-show="visible"><i class="fas fa-eye" /></span>
    <span v-show="!visible"><i class="fas fa-eye-slash" /></span>
    <slot />
  </a>
</template>

<script>
  export default {
    name: "VisibilityToggle",
    props: ['visible', 'action', 'param'],
    methods: {
      clickHandler () {
        this.action(this.param);
      }
    }
  }
</script>