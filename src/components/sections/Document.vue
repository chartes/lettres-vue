<template>
  <div
    class="document"
    :class="documentCssClass"
  >
    <!-- Not preview mode -->
    <div
      v-if="!preview"
      class="is-justify-content-left"
    >
      <nav
        v-if="current_user && lastDocId"
        class="mb-3 previous-next-navigation"
      >
        <!-- User connected, navigation is docId +/- 1 and range bounds are 1 to last doc in database -->
        <a
          :href="$router.resolve({ name: 'document', params: {docId: docId - 1 } } ).href"
          aria-label="Previous page"
          class="pagination-link pagination-previous"
          :disabled="docId === 1"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-left" />
          </span>
        </a>
        <a
          :href="$router.resolve({ name: 'document', params: {docId: docId + 1 } } ).href"
          aria-label="Next page"
          class="pagination-link pagination-next"
          :disabled="docId === lastDocId"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-left" />
          </span>
        </a>
      </nav>
      <nav
        v-if="!current_user && firstDocId && previousDocId && nextDocId && lastDocId && docIdList"
        class="mb-3 previous-next-navigation"
      >
        <a
          :href="$router.resolve({ name: 'document', params: {docId: previousDocId } } ).href"
          aria-label="Previous page"
          class="pagination-link pagination-previous"
          :disabled="docId === firstDocId"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-left" />
          </span>
        </a>
        <a
          :href="$router.resolve({ name: 'document', params: {docId: nextDocId } } ).href"
          aria-label="Next page"
          class="pagination-link pagination-next"
          :disabled="docId === lastDocId"
        >
          <span
            class="icon"
            aria-hidden="true"
          >
            <i class="fas fa-angle-left" />
          </span>
        </a>
      </nav>
      <!--<nav class="mb-3 previous-next-navigation">
        <a
          v-if="firstDocId && previousDocId && docIdList"
          role="button"
          :href="current_user ? `/documents/${ docId-1 }`: `/documents/${ previousDocId }`"
          :disabled="current_user ? docId === 1 : docId === firstDocId"
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
          v-if="nextDocId && lastDocId"
          role="button"
          :href="current_user ? `/documents/${ docId + 1 }`: `/documents/${ nextDocId }`"
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
      </nav>-->
      <div
        class="document"
        :class="documentCssClass"
      >
        <div class="columns">
          <document-tag-bar
            v-if="!isLoading && current_user"
            class="column"
            :doc-id="docId"
            :with-status="true"
            :preview="preview"
          />
          <document-deletion
            v-if="!isLoading && current_user && current_user.isAdmin"
            class="column delete-button"
            :doc-id="docId"
          />
        </div>
        <article
          v-if="document && !isLoading"
          class="document__content"
        >
          <!-- titre et langue -->
          <section class="document-section document-section-for-title">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Titre</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isTitleOpen"
                aria-controls="titleSection"
                @click="isTitleOpen = !isTitleOpen"
              >
                <i :class="isTitleOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
            </div>
            <b-collapse
              :class="!canEdit? '' : isTitleOpen? '' : 'hiddendiv'"
              aria-id="titleSection"
            >
              <template #default>
                <div>
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
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- correspondants -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Correspondants</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isPersonsOpen"
                aria-controls="personsSection"
                @click="isPersonsOpen = !isPersonsOpen"
              >
                <i :class="isPersonsOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isPersonsOpen? '' : 'hiddendiv'"
              aria-id="personsSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-persons
                    :editable="canEdit"
                    @add-person="addPerson"
                    @unlink-person="unlinkPerson"
                  />
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- dates de temps -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Dates</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isDatesOpen"
                aria-controls="datesSection"
                @click="isDatesOpen = !isDatesOpen"
              >
                <i :class="isDatesOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isDatesOpen? '' : 'hiddendiv'"
              aria-id="datesSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-date-attributes :editable="canEdit" />
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- dates de lieux -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Lieux</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isPlacesOpen"
                aria-controls="placesSection"
                @click="isPlacesOpen = !isPlacesOpen"
              >
                <i :class="isPlacesOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isPlacesOpen? '' : 'hiddendiv'"
              aria-id="placesSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-placenames
                    :editable="canEdit"
                    @add-place="addPlace"
                    @unlink-place="unlinkPlace"
                  />
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- analyse -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Analyse</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isAnalyseOpen"
                aria-controls="analyseSection"
                @click="isAnalyseOpen = !isAnalyseOpen"
              >
                <i :class="isAnalyseOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isAnalyseOpen? '' : 'hiddendiv'"
              aria-id="analyseSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-argument
                    :editable="canEdit"
                    :preview="preview"
                    @add-place="addPlace"
                    @add-person="addPerson"
                    @add-note="addNote"
                  />
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- transcription -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Transcription</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isTranscriptionOpen"
                aria-controls="transcriptionSection"
                @click="isTranscriptionOpen = !isTranscriptionOpen"
              >
                <i :class="isTranscriptionOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isTranscriptionOpen? '' : 'hiddendiv'"
              aria-id="transcriptionSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-transcription
                    :editable="canEdit"
                    :preview="preview"
                    @add-place="addPlace"
                    @add-person="addPerson"
                    @add-note="addNote"
                  />
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- témoins
          <document-witnesses :editable="canEdit" :list="witnesses" />
           -->
          <section class="document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <div class="has-add-btn is-flex is-align-items-center is-justify-content-center">
                <span class="heading-content">Témoins</span>
              </div>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isWitnessOpen"
                aria-controls="witnessSection"
                @click="isWitnessOpen = !isWitnessOpen"
              >
                <i :class="isWitnessOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
              <!--<div class="slope-container">
                <span class="slope tier-1" />
                <span class="slope tier-2" />
                <span class="slope tier-3" />
                <span class="slope tier-4" />
              </div>-->
            </div>
            <b-collapse
              :class="!canEdit? '' : isWitnessOpen? '' : 'hiddendiv'"
              aria-id="witnessSection"
            >
              <template #default>
                <div class="document-section-content">
                  <witness-list
                    :editable="canEdit"
                    :open-modal="openWitnessModal"
                    @add-note="addNote"
                    @close-witness-modal="openWitnessModal = false"
                  />
                  <b-button
                    v-if="canEdit"
                    value="+"
                    class="open-modal-button "
                    @click="openWitnessModal = true"
                  >
                    <icon-add />
                  </b-button>
                </div>
              </template>
            </b-collapse>
          </section>

          <!-- collections -->
          <section class="document-section collections-document-section">
            <div class="heading is-uppercase is-flex is-justify-content-space-between">
              <span class="heading-content">Collections</span>
              <span
                v-if="canEdit"
                class="icon"
                :aria-expanded="isCollectionsOpen"
                aria-controls="collectionsSection"
                @click="isCollectionsOpen = !isCollectionsOpen"
              >
                <i :class="isCollectionsOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
              </span>
            </div>
            <b-collapse
              :class="!canEdit? '' : isCollectionsOpen? '' : 'hiddendiv'"
              aria-id="collectionsSection"
            >
              <template #default>
                <div class="document-section-content">
                  <document-collections :editable="canEdit" />
                </div>
              </template>
            </b-collapse>
          </section>

          <div
            v-if="current_user"
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
      </div>
    </div>

    <!-- preview mode -->
    <div v-else>
      <article
        v-if="document && !isLoading"
        class="document__content"
      >
        <!-- transcription -->
        <section class="document-section">
          <div class="document-section-content">
            <document-transcription
              :editable="canEdit"
              :preview="preview"
            />
          </div>
        </section>
        <!-- analyse -->
        <section class="document-section">
          <div class="heading is-uppercase">
            <span class="heading-content">Analyse</span>
          </div>
          <div class="document-section-content">
            <document-argument
              :editable="canEdit"
              :preview="preview"
            />
          </div>
        </section>
        <!-- témoins -->
        <section class="document-section">
          <div class="heading is-uppercase">
            <span class="heading-content ">Témoins</span>
          </div>
          <div class="document-section-content">
            <witness-list
              :editable="canEdit"
            />
          </div>
        </section>
        <!-- collections -->
        <section class="document-section collections-document-section">
          <div class="heading is-uppercase">
            <span class="heading-content">Collections</span>
          </div>
          <div class="document-section-content">
            <document-collections :editable="canEdit" />
          </div>
        </section>
      </article>
    </div>
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
      isTitleOpen: true,
      isPersonsOpen: true,
      isDatesOpen: true,
      isPlacesOpen: true,
      isAnalyseOpen: true,
      isTranscriptionOpen: true,
      isWitnessOpen: true,
      isCollectionsOpen: true,

      firstDocId: 0,
      lastDocId: 0,
      previousDocId: 0,
      nextDocId: 0,
      currentIndex: 0,
      docIdList: [],

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
    documentCssClass: function(){
      if (this.canEdit && !this.preview) {
        return 'can-edit';
      }
      return this.preview ? "is-preview" : "";
    },
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
      if (this.isLoading === false) {
        if (this.preview) {
          //console.log("canEdit false if preview", this.preview)
          return false;
        }
        /*
         * Can edit if 1) You are connected 2) There is no active lock or the active lock is yours
         * */
        if (!this.current_user || !this.jwt) {
          //console.log("canEdit false not connected", !this.current_user || !this.jwt)
          return false;
        }
        /* old rule
        if (this.current_user.isAdmin) {
          console.log("canEdit false not admin", this.current_user.isAdmin)
          return true;
        }*/
        if (!this.currentLock || this.currentLock.id === null) {
          //console.log("this.currentLock", this.currentLock)
          //console.log("this.currentLock.id", this.currentLock.id)
          //console.log("canEdit true because no lock", !this.currentLock || this.currentLock.id === null)
          return true
        }
        if (this.lockOwner && this.lockOwner[this.docId]) {
          return (
              (this.lockOwner[this.docId] &&
                  this.lockOwner[this.docId].id === this.current_user.id)
          )

          /*old rule outdated and not working (this.preview should be this.status ???)
          console.log("canEdit based on locks", (this.preview && this.currentLock.id === null) ||
          (this.lockOwner[this.docId] &&
            this.lockOwner[this.docId].id === this.current_user.id))
          return (
          (this.preview && this.preview.currentLock.id === null) ||
          (this.lockOwner[this.docId] &&
            this.lockOwner[this.docId].id === this.current_user.id))
        );*/
        }
        return false
      }
      return false
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
      this.firstDocId = await this.getDocumentsTotal().then(resp => {
        return resp.docIdList[resp.docIdList.length - 1].id
      });
      console.log('firstDocId : ', this.firstDocId);
      await this.getDocumentsTotal().then(resp => {
        this.docIdList = resp.docIdList;
        this.currentIndex = resp.docIdList.findIndex(doc => doc.id === this.docId);
        console.log("currentIndex", this.currentIndex);
        if (this.currentIndex < this.docIdList.length - 1 ) {
          this.previousDocId = this.docIdList[this.currentIndex + 1].id
        } else {
          this.previousDocId = this.firstDocId;
        }
        if (this.currentIndex > 0) {
          this.nextDocId = this.docIdList[this.currentIndex - 1].id;
        } else {
          this.nextDocId = this.lastDocId;
        }
        console.log("previousDocId", this.previousDocId); // give you the previous doc id
        console.log("nextDocId", this.nextDocId); // give you the next doc id
        return this.docIdList, this.previousDocId, this.nextDocId
      });
      console.log('docIdList : ', this.docIdList);

      await this.$store.dispatch("document/fetch", this.docId);
      this.setLastSeen(this.docId);
    } catch (e) {
      console.log("e : ", e)
      await this.$router.push({name: "home"});
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions("locks", ["fetchLockOwner"]),
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
      console.log("this.personInputData / this.isPersonWizardFormModalActive", this.personInputData, this.isPersonWizardFormModalActive)
    },
    unlinkPerson({ id, relationId, roleId }) {
      this.$store.dispatch("persons/unlinkFromDocument", {
        id,
        relationId,
        roleId,
      });
    },
    addNote(evt) {
      console.log("Document.vue / addNote : ", evt)
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
  margin-top: 30px;

  & > .columns {
    align-items: center;
    margin: 0 !important;

    .tags {
      padding: 0;
      margin: 0;
    }
  }

  & > .document__content {
    margin-bottom: 20px;
  }

  // Mode lecture
  &:not(.can-edit) {

    .document-section {
      margin-bottom: 60px;

      @include on-mobile {
        margin-bottom: 20px;
      }

      .heading span.icon {
        display: none !important;
      }

      // Cas particulier du Titre du document
      &.document-section-for-title {

        .heading {
          display: none !important;
        }

        & > .collapse {
          ::v-deep {
            .collapse-content {
              padding: 0;

              .column {
                padding: 10px 20px;

                @include on-tablet {
                  padding: 10px 0;
                }
              }

            }
          }
        }
      }

      & > .collapse {
        ::v-deep {
          .collapse-content {
            display: block !important;
            padding: 0 20px;

            @include on-mobile {
              padding: 0;
            }

            .panel-block {
              padding-left: 0;
              padding-right: 0;
            }
          }
        }
      }
    }
  }

  // Mode preview
  &.is-preview {
    margin-top: 0;

    & > .document__content {
      margin-top: 0;
      margin-bottom: 0;

      & > .document-section:first-child {
        margin-top: 0;
      }
    }

    .document-section-content {
      margin-top: 10px;
      margin-left: 0;
    }
  }

  // Mode édition
  &.can-edit {

    nav.previous-next-navigation {
      padding-bottom: 10px;
      border-bottom: #FDB3CC solid 1px;
      margin-bottom: 30px;
    }

    & > .document__content {
      margin-top: 20px;
    }

    & > .columns {
      display: flex !important;
    }

    .document-section {
      border: 1px solid #FF0052;
      border-radius: 5px;
      padding: 30px;
      margin-bottom: 30px;

      @include on-mobile {
        padding: 15px;
      }

      &.columns {
        margin: 30px 0 40px !important;
      }

      .column {
        @include on-mobile {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
      }

      & > .heading {

        span.icon {
          display: inline-block;
          cursor: pointer;
          width: 24px;
          height: 24px;
          background: url(../../assets/images/icons/open_text.svg) center / 24px auto no-repeat;
          order: 3;

          i {
            display: none;
          }

          &[aria-expanded=true] {
            background: url(../../assets/images/icons/close_text.svg) center / 18px auto no-repeat;
          }
        }

        span {
          font-size: 20px;

          @include on-tablet {
            font-size: $font-size-text-tablet;
          }

          @include on-mobile {
            font-size: $font-size-text-mobile;
          }

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

}

nav.previous-next-navigation {
  display: flex;
  gap: 12px;

  @include on-mobile {
    gap: 6px;
  }

  a.pagination-link {
    border: none;
    padding: 0 !important;
    margin: 0;
    min-width: unset !important;
    height: 30px;

    @include on-mobile {
      transform: scale(0.9,0.9);
    }

    &::after {
      content: "";
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url(../../assets/images/icons/lettre_nav_precedent.svg) center / 30px auto no-repeat !important;

      @include on-mobile {
      }
    }

    &.pagination-next,
    &.pagination-previous {
      flex-grow: 0;
    }

    &.pagination-next::after {
      transform: rotate(180deg);
      transform-origin:50% 50%;
    }

    .icon {
      display: none;
    }
  }
  router-link.pagination-link {
    border: none;
    padding: 0 !important;
    margin: 0;
    min-width: unset !important;
    height: 30px;

    @include on-mobile {
      transform: scale(0.9,0.9);
    }

    &::after {
      content: "";
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url(../../assets/images/icons/lettre_nav_precedent.svg) center / 30px auto no-repeat !important;

      @include on-mobile {
      }
    }

    &.pagination-next,
    &.pagination-previous {
      flex-grow: 0;
    }

    &.pagination-next::after {
      transform: rotate(180deg);
      transform-origin:50% 50%;
    }

    .icon {
      display: none;
    }
  }
}

.document-tag-bar {
  display: flex !important;
  gap: 50px;

  @include on-mobile {
    gap: 20px;
  }

}

.document-section {
  flex-direction: column;
  align-items: flex-start;

  font-family: $family-primary;
  font-size: 20px;
  line-height: 1.2;

  @include on-tablet {
    font-size: $font-size-text-tablet;
  }

  @include on-mobile {
    font-size: $font-size-text-mobile;
  }

  // Section : Titre du document et langues
  &.columns {
    margin: 20px 0 50px;

    .column {
      padding: 0 !important;
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

    @include on-mobile {
      margin-bottom: 10px;
      font-size: 13px;
    }

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

  & .document-section-content {
    margin-left: 60px;
    margin-bottom: 40px;

    @include on-tablet {
      margin-left: 20px;
      margin-bottom: 20px;
    }

    @include on-mobile {
      margin-left: 0;
      margin-bottom: 0;
    }

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

        @include on-mobile {
          font-size: 13px;
        }
      }

      .control {
        font-size: 18px;

        @include on-mobile {
          font-size: $font-size-text-mobile;
        }
      }

      .panel {
        -webkit-box-shadow: none;
        box-shadow: none;

        font-size: 16px;
        font-family: $family-primary;

        .panel-block {
          border: none;
          padding: 0;
          margin-bottom: 20px;

          & > .argument__content,
          & > :nth-child(2) {
            font-size: 20px;
            color: #585858;
            font-weight: 400;
            letter-spacing: 0;

            @include on-tablet {
              font-size: $font-size-text-tablet;
            }

            @include on-mobile {
              font-size: $font-size-text-mobile;
            }
          }
        }
      }

      .tag {
        background: none;
        padding: 0;
        margin:0;

        .breadcrumb.is-small {
          font-size: 20px;
          font-weight: 400;

          @include on-tablet {
            font-size: $font-size-text-tablet;
          }

          @include on-mobile {
            font-size: $font-size-text-mobile;
          }

          a {
            color: #000000;

            &:hover {
              color: #C00055;
              text-decoration: underline;
            }
          }
        }
      }

      span.tag {
        margin: 5px 10px 10px 0;
        white-space: break-spaces;
      }

    }

  }

  &.collections-document-section {

    ::v-deep {

      .document-section-content {

        .tags.has-addons {

          span.tag {
            display: inline-flex;
            max-width: 80%;

            nav > ul {
              line-height: 1.25;
            }
          }

          tag.is-delete {
            display: inline-flex;
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

.has-add-btn.is-flex {
  gap: 5px;
}

.button.open-modal-button {
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
.hiddendiv {
  display: none;
}
</style>
