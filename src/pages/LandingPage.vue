<template>
  <div>
    <document-list
      :page-size="20"
      :current-page="1"
    />
  </div>
</template>

<script>

import DocumentList from '../components/sections/DocumentList'

export default {
    name: "LandingPage",
    components: {
      DocumentList
    },
    methods: {
    }
}
</script>

<style>

</style>