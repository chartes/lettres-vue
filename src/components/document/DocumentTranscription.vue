<template>
  <div class="document__transcription">
    <div class="panel ">
      <header class="panel-heading">
        <span 
          class="svg-icon"
          v-html="require('@/assets/images/icons/document-transcription.svg')"
        />
        <h2 class="document__transcription--title subtitle">
          Transcription
        </h2>
      </header>
      
      <div
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <h3 class="subtitle mt-3">
          Adresse
        </h3>
        
        <rich-text-editor
          v-if="editable"
          v-model="addressContent"
          :formats="[['italic','superscript'],['note']]"
        >
          <editor-save-button
            :doc-id="document.id"
            name="address"
            :value="addressContent"
          />
        </rich-text-editor>
        <div
          v-else
          class="document__transcription--content"
          v-html="addressContent"
        />
      </div>
      
      <div
        class="panel-block document__transcription--tr-content"
        style="display: inline-block; width: 100%"
      >
        <h3 class="subtitle mt-3">
          Lettre
        </h3>
        <rich-text-editor
          v-if="editable"
          v-model="transcriptionContent"
          :formats="[['italic','superscript', 'page'], ['person','location'], ['note']]"
        >
          <editor-save-button
            :doc-id="document.id"
            name="transcription"
            :value="transcriptionContent"
          />
        </rich-text-editor>
        <div
          v-else
          class="document__transcription--content"
          v-html="transcriptionContent"
        />
      </div>
    </div>
    
    <document-notes :editable="editable" />
  </div>
</template>

<script>

  import { mapState } from 'vuex'
  import RichTextEditor from '../forms/fields/RichTextEditor';
  import EditorSaveButton from '../forms/fields/EditorSaveButton';
  import DocumentNotes from './DocumentNotes';
  
  export default {
    name: 'DocumentTranscription',
    components: {EditorSaveButton, RichTextEditor, DocumentNotes},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        transcriptionContent: '',
        addressContent: ''
      }
    },
    mounted() {
      console.log("@@ init transcription content", this.document.id)
      this.transcriptionContent = this.document.transcription || '';
      this.addressContent = this.document.address || ''
    },
    methods: {
    },
    computed: {
      ...mapState('document', ['document', 'witnesses']),
    },
    watch: {
    }
  }
</script>

<style scoped>
</style>
