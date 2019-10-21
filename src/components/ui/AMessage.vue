<template>
  <article
    class="message"
    :class="type"
  >
    <div class="message-header">
      <p>{{ title }}</p>
    </div>
    <div class="message-body">
      <p v-html="body" />
    </div>
  </article>
</template>

<script>
  export default {
    name: "AMessage",
    props: ['type','title', 'body']
  }
</script>

<style scoped>

</style>