<template>
  <document
    :doc-id="parseInt(this.$route.params.docId)"
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

<style>

</style>