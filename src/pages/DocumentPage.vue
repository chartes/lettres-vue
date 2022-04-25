<template>
  <document
    class="document-page"
    :doc-id="parseInt($route.params.docId)"
  />
</template>

<script>

import Document from '../components/sections/Document'

export default {
    name: "DocumentPage",
    components: {
        Document
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
  .document-page {
    min-height: 100%
  }
</style>