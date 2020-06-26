<template>
  <div
    class="document"
  >
    <document-tag-bar
      v-if="current_user"
      :doc-id="docId"
    />

    <article
      v-if="document && !documentLoading"
      class="document__content"
    >
      <!-- titre et langue -->
      <document-attributes :editable="canEdit" />

      <!-- dates de lieux et de temps -->
      <div class="panel mt-5">
        <p class="panel-heading">
          Dates
        </p>
        <div class="panel-block">
          <document-date-attributes :editable="canEdit" />
        </div>
        <div class="panel-block">
          <document-placenames :editable="canEdit" />
        </div>
      </div>

      <!-- correspondents -->
      <document-persons :editable="canEdit" />

      <!-- témoins -->
      <document-witnesses
        :editable="canEdit"
        :list="witnesses"
      />

      <!-- analyse -->
      <document-argument :editable="canEdit" />

      <!-- dates de lieux et de temps -->
      <document-transcription :editable="canEdit" />

      <!-- collections 
      <document-collections :editable="canEdit" />
      -->
      <div
        class="mt-5"
        style="margin-left: 0;"
      >
        <header class="subtitle mb-3">
          Historique des modifications
        </header>
        <changelog
          v-if="current_user"
          :doc-id="docId"
          :per-page="10"
        />
      </div>
    </article>
   
    <document-skeleton
      v-if="documentLoading"
      class="mt-5"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingIndicator from "../ui/LoadingIndicator";
import Changelog from "@/components/sections/Changelog";
import DocumentPersons from "../document/DocumentPersons";
import DocumentTranscription from "../document/DocumentTranscription";
import DocumentTagBar from "../document/DocumentTagBar";
import DocumentPlacenames from "../document/DocumentPlacenames";
import { baseApiURL, baseAppURL } from "../../modules/http-common";
import DocumentArgument from "../document/DocumentArgument";
import DocumentWitnesses from "../document/DocumentWitnesses";
//import DocumentCollections from "../document/DocumentCollections";
import DocumentAttributes from "../document/DocumentAttributes";
import DocumentDateAttributes from "../document/DocumentDateAttributes";
import DocumentSkeleton from "@/components/ui/DocumentSkeleton";

export default {
  name: "Document",
  components: {
    Changelog,
    DocumentSkeleton,
    DocumentPersons,
    DocumentPlacenames,
    DocumentArgument,
    DocumentTranscription,
    DocumentTagBar,
   // DocumentCollections,
    DocumentWitnesses,
    DocumentAttributes,
    DocumentDateAttributes
  },
  props: {
    docId: { required: true, type: Number }
  },
  data() {
    return {
      canEdit: false,
      isLoading: true
    };
  },
  created() {
   
  },
  mounted() {
    this.isLoading = true;
    this.$store
      .dispatch("document/fetch", this.docId)
      .then(r => {
        this.computeCanEdit();
        this.isLoading = false;
      })
      .catch(e => {
        console.warn("ERROR", e);
        //window.location.replace(baseAppURL);
      });
  },
  computed: {
    ...mapState("document", [
      "document",
      "documentLoading",
      "documentsPreview",
      "collections",
      "witnesses",
      "currentLock"
    ]),
    ...mapState("user", ["current_user", "isUserLoaded"]),
    ...mapState("locks", ["lockOwner"]),

    collectionURL() {
      const baseUrl = window.location.origin
        ? window.location.origin + "/"
        : window.location.protocol + "/" + window.location.host;
      return `${baseUrl}${baseApiURL.substr(1)}/iiif/documents/${
        this.docId
      }/collection/default`;
    }
  },
  watch: {
    lockOwner() {
      this.computeCanEdit();
    },
    documentsPreview() {
      this.computeCanEdit();
    }
  },
  methods: {
    computeCanEdit() {
      /*
       * Can edit if 1) You are connected 2) You are an admin or there is no active lock or the active lock is yours
       * */
      if (!this.current_user) {
        this.canEdit = false;
        return;
      }

      if (this.current_user.isAdmin) {
        this.canEdit = true;
        return;
      }
      this.canEdit =
        (this.documentsPreview[this.docId] &&
          this.documentsPreview[this.docId].currentLock.id === null) ||
        (this.lockOwner[this.docId] &&
          this.lockOwner[this.docId].id === this.current_user.id);
    }
  }
};
</script>

<style scoped>
.document {
  width: 100%;
}
</style>