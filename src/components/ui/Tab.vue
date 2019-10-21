<template>
  <div class="tab">
    <slot v-if="isActive" />
  </div>
</template>

<script>
  export default {
    name: "Tab",
    props: {
        name: { required: true },
        selected: { default: false },
        iconClass : {},
        spacer: {default: false}
    },
    data () {
      return {
        isActive: this.selected
      }
    }
  }
</script>
