<template>
  <div>
    <document
      :doc-id="parseInt(this.$route.params.docId)"
    />
    <div id="uv-layout" />
  </div>
</template>

<script>

import Document from '../components/sections/Document'

export default {
    name: "Landing",
    components: {
        Document
    },
    methods: {
    }
}
</script>

<style>

</style>