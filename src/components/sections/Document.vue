<template>
  <div
      class="document"
      :class="canEdit ? 'edit-mode' : ''"
  >
    <div class="columns">
      <document-tag-bar
      class="column tag-bar"
      v-if="!preview && !isLoading && current_user"
      :doc-id="docId"
      :with-status="true"
    />
    <document-deletion
      class="column delete-button"
      v-if="!preview && current_user && current_user.isAdmin"
      :doc-id="docId"
    />
    </div>
    <article v-if="document && !isLoading" class="document__content">
      <!-- titre et langue -->
      <section class="document-section columns">
        <document-title
          v-if="!preview"
          :editable="canEdit"
          :preview="preview"
          class="column is-three-quarters"
          @add-note="addNote"
        />
        <document-languages :editable="canEdit" class="column" />
      </section>
      <!-- dates de lieux et de temps -->

      <section class="document-section">
        <div class="heading is-uppercase">
          <span class="heading-content">Dates</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div class="document-section-content">
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
        <div class="heading is-uppercase">
          <span class="heading-content">Correspondants</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div class="document-section-content">
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
        <div class="heading is-uppercase">
          <span class="heading-content "> Témoins </span>
          <b-button
            v-if="canEdit"
            value="+"
            class="open-modal-button has-add-btn"
            @click="openWitnessModal = true"
          >
            <icon-add />
          </b-button>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div class="document-section-content">
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
        <div class="heading is-uppercase">
          <span class="heading-content">Collections</span>
        </div>
        <div class="document-section-content">
          <document-collections :editable="canEdit" />
        </div>
      </section>

      <!-- analyse -->
      <section class="document-section">
        <div class="heading is-uppercase">
          <span class="heading-content">Analyse</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div class="document-section-content">
          <document-argument
            :editable="canEdit"
            @add-place="addPlace"
            @add-person="addPerson"
            @add-note="addNote"
          />
        </div>
      </section>

      <!-- transcription -->
      <section v-if="!preview" class="document-section">
        <div class="heading is-uppercase">
          <span class="heading-content">Transcription</span>
          <div class="slope-container">
            <span class="slope tier-1" />
            <span class="slope tier-2" />
            <span class="slope tier-3" />
            <span class="slope tier-4" />
          </div>
        </div>
        <div class="document-section-content">
          <document-transcription
            :editable="canEdit"
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
        <header class="subtitle mb-3">Historique des modifications</header>
        <changelog :doc-id="docId" :per-page="10" />
      </div>
    </article>

    <document-skeleton v-if="isLoading" class="mt-5" />

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
import IconAdd from "@/components/ui/icons/IconAdd";

export default {
  name: "Document",
  //emit: ["open-witness-modal"],
  components: {
    IconAdd,
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
      await this.$store.dispatch("document/fetch", this.docId);
      this.setLastSeen(this.docId);
    } catch (e) {
      await this.$router.push({name: "home"});
    }
    this.isLoading = false;
  },

  methods: {
    ...mapActions("layout", ["setLastSeen"]),

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

  & > .columns {
    align-items: center;
    margin: 30px 0 40px !important;

    .tag-bar {
      padding: 0;
      margin: 0;
    }
  }
}

.document__content {
  //display: flex;
  //flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
}

.document-section {
  flex-direction: column;
  align-items: flex-start;

  font-family: $family-primary;
  font-size: 20px;
  line-height: 1.2;

  // Section : Titre du document et langues
  &.columns {
    margin: 20px 0 50px;

    .column {
      padding: 0;
      border: none;

      &.component {
        align-self: flex-start !important;
      }

      &:first-child {
        width: 100%;
      }

      ::v-deep {
        .tag:not(body).is-light {
          background: none;
          font-family: $family-primary;
          font-size: 16px;
          color: #6D7278;
          font-weight: 400;
        }
      }

    }
  }

  // Sections : Termes et contenus des metadonnées

  & > .heading {
    display: flex;
    gap: 2px;
    margin-bottom: 20px;

    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    color: #FF0052;
    letter-spacing: 0;
    text-transform: uppercase;

    .heading-content {
      display: inline-block;
    }

    &::after {
      display: block;
      content: '';
      width: 100%;
      border-bottom: 1px solid #FF0052;
      transform: translateY(-3px);
    }
  }

  & > .document-section-content {
    margin-left: 60px;
    margin-bottom: 40px;

    ::v-deep {

      a {
        color: #000000;

        &:hover {
          color: #C00055;
          text-decoration: underline;
        }
      }

      .document-date__attributes {
        margin-bottom: 20px;
      }

      .label,
      .heading {
        font-size: 16px;
        color: #000000;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      .label {
        font-size: 13px;
      }

      .panel {
        -webkit-box-shadow: none;
        box-shadow: none;

        font-family: $family-primary;

        .panel-block {
          border: none;
          padding: 0;
          margin-bottom: 20px;

          & > :nth-child(2) {
            font-size: 20px;
            color: #585858;
            font-weight: 400;
            letter-spacing: 0;
          }
        }
      }

      .tag {
        background: none;
        padding: 0;
        margin: 0;

        .breadcrumb.is-small {
          font-size: 20px;
          font-weight: 400;

          a {
            color: #000000;

            &:hover {
              color: #C00055;
              text-decoration: underline;
            }
          }
        }
      }

    }
  }

}


// Mode édition

.document.edit-mode {

  .document-section {
    border: 1px solid #FF0052;
    border-radius: 5px;
    padding: 30px;
    margin-bottom: 30px;

    // Section du titre
    &.columns::before {
      content: "TITRE";
      display: inline-block;
      margin-bottom: 20px;
      font-weight: 500;
      color: #FF0052;
    }

    & > .heading {

      span {
        font-size: 20px;
      }

      &::after {
        display: none;
      }
    }

    & > .document-section-content {
      margin-left: 30px;
      margin-bottom: 0;

      ::v-deep {

        .has-add-btn {
          display: flex !important;
          align-items: center;
          gap: 8px;
          line-height: 20px;

          a.tag .icon {
            width: 20px !important;
            height: 20px !important;
            margin: 0 !important;
            padding: 0 !important;

            .icon__line {
              stroke: #FFFFFF;
            }
          }

          a.tag:hover .icon circle {
            fill: #C00055;
          }

        }

      }
    }

  }

}

.delete-button {
  flex: 38px 0 0;
  padding: 0;

  ::v-deep {

    & > a.tag {
      display: inline-block;
      width: 38px;
      max-width: unset;
      max-height: unset;
      height: 38px;
      background: url(../../assets/images/icons/bouton_supprimer.svg) center / 38px auto no-repeat !important;
      border-radius: 0!important;
      border: none !important;
      margin: 0;
      text-indent: -9999px;

      .icon {
        display: none;
      }
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

.button.open-modal-button.has-add-btn {
  display: flex !important;
  align-items: center;
  line-height: 20px;

  height: 20px !important;
  background-color: transparent !important;
  border: none;
  padding: 0;

  ::v-deep {

    span {
      display: inline-block;
      width: 20px;
      height: 20px;

      .icon {
        width: 20px !important;
        height: 20px !important;
        margin: 0 0 0 8px !important;
        padding: 0 !important;

        .icon__line {
          stroke: #FFFFFF;
        }
      }
    }
  }

  &:hover {
    ::v-deep {
      .icon circle {
        fill: #C00055;
      }
    }
  }

}
</style>
