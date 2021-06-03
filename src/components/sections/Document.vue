<template>
  <div
    class="document"
  >
    <document-tag-bar
      v-if="current_user && tagData"
      :doc-id="docId"
      :preview-data="tagData"
      :with-status="true"
    />

    <article
      v-if="document && !documentLoading && !isLoading"
      class="document__content"
    >
      <!-- titre et langue -->
      <document-attributes :editable="canEdit" />

      <!-- dates de lieux et de temps -->
      <div class="panel mt-5">
        <header class="panel-heading">
          <h2 class="subtitle">
            Dates
          </h2>
        </header>
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
        v-if="current_user"
        class=""
        style="margin-left: 0; margin-top: 50px;"
      >
        <header class="subtitle mb-3">
          Historique des modifications
        </header>
        <changelog
          :doc-id="docId"
          :per-page="10"
        />
      </div>
    </article>
   
    <document-skeleton
      v-if="isLoading || !tagData"
      class="mt-5"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Changelog from "@/components/sections/Changelog";
import DocumentPersons from "../document/DocumentPersons";
import DocumentTranscription from "../document/DocumentTranscription";
import DocumentTagBar from "../document/DocumentTagBar";
import DocumentPlacenames from "../document/DocumentPlacenames";
import { baseApiURL } from "../../modules/http-common";
import DocumentArgument from "../document/DocumentArgument";
import DocumentWitnesses from "../document/DocumentWitnesses";
//import DocumentCollections from "../document/DocumentCollections";
import DocumentAttributes from "../document/DocumentAttributes";
import DocumentDateAttributes from "../document/DocumentDateAttributes";
import DocumentSkeleton from "@/components/ui/DocumentSkeleton";

import {http} from "@/modules/http-common";
import {getCurrentLock} from "@/modules/document-helpers"

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
      isLoading: true,
      tagData: null,
    };
  },
   computed: {
    ...mapState("document", [
      "document",
      "documentLoading",
      "collections",
      "witnesses",
      "currentLock"
    ]),
    ...mapState("user", ["current_user", "isUserLoaded"]),
    ...mapState("locks", ["lockOwner"]),
    ...mapGetters('document', ['getPreview']),

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
    }
  },
  async created() {
    this.isLoading = true;
    this.$store
      .dispatch("document/fetch", this.docId)
      .then(async r => {
        this.computeCanEdit();
        this.isLoading = false;
        this.setLastSeen(this.docId);
        this.tagData = {
            currentLock: this.document.currentLock,
            isBookmarked: await http.get(`/users/${this.current_user.id}/relationships/bookmarks`).then(
              response => response.data.data.filter(d => d.id === this.docId).length > 0
            )
        }
        console.log("this is tagData", this.tagData)
      })
  },

  methods: {
    ...mapActions('layout', ['setLastSeen']),

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
        (this.preview && this.preview.currentLock.id === null) ||
        (this.lockOwner[this.docId] &&
          this.lockOwner[this.docId].id === this.current_user.id);
    }
  }
};
</script>

<style scoped lang="scss">
.document {
  width: 100%;
}
.panel {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>