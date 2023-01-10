<template>
  <span
    v-if="status === 'normal'"
    :key="'normal'"
    class="icon is-small"
  >
    <i class="fas fa-trash" />
  </span>
  <span
    v-else-if="status === 'error'"
    :key="'error'"
    class="icon is-small"
  >
    <i class="fas fa-exclamation-triangle" />
  </span>
</template>

<script>
  export default {
    name: 'DeleteButtonIcon',
    props: {
      status: { type: String, default: 'normal'}
    }
  }
</script>

<style scoped>
</style>
