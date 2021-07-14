<template>
  <div class="document">
    <document-tag-bar
      v-if="!preview && current_user && tagData"
      :doc-id="docId"
      :with-status="true"
    />

    <article v-if="document && !isLoading" class="document__content">
      <!-- titre et langue -->
      <document-attributes :editable="canEdit" :preview="preview" />

      <!-- dates de lieux et de temps -->

      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Dates</span>
        </div>
        <document-date-attributes :editable="canEdit" />
        <document-placenames :editable="canEdit" />
      </section>

      <!-- correspondents -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Correspondants</span>
        </div>
        <document-persons :editable="canEdit" />
      </section>

      <!-- témoins -->
      <document-witnesses :editable="canEdit" :list="witnesses" />

      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Témoins</span>
        </div>
        <witness-list />
      </section>

      <!-- analyse -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Analyse</span>
        </div>
        <document-argument :editable="canEdit" />
      </section>
      <!-- transcription -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Transcription</span>
        </div>
        <document-transcription v-if="!preview" :editable="canEdit" />
      </section>
      <!-- collections 
      <document-collections :editable="canEdit" />
      -->
      <div
        v-if="!preview && current_user"
        class=""
        style="margin-left: 0; margin-top: 50px"
      >
        <header class="subtitle mb-3">Historique des modifications</header>
        <changelog :doc-id="docId" :per-page="10" />
      </div>
    </article>

    <document-skeleton v-if="isLoading" class="mt-5" />
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
import WitnessList from "@/components/WitnessList.vue";

import { http_with_auth } from "@/modules/http-common";

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
    WitnessList,
    DocumentAttributes,
    DocumentDateAttributes,
  },
  props: {
    docId: { required: true, type: Number },
    preview: { type: Boolean, default: false },
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapState("document", [
      "document",
      "documentLoading",
      "collections",
      "witnesses",
      "currentLock",
    ]),
    ...mapState("user", ["current_user", "jwt"]),
    ...mapState("locks", ["lockOwner"]),
    ...mapGetters("document", ["getPreview"]),

    collectionURL() {
      const baseUrl = window.location.origin
        ? window.location.origin + "/"
        : window.location.protocol + "/" + window.location.host;
      return `${baseUrl}${baseApiURL.substr(1)}/iiif/documents/${
        this.docId
      }/collection/default`;
    },
    tagData() {
      if (!this.current_user || !this.document) {
        return null;
      }
      const http = http_with_auth(this.jwt);
      return {
        currentLock: this.document.currentLock,
        isPublished: this.document["is-published"],
        isBookmarked: http
          .get(`/users/${this.current_user.id}/relationships/bookmarks`)
          .then(
            (response) => response.data.data.filter((d) => d.id === this.docId).length > 0
          ),
      };
    },
    canEdit() {
      if (this.preview) {
        return false;
      }
      /*
       * Can edit if 1) You are connected 2) You are an admin or there is no active lock or the active lock is yours
       * */
      if (!this.current_user || !this.jwt) {
        return false;
      }

      if (this.current_user.isAdmin) {
        return true;
      }

      return (
        (this.preview && this.preview.currentLock.id === null) ||
        (this.lockOwner[this.docId] &&
          this.lockOwner[this.docId].id === this.current_user.id)
      );
    },
  },
  async created() {
    this.isLoading = true;
    this.$store.dispatch("document/fetch", this.docId).then(async (r) => {
      this.isLoading = false;
      this.setLastSeen(this.docId);
    });
  },

  methods: {
    ...mapActions("layout", ["setLastSeen"]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document {
  width: 100%;
}
.panel {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.document-section {
  margin-top: 10px;
  padding-bottom: 10px;
}

.heading {
  border-bottom: 1px solid $grey-light;
}
.heading-content {
  width: 230px;
  display: inline-block;

  color: $brown;

  background-color: $beige-lighter;
  font-family: $bitter-family;
  padding: 3px;
  padding-left: 8px;
  padding-right: 40px;
  margin-left: 7px;

  border: 1px solid $grey-light;
  border-bottom: none;

  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.main-column-content {
  padding-left: 0px !important;
}
</style>
