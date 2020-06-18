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
  import DocumentPreviewCard from '../document/DocumentPreviewCard';
  import Pagination from '../ui/Pagination';

  import { mapState, mapActions } from 'vuex';

  export default {
    name: "DocumentList",
    components: {DocumentPreviewCard, Pagination},
    props: {

    },
    data () {
      return {
  
      }
    },
    computed: {
      ...mapState('document', ['documents', 'links', 'documentLoading']),
      ...mapState('user', ['current_user']),
    },
    created() {
              this.performSearch()
    },
    methods: {
      ...mapActions('search', ['performSearch']),
    }
  }
</script>

<style scoped>

</style>
