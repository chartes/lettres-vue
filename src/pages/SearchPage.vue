<template>
  <div>
    <document-list />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

import DocumentList from '@/components/sections/DocumentList'

export default {
    name: "SearchPage",
    components: {
      DocumentList
    },
    created() {
      this.performSearch()
    },
    methods: {
      ...mapActions('search', ['performSearch']),
    },
}
</script>

<style>

</style>