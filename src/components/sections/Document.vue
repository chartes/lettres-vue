<template>
  <div class="document">
    <div
      v-if="!preview"
      class="is-justify-content-left">
      <nav class="mb-3">
        <a
          role="button"
          :href="`/documents/${ docId-1 }`"
          :disabled="docId === 1"
          aria-label="Previous page"
          class="pagination-link pagination-previous"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-left" />
          </span>
        </a>
        <a
          role="button"
          :href="`/documents/${ docId+1 }`"
          aria-label="Next page"
          :disabled="docId === lastDocId"
          class="pagination-link pagination-next"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-right" />
          </span>
        </a>
      </nav>
    </div>
    <div class="columns">
      <document-tag-bar
        v-if="!preview && !isLoading && current_user"
        class="column is-three-quarters"
        :doc-id="docId"
        :with-status="true"
      />
      <document-deletion
        v-if="!preview && !isLoading && current_user && current_user.isAdmin"
        class="column"
        :doc-id="docId"
      />
    </div>
    <article
      v-if="document && !isLoading"
      class="document__content"
    >
      <!-- titre et langue -->
      <section class="document-section columns">
        <document-title
          v-if="!preview"
          :editable="canEdit"
          :preview="preview"
          class="column is-three-quarters"
          @add-note="addNote"
        />
        <document-languages
          :editable="canEdit"
          class="column"
        />
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
          <document-placenames
            :editable="canEdit"
            @add-place="addPlace"
            @unlink-place="unlinkPlace"
          />
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
          <document-persons
            :editable="canEdit"
            @add-person="addPerson"
            @unlink-person="unlinkPerson"
          />
        </div>
      </section>

      <!-- témoins
      <document-witnesses :editable="canEdit" :list="witnesses" />
       -->

      <section class="document-section">
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content"> Témoins </span>
          <b-button
            v-if="canEdit"
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
          <witness-list
            :editable="canEdit"
            :open-modal="openWitnessModal"
            @add-note="addNote"
            @close-witness-modal="openWitnessModal = false"
          />
        </div>
      </section>

      <section class="document-section">
        <!-- collections -->
        <div class="heading is-size-5 is-uppercase">
          <span class="heading-content">Collections</span>
        </div>
        <document-collections :editable="canEdit" />
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
          <document-argument
            :editable="canEdit"
            @add-place="addPlace"
            @add-person="addPerson"
            @add-note="addNote"
          />
        </div>
      </section>
      <!-- transcription -->
      <section
        class="document-section"
      >
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
          <document-transcription
            :editable="canEdit"
            :preview="preview"
            @add-place="addPlace"
            @add-person="addPerson"
            @add-note="addNote"
          />
        </div>
      </section>

      <div
        v-if="!preview && current_user"
        class=""
        style="margin-left: 0; margin-top: 50px"
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
      v-if="isLoading"
      class="mt-5"
    />

    <!-- modals -->
    <b-modal
      v-if="canEdit"
      v-model="isNoteFormModalActive"
      trap-focus
      has-modal-card
      :can-cancel="['escape', 'x']"
      scroll="clip"
      width="80%"
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Note"
      aria-modal
    >
      <template #default="props">
        <note-form
          title="Note"
          :input-data="noteInputData"
          @add-place="addPlace($event)"
          @add-person="addPerson($event)"
          @close="
            () => {
              props.close();
            }
          "
        />
      </template>
    </b-modal>

    <b-modal
      v-if="canEdit"
      v-model="isPlaceWizardFormModalActive"
      trap-focus
      has-modal-card
      :can-cancel="['escape', 'x']"
      scroll="clip"
      width="80%"
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Date de lieu"
      aria-modal
    >
      <template #default="props">
        <place-wizard-form
          subtitle=""
          :input-data="placeInputData"
          @close="
            () => {
              props.close();
            }
          "
        />
      </template>
    </b-modal>

    <b-modal
      v-if="canEdit"
      v-model="isPersonWizardFormModalActive"
      trap-focus
      has-modal-card
      :can-cancel="['escape', 'x']"
      scroll="clip"
      width="80%"
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Expéditeur et destinataire"
      aria-modal
    >
      <template #default="props">
        <person-wizard-form
          subtitle=""
          :input-data="personInputData"
          @close="
            () => {
              props.close();
            }
          "
        />
      </template>
    </b-modal>
    <!--<modal-confirm-document-delete
      v-if="delete_documentId && this.current_user.isAdmin"
      :doc-id="delete_documentId"
      :cancel="cancelDocumentDelete"
      :submit="confirmDocumentDelete"
    />-->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Changelog from "@/components/sections/Changelog";
import DocumentPersons from "../document/DocumentPersons";
import DocumentTranscription from "../document/DocumentTranscription";
import DocumentTagBar from "../document/DocumentTagBar";
import DocumentDeletion from "../document/DocumentDeletion";
import DocumentCollections from "../document/DocumentCollections";
import DocumentPlacenames from "../document/DocumentPlacenames";
import { baseApiURL } from "../../modules/http-common";
import DocumentArgument from "../document/DocumentArgument";
import DocumentTitle from "../document/DocumentTitle";
import DocumentLanguages from "../document/DocumentLanguages";
import NoteForm from "@/components/forms/NoteForm";

import DocumentDateAttributes from "../document/DocumentDateAttributes";
import DocumentSkeleton from "@/components/ui/DocumentSkeleton";
import WitnessList from "@/components/document/WitnessList.vue";

import PlaceWizardForm from "@/components/forms/wizards/PlaceWizardForm.vue";
import PersonWizardForm from "@/components/forms/wizards/PersonWizardForm.vue";

export default {
  name: "Document",
  //emit: ["open-witness-modal"],
  components: {
    Changelog,
    DocumentSkeleton,
    DocumentPersons,
    DocumentPlacenames,
    DocumentArgument,
    DocumentCollections,
    DocumentTranscription,
    DocumentTagBar,
    DocumentDeletion,
    DocumentLanguages,
    WitnessList,
    DocumentTitle,
    DocumentDateAttributes,
    PlaceWizardForm,
    PersonWizardForm,
    NoteForm,
  },
  props: {
    docId: { required: true, type: Number },
    preview: { type: Boolean, default: false },
  },
  data() {
    return {
      lastDocId: 0,
      isLoading: true,

      openWitnessModal: false,

      placeInputData: null,
      isPlaceWizardFormModalActive: false,

      personInputData: null,
      isPersonWizardFormModalActive: false,

      noteInputData: null,
      isNoteFormModalActive: false,
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
    ...mapGetters("document", ["locationDateFrom", "locationDateTo"]),
    ...mapGetters("placenames", ["getRoleByLabel"]),
    ...mapGetters("persons", ["getRoleByLabel"]),

    collectionURL() {
      const baseUrl = window.location.origin
        ? window.location.origin + "/"
        : window.location.protocol + "/" + window.location.host;
      return `${baseUrl}${baseApiURL.substr(1)}/iiif/documents/${
        this.docId
      }/collection/default`;
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
  watch: {},
   async created() {
    this.isLoading = true;
    try {
      let documentsTotal = await this.getDocumentsTotal().then(resp => {
        return resp.documentsTotal
      });
      console.log('documentsTotal : ', documentsTotal)
      this.lastDocId = await this.getDocumentsTotal().then(resp => {
        return resp.lastDocId
      });
      console.log('lastDocId : ', this.lastDocId);

      await this.$store.dispatch("document/fetch", this.docId);
      this.setLastSeen(this.docId);
    } catch (e) {
      console.log("e : ", e)
      await this.$router.push({name: "home"});
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions("layout", ["setLastSeen"]),
    ...mapActions("search", ["getDocumentsTotal"]),
    addPlace(evt) {
      this.placeInputData = evt;
      this.isPlaceWizardFormModalActive = true;
    },
    unlinkPlace({ id, relationId, roleId }) {
      this.$store.dispatch("placenames/unlinkFromDocument", {
        id,
        relationId,
        roleId,
      });
    },

    addPerson(evt) {
      this.personInputData = evt;
      this.isPersonWizardFormModalActive = true;
    },
    unlinkPerson({ id, relationId, roleId }) {
      this.$store.dispatch("persons/unlinkFromDocument", {
        id,
        relationId,
        roleId,
      });
    },

    addNote(evt) {
      this.noteInputData = evt;
      this.isNoteFormModalActive = true;
    },
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
