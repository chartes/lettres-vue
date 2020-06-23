<template>
  <document-list />
</template>

<script>
  import { mapState, mapActions } from 'vuex';

import DocumentList from '@/components/sections/DocumentList'

export default {
    name: "SearchPage",
    components: {
      DocumentList
    },
    computed: {

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