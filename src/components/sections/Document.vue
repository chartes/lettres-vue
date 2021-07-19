<template>
  <div class="document">
    <document-tag-bar
      v-if="!preview && current_user && tagData"
      :doc-id="docId"
      :with-status="true"
    />

    <article v-if="document && !isLoading" class="document__content">
      <!-- titre et langue -->
      <section class="document-section columns">
        <document-title
          :editable="canEdit"
          :preview="preview"
          class="column is-three-quarters"
        />
        <document-languages :editable="canEdit" class="column" />
      </section>
      <!-- dates de lieux et de temps -->

      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Dates</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div>
          <document-date-attributes :editable="canEdit" />
          <document-placenames :editable="canEdit" />
        </div>
      </section>

      <!-- correspondents -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Correspondants</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div>
          <document-persons :editable="canEdit" />
        </div>
      </section>

      <!-- témoins
      <document-witnesses :editable="canEdit" :list="witnesses" />
       -->

      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content"> Témoins </span>
          <b-button
            type="is-light"
            value="+"
            size="is-small"
            class="open-modal-button"
            @click="openWitnessModal = true"
          >
            <i class="fas fa-plus" />
          </b-button>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div>
          <witness-list :open-modal="openWitnessModal" />
        </div>
      </section>

      <!-- analyse -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Analyse</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div>
          <document-argument :editable="canEdit" />
        </div>
      </section>
      <!-- transcription -->
      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Transcription</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div>
          <document-transcription v-if="!preview" :editable="canEdit" />
        </div>
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
import DocumentTitle from "../document/DocumentTitle";
import DocumentLanguages from "../document/DocumentLanguages";

import DocumentDateAttributes from "../document/DocumentDateAttributes";
import DocumentSkeleton from "@/components/ui/DocumentSkeleton";
import WitnessList from "@/components/document/WitnessList.vue";

import { http_with_auth } from "@/modules/http-common";

export default {
  name: "Document",
  emit: ["open-witness-modal"],
  components: {
    Changelog,
    DocumentSkeleton,
    DocumentPersons,
    DocumentPlacenames,
    DocumentArgument,
    DocumentTranscription,
    DocumentTagBar,
    DocumentLanguages,
    WitnessList,
    DocumentTitle,
    DocumentDateAttributes,
  },
  props: {
    docId: { required: true, type: Number },
    preview: { type: Boolean, default: false },
  },
  data() {
    return {
      isLoading: true,

      openWitnessModal: false,
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

.document__content {
  //display: flex;
  //flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
}

.panel {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.document-section {
  &.columns {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 30px;

    .column {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}

.slope-container {
  height: 3px;
  //width: 227px;
  display: flex;
}

.slope {
  transform: skewX(45deg);
  display: none;
}
.tier-1 {
  width: 120px;
  background-color: #557174;
}
.tier-2 {
  width: 14px;
  background-color: #96bb7c;
}
.tier-3 {
  width: 7px;
  background-color: #c6ebc9;
}
.tier-4 {
  width: 160px;
  background-color: #baaf92;
}

.heading {
  display: block;
  background-color: $beige-lighter;
  margin-bottom: 3px;
  margin-top: 3px;
  padding-left: 5px;
  border-left: 3px solid $nice-grey;
}
.heading-content {
  display: inline-block;

  color: $brown;
  font-family: $bitter-family;
  font-size: 18px;
  padding: 5px;
}
.main-column-content {
  padding-left: 0px !important;
}
.open-modal-button {
  margin-top: 3px;
  background-color: $beige-lighter !important;
  &:hover {
    background-color: $nice-grey !important;
  }
}
</style>
