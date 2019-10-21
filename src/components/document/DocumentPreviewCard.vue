<template>
  <div class="document-preview-card">
    <aside
      v-if="documentPreview"
      class="document-preview-card__thumbnail"
    >
      <router-link :to="{name: 'document', params: {docId}}">
        <img
          v-if="documentPreview.attributes[&quot;iiif-thumbnail-url&quot;]"
          :src="documentPreview.attributes[&quot;iiif-thumbnail-url&quot;]" 
        >
        <div
          v-else
          class="document-preview-card__alt-thumbnail"
        >
          <v-icon style="width:100%; height: 100%; margin: auto">
            far fa-file-alt
          </v-icon>
        </div>
      </router-link>
    </aside>
    <article>
      <header class="title">
        <document-tag-bar :doc-id="docId" />
      </header>

      <div
        v-if="documentPreview"
        class="content"
      >
        <router-link :to="{name: 'document', params: {docId}}">
          <h1
            class="document-preview-card__title"
            v-html="titleContent" 
          />
        </router-link>
        <p
          class="document-preview-card__content"
          v-html="previewContent" 
        />
      </div>
    </article>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import LoadingIndicator from '../ui/LoadingIndicator';
  import DocumentAttributes from './DocumentAttributes';
  import {baseAppURL} from '../../modules/http-common';
  import DocumentTagBar from "./DocumentTagBar";

  export default {

    name: 'DocumentPreviewCard',
    components: {DocumentTagBar},
    props: {
      docId: { required: true, type: Number}
    },
    data() {
      return {
        documentPreview: null,
        baseUrl: baseAppURL,

          titleContent: null,
          previewContent: null
      }
    },
    mounted () {
        this.updateCurrentDocumentPreviewCard();
    },
    computed: {
        ...mapState('document', ['documentsPreview', 'documentLoading'])
    },
    watch: {
       documentsPreview() {
           this.updateCurrentDocumentPreviewCard();
       }
    }   ,
    methods: {
      updateCurrentDocumentPreviewCard: function() {
          this.titleContent = "";
          this.previewContent = "";

          if (this.documentsPreview[this.docId]) {
              this.documentPreview = this.documentsPreview[this.docId];

              this.titleContent = this.documentPreview.attributes.title;
              this.previewContent = this.documentPreview.attributes.transcription ? this.documentPreview.attributes.transcription : this.documentPreview.attributes.argument;
          }
      }

    },
  }
</script>

<style scoped>


  .document-preview-card__persons ul {
    list-style: none;
  }

  .document-preview-card {
    margin-bottom: 6em;
    margin-top: 2em;
  }
  .document-preview-card__thumbnail {
    float: left;
    margin-right: 40px;
    height: 150px;
  }

  .document-preview-card__title{
    color: #AEAEAE;
    font-size: large;
    font-weight: lighter;
    padding-bottom: 1em;
  }

  .document-preview-card__title:hover{
    color: #3273dc;
  }

  .document-preview-card__alt-thumbnail  {
    width: 128px;
    height: 170px;
  }

  .document-preview-card__alt-thumbnail i {
    font-size: 64px;
  }

    /* styles for '...' */
  .document-preview-card__content {
    /* hide text if it more than N lines  */
    overflow: hidden;
    /* for set '...' in absolute position */
    position: relative;
    /* use this value to count block height */
    line-height: 1.2em;
    /* max-height = line-height (1.2) * lines max number (3) */
    max-height: 3.6em;
    /* fix problem when last visible word doesn't adjoin right side  */
    text-align: justify;
    /* place for '...' */
    margin-right: -1em;
    padding-right: 1em;
  }
  /* create the ... */
  .document-preview-card__content:before {
    /* points in the end */
    content: '...';
    /* absolute position */
    position: absolute;
    /* set position to right bottom corner of block */
    right: 0;
    bottom: 0;
  }
  /* hide ... if we have text, which is less than or equal to max lines */
  .document-preview-card__content:after {
    /* points in the end */
    content: '';
    /* absolute position */
    position: absolute;
    /* set position to right bottom corner of text */
    right: 0;
    /* set width and height */
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    /* bg color = bg color under block */
    background: white;
  }
</style>