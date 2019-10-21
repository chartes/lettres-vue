<template>
  <div v-if="documents && documents.length > 0">
    <pagination
      :current="currentPage"
      :end="nbPages"
      :size="pageSize"
      :action="goToPage"
    >
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
    </pagination>
  </div>
</template>

<script>
  import DocumentPreviewCard from '../document/DocumentPreviewCard';
  import Pagination from '../ui/Pagination';
  import {getUrlParameter} from "../../modules/utils";

  import { mapState } from 'vuex';

  export default {
    name: "DocumentList",
    components: {DocumentPreviewCard, Pagination},
    props: {
      currentPage: {type: Number, default: 1} ,
      pageSize : {type: Number,required: true, defaut: 20}
    },
    data () {
      return {
  
      }
    },
    computed: {
      ...mapState('document', ['documents', 'links', 'documentLoading']),
      ...mapState('user', ['current_user']),

      nbPages() {
          return parseInt(this.links.last ? getUrlParameter(this.links.last, "page%5Bnumber%5D") : 1);
      }
    },
    created() {
       this.goToDocPage(parseInt(this.currentPage));
    },
    methods: {
        goToPage(url) {
            window.location.replace(url);
        },
        fetchAll() {
            this.$store.dispatch('document/fetchAll', {
                    pageId: this.currentPage,
                    pageSize: this.pageSize,
                    filters: this.current_user ? '' : 'filter[is-published]=1'
                }).then(r => {

                });
        },
        goToDocPage(num) {
                this.currentPage = num;
                if (this.searchedTerm && this.searchedTerm.length > 1) {
                    this.performSearch(this.searchedTerm, this.currentPage);
                } else {
                    this.fetchAll();
                }
        },
        performSearch(searchedValue, numPage = 1) {
                const term = searchedValue ? searchedValue : '';
                if (searchedValue.length > 1) {
                    this.displayedDocId = null;

                    this.$store.dispatch('document/fetchSearch', {
                        pageId: numPage,
                        pageSize: this.pageSize,
                        query: term
                    });
                    this.currentPage = numPage;
                } else {
                    this.goToDocPage(1);
                }
        },
    }
  }
</script>

<style scoped>

</style>
