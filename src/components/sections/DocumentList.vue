<template>
  <div v-if="documents && documents.length > 0">
    <pagination />
    <ul id="preview-cards">
      <li
        v-for="doc in documents"
        :key="doc.id"
      >
        <document-preview-card
          v-if="!!doc.attributes['is-published'] || current_user"
          :doc-id="doc.id"
        />
      </li>
    </ul>
    <pagination />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  
  import Pagination from '../ui/Pagination';

  export default {
    name: "DocumentList",
    components: {
      'DocumentPreviewCard': () => import(/* webpackChunkName: "home-pages" */ '../document/DocumentPreviewCard'),  
      Pagination
    },
    props: {

    },
    data () {
      return {
  
      }
    },
    computed: {
      ...mapState('document', ['documents', 'documentLoading']),
      ...mapState('user', ['current_user']),
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
