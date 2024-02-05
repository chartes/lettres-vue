<template>
  <div
    v-if="!initLoading"
    class="root-container"
    :class="popupMode ? 'box modal-card' : ''"
  >
    <div
      class="root-grid-container"
      :class="popupMode ? 'popup-mode' : ''"
    >
      <div
        v-if="popupMode"
        class="leftbar-header-area"
      >
        <h1 class="step-label">
          {{ wizardLabel }}
        </h1>
        <h2
          v-if="subtitle"
          class="step-label"
        >
          {{ subtitle }}
        </h2>
        <h2
          v-if="currentStep.label"
          class="step-label is-uppercase is-size-5"
        >
          {{ currentStep.label }}
        </h2>
      </div>
      <div class="center-content-area">
        <b-tabs v-model="activeTab">
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`center-step-${i}`"
            :label="stepItem.center ? stepItem.center.label : `center-step-${i}`"
          >
            <keep-alive v-if="stepItem.center">
              <component
                :is="stepItem.center.component"
                v-bind="stepItem.center.attributes"
                @goto-wizard-step="gotoStep"
                @manage-person-data="managePersonData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div
        v-if="popupMode"
        class="leftbar-content-area"
      >
        <b-tabs
          v-model="activeTab"
          :animated="false"
        >
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`left-step-${i}`"
            :label="stepItem.left ? stepItem.left.label : `left-step-${i}`"
          >
            <keep-alive v-if="stepItem.left">
              <component
                :is="stepItem.left.component"
                v-bind="stepItem.left.attributes"
                @goto-wizard-step="gotoStep"
                @manage-person-data="managePersonData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>

      <div
        v-if="popupMode"
        class="leftbar-footer-area"
      />
      <div
        v-if="popupMode"
        class="nav-footer-area"
      >
        <div class="buttons">
          <b-button
            type="is-primary"
            size="is-medium"
            @click="closeWizard"
          >
            Annuler
          </b-button>

          <b-button
            v-if="currentStep.prev"
            type="is-primary"
            size="is-medium"
            class="previous-button"
            @click="gotoPrevStep"
          >
            Précédent
          </b-button>

          <b-button
            :disabled="!currentStep.next"
            type="is-primary"
            size="is-medium"
            class="next-button"
            @click="gotoNextStep"
          >
            <span>Suivant</span>
          </b-button>

          <span
            v-for="(stepItem, i) in stepItems"
            :key="`footer-buttons-step-${i}`"
          >
            <span v-if="stepItem.footer && activeTab === i">
              <b-button
                v-for="(button, j) in stepItem.footer.buttons"
                :key="`button-${j}`"
                :type="button.type ? button.type : 'is-primary'"
                :disabled="button.disabled"
                size="is-medium"
                :loading="loading"
                @click="button.action()"
              >
                {{ button.label }}
              </b-button>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex";

import SelectOrCreatePersonForm from "@/components/forms/person/SelectOrCreatePersonForm.vue";
import PersonInfoCard from "@/components/forms/person/PersonInfoCard.vue";
import FunctionPersonForm from "@/components/forms/person/FunctionPersonForm.vue";

export default {
  name: "PersonWizardForm",
  components: {
    SelectOrCreatePersonForm,
    PersonInfoCard,
    FunctionPersonForm,
  },
  props: {
    subtitle: { type: String, default: null },
    popupMode: { type: Boolean, default: true },
    inputData: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      activeTab: 0,
      person: {},
      loading: false,
      initLoading: true,
      unlink: false
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapGetters("persons", ["getRoleByLabel"]),

    wizardLabel() {
      return "Correspondants";
    },
    currentStep() {
      if (!this.initLoading) {
        return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
      } else {
        return ''
      }
    },
    stepItems() {
      if (this.person.id && !this.initLoading) {
        console.log("with id")
        return [
          {
            name: "select-or-create",
            next: this.person && this.person.label ? "set-description" : null,
            left: {
              label: "left",
              component: "PersonInfoCard",
              attributes: {person: this.person},
            },
            center: {
              label: "center",
              component: "SelectOrCreatePersonForm",
              attributes: {person: this.person, popupMode: this.popupMode},
            },
            footer: {
              buttons: this.unlink ? [{label: "Supprimer", type: "is-primary", action: this.unlinkPerson}] : null,
            },
          },
          {
            name: "set-description",
            prev: "select-or-create",
            left: {
              label: "left",
              component: "PersonInfoCard",
              attributes: {person: this.person},
            },
            center: {
              label: "center",
              component: "FunctionPersonForm",
              attributes: {person: this.person},
            },
            footer: {
              buttons: [{label: "Terminer", type: "is-primary", action: this.savePerson}],
            },
          },
        ]
      } else if (!this.initLoading) {
        console.log("without id ?")
        return [
          {
            name: "select-or-create",
            next: this.person && this.person.label ? "set-description" : null,
            left: {
              label: "left",
              component: "PersonInfoCard",
              attributes: {person: this.person},
            },
            center: {
              label: "center",
              component: "SelectOrCreatePersonForm",
              attributes: {person: this.person, popupMode: this.popupMode},
            },
          },
          {
            name: "set-description",
            prev: "select-or-create",
            left: {
              label: "left",
              component: "PersonInfoCard",
              attributes: {person: this.person},
            },
            center: {
              label: "center",
              component: "FunctionPersonForm",
              attributes: {person: this.person},
            },
            footer: {
              buttons: this.person.label
                  ? [{label: "Terminer", type: "is-primary", action: this.savePerson}]
                  : [{label: "Terminer", type: "is-primary", disabled: true}],
            },
          },
        ]
      } else {
        return ''
      }

    },
  },
  async created() {
    this.initLoading = true;
    await this.$store.dispatch("persons/fetchAllPersons");
    await this.$store.dispatch("persons/fetchRoles");
    let person = {};

    if (this.$props.inputData) {
      console.log('created this.$props.inputData', this.$props.inputData)
      const p = this.$props.inputData;
      // if existing Person annotation, (inputData) p.formats.person is a dict, checking person.id which has to be used
      // if new Person annotation, use (inputData) p.formats.person directly
      const id = p.formats && p.formats.person ? p.formats.person.id ? p.formats.person.id : p.formats.person : null;

      if (p.label !== null) {
        person.label = p.label;
      }
      if (p.selection !== null) {
        person.selection = p.selection;
      }
      if (p.description !== null) {
        person.description = p.description;
      }
      if (p.ref !== null) {
        person.ref = p.ref;
      }
      if (p.role !== null) {
        person.role = p.role;
      }
      if (p.restoreRangeCallback !== null) {
        person.restoreRangeCallback = p.restoreRangeCallback;
      }
      if (p.insertTagCallback !== null) {
        person.insertTagCallback = p.insertTagCallback;
      }
      if (p.removeTagCallback !== null) {
        person.removeTagCallback = p.removeTagCallback;
      }

      if (id !== null) {
        person.id = id;
        this.unlink = true;

        //load existing data
        const item = await this.$store.dispatch(
            "persons/getInlinedPersonsWithRoleById",
            { docId: this.document.id, personId: person.id });
        if (item) {
          person = {
            ...person,
            ...item.person,
            ...item.phr,
            description: item.phr.function,
            phrId: item.phrId,
          };
          console.log("Person in Transcription exists in DB : ", person);
        } else {
          console.log("Person in Transcription does not exists in DB : ", person);
        }
      }
    }

    this.person = person;
    this.initLoading = false;
  },
  async mounted() {
    await this.$store.dispatch("persons/setPageSize", 5);
    await this.search("");
  },
  methods: {
  ...mapActions("persons", ["search"]),

    gotoStep(stepName) {
      const nextStepIndex = this.stepItems.findIndex((s) => s.name === stepName);
      if (nextStepIndex > -1) {
        this.activeTab = nextStepIndex;
      }
    },
    gotoNextStep() {
      const nextStep = this.stepItems[this.activeTab].next;
      if (nextStep) {
        this.gotoStep(nextStep);
      }
    },
    gotoPrevStep() {
      const prevStep = this.stepItems[this.activeTab].prev;
      if (prevStep) {
        this.gotoStep(prevStep);
      }
    },
    managePersonData({ action, data }) {
      console.log(`person[${action.name}]`, data);
      switch (action.name) {
        case "set-person":
          if (this.popupMode) {
            this.person = {
              role: this.person.role,
              source: this.person.source,
              restoreRangeCallback: this.person.restoreRangeCallback,
              insertTagCallback: this.person.insertTagCallback,
              removeTagCallback: this.person.removeTagCallback,
            };
          }
          this.person = {
            ...this.person,
            ...data,
          };
          break;
        case "set-description":
          if (data.label || data.label === '') {
            this.person.label = data.label;
          }
          if (data.description || data.description === '' || data.description === null) {
            this.person.description = data.description === '' ? null : data.description;
          }
          break;
        default:
          break;
      }
      this.person = { ...this.person };
    },
    closeWizard() {
      if (this.person && this.person.restoreRangeCallback) {
        this.person.restoreRangeCallback();
      }

      this.loading = false;
      this.unlink = false;
      if (this.$parent.close) {
        this.$parent.close();
      }
    },
    async savePerson() {
      this.loading = true;
      if (this.person) {
        let personToSave = {
          ref: this.person.ref,
          label: this.person.label,
        };

        if (this.person.id) {
          personToSave.id = this.person.id;
        } else {
          const response = await this.$store.dispatch("persons/addPerson", personToSave);
          personToSave.id = response.id;
        }

        // when editing a document
        if (this.popupMode) {
          console.log("when editing a document : ", this.person);
          if (this.person.role && personToSave.id) {
            // link the person to the document
            const role = this.getRoleByLabel(this.person.role);
            const roleId = role && role.id ? role.id : null;

            await this.$store.dispatch("persons/linkToDocument", {
              label: personToSave.label,
              personId: personToSave.id,
              roleId: roleId,
              func: this.person.description,
              phrId: this.person.phrId,
            });

            // and then insert the tag in the content
            if (this.person.restoreRangeCallback) {
              this.person.restoreRangeCallback();
              console.log('personToSave : ', personToSave)
              this.person.insertTagCallback(personToSave); // PersonBlot data source (Person.js)
            }

            // if not inlined, refresh the persons
            if (this.person.role !== "inlined") {
              await this.$store.dispatch("document/fetch", this.document.id);
            }
          }
        }
      }
      this.closeWizard();
    },
    async unlinkPerson() {
      this.loading = true;
      if (this.person) {
        let personToUnlink = {
          ref: this.person.ref,
          label: this.person.label,
          id: this.person.id
        };

        // when editing a document
        if (this.popupMode) {
          console.log("when editing a document : ", this.person);
          if (this.person.role && personToUnlink.id) {
            // unlink the person to the document
            const role = this.getRoleByLabel(this.person.role);
            const roleId = role && role.id ? role.id : null;

            /*await this.$store.dispatch("persons/unlinkFromDocument", {
              relationId: this.person.phrId,
              personId: this.person.id,
              roleId: roleId
            });*/

            // and then remove the tag in the content
            //if (this.person.restoreRangeCallback) {
            //  this.person.restoreRangeCallback();
            //  console.log('personToUnlink : ', personToUnlink)
            //  this.person.removeTagCallback(personToUnlink);
            //}

            this.person.removeTagCallback(personToUnlink);
            console.log('this.person : ', this.person);

            // if not inlined, refresh the persons
            //if (!this.person.role !== "inlined") {
            //  await this.$store.dispatch("document/fetch", this.document.id);
            //}
          }
        }
      }
      this.closeWizard();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

.root-container {
  overflow: hidden;
  width: 100% !important;
  height: 100% !important;
  padding: 30px 60px !important;
  margin-bottom: 0 !important;
  min-height: 720px;
  background: transparent !important;

  @include on-tablet {
    padding: 0 !important;
  }

  &.modal-card {
    margin: 0 !important;
    padding: 30px 40px !important;
    min-height: 100vh !important;
    overflow-y: auto !important;

    @include on-tablet {
      width: 100% !important;
      padding: 20px 20px !important;
      min-height: auto;
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    @include on-mobile {
      padding: 10px 10px !important;
    }
  }

  .label {
    color: inherit !important;
  }

  .step-label {
    font-family: $bitter-family;
    padding: 12px;
  }

  .wizard-center-form {
    margin-left: 12px;
    margin-right: 12px;
    min-width: 300px;

    ::v-deep {
      .table tr.is-selected,
      .expanded-select dt.expanded-selection {
        background-color: #CB2158;
      }

      .table tr.is-selected > * {
        color: #FFF;
      }
    }
  }

  ::v-deep {
    .person-wizard-center-form .expanded-select  {
      max-height: 175px !important;

      & dt.expanded-selection {
        background-color: #CB2158;
      }
    }
  }

  .previous-button {
    margin-left: 40px;
  }

  /* Grid */
  .root-grid-container {
    display: grid;
    min-height: unset;
    height: 100%;
    background: none;

    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "center-content";

    @include on-tablet {
      width: 100% !important;
      height: 100% !important;
      min-height: auto;
    }

    @include on-mobile {
      width: 100% !important;
      height: 100% !important;
      padding-top: 0px;
    }
  }

  .popup-mode {
    margin: 0;
    grid-template-columns: 7fr 3fr;
    grid-template-rows: 1fr 2fr 8fr;
    grid-template-areas:
      "leftbar-header leftbar-header"
      "center-content leftbar-content"
      "center-content nav-footer";

    @include on-tablet {
      margin: 0;
      grid-template-columns: 7fr 3fr;
      grid-template-rows: 62px auto auto auto;
      grid-template-areas:
      "leftbar-header"
      "center-content"
      "leftbar-content"
      "nav-footer";
    }
    @include on-mobile {
      margin: 0;
      grid-template-columns: 100%;
      grid-template-rows: 62px auto auto auto;
      grid-template-areas:
      "leftbar-header"
      "center-content"
      "leftbar-content"
      "nav-footer";
    }
  }

  .leftbar-header-area {
    grid-area: leftbar-header;
  }

  .leftbar-header-area {
    display: flex;
    align-items: center;

    background-color: #CB2158;
    border: none;
    border-radius: 5px;
    padding: 3px 20px;
    margin-bottom: 10px;

    h1 {
      padding: 0;
      font-family: $family-apptitle;
      font-size: 30px;
      color: #FFFFFF;
      font-weight: 200;
      letter-spacing: 0;

      @include on-tablet {
        font-size: $font-size-title-mobile;
      }
    }

    h2 {
      padding-top: 0;
      top: -12px;
      position: relative;
      left: 0;
    }
  }

  .leftbar-content-area,
  .nav-footer-area {
    background-color: #7F0038 !important;
    margin-left: 10px;

    @include on-tablet {
      margin-left: 0;
      border-radius: 5px;
    }
    @include on-mobile {
      margin-left: 0;
      border-radius: 5px;
    }
  }

  .leftbar-content-area {
    grid-area: leftbar-content;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    @include on-tablet {
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
    }

    @include on-mobile {
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
    }

    .b-tabs {
      height: 100%;
      ::v-deep {
        .tab-content {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          background-color: #CB2158;
          color: #FFF;

          @include on-tablet {
            height: 100%;
            border-radius: 5px;
          }
          @include on-mobile {
            height: 100%;
            border-radius: 5px;
          }

          .heading {
            letter-spacing: 0px !important;
            text-transform: none !important;
          }

          .labels {
            padding: 0;
            border: none;

            .is-size-5 {
              font-size: 16px !important;
            }
          }

        }
      }
    }

  }

  .leftbar-footer-area {
    grid-area: leftbar-footer;
    background-color: #FFFFFF;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @include on-tablet {
      display: none;
    }
    @include on-mobile {
      display: none;
    }

    .buttons {
      margin-right: 20px;

      float: right;
      top: calc(50% - 26px);
      position: relative;
    }
  }

  .center-content-area {
    grid-area: center-content;
    height: 100%;
    background-color: #FFFFFF;
    border-radius: 5px;

    & > .b-tabs {
      height: 100%;

      ::v-deep {
        .tabs li > a {
          font-family: $family-primary;
          font-size: 18px;
          color: #7F0038;
          font-weight: 500;
          text-transform: uppercase;

          @include on-tablet {
            padding: 5px 8px 5px 5px;
            font-size: 13px;
          }

          @include on-small-mobile {
            font-size: 11px;
          }
        }

        .tab-content {
          padding: 10px 0;
          @include on-mobile {
            padding: 0px;
          }
        }

        .tab-content,
        .tab-item {
          height: 100%;
        }

        .tag:not(body) {
          white-space: break-spaces;
          line-height: 1.2;
          height: auto;
          padding: 6px;
        }

        .create-person-form {
          max-height: 560px;
          overflow: auto;
          padding-right: 10px;
          width: calc( 100% + 15px );

          // Firefox //
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 155, 155, 0.2) transparent;

          /// Webkit //
          ::-webkit-scrollbar {
            width: 9px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgba(155, 155, 155, 0.2);
            border-radius: 20px;
            border: transparent;
          }

          .person-table {
            border-top: #CB2158 8px solid;
          }

          .table-wrapper {
            border-top: none !important;
            padding-right: 5px;

            table.table {
              overflow: hidden;
            }
          }

          .expanded-select {
            border: 1px #c5c5c5 solid;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        }


        @include on-mobile {
          .searchbox-container {
            width: 100%;
          }

          .term-search {
            width: 100%;
            margin-right: 0 !important;

            .field.has-addons {
              width: 100%;
              margin-right: 0 !important;

              .control:not(:last-child) {
                flex: calc(100% - 64px) 0 0;
              }
            }
          }

          .create-person-form {
            .control.has-icons-right {
              .icon.is-right {
                top: 0 !important;
                line-height: 1;
                padding: 0;
              }
            }
          }
        }

      }
    }
  }

  .nav-footer-area {
    height: 100%;
    grid-area: nav-footer;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    //position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    vertical-align: bottom;
    padding-bottom: 10px;

    @include on-tablet {
      border-radius: 5px;
    }
    @include on-mobile {
      border-radius: 5px;
    }

    .buttons {
      //position: absolute;
      //bottom: 40px;

      display: flex;
      @include desktop {
        flex-direction: column;
      }
      justify-content: center;
      align-items: flex-end;

      @include on-tablet {
        //bottom: 20px;
        width: 100%;
        padding: 0 20px;
        justify-content: flex-end;
      }

      button {
        width: 140px;
        margin: 7px 10px !important;
        background-color: #CB2158;

        &.is-medium {
          font-size: 16px;
        }

        @include on-tablet {
          font-size: 14px;

          &.button {
            width: auto;
            margin: 10px 3px !important;
          }

          &.previous-button,
          &.next-button {
            text-indent: -9999px;
            width: 50px;
            padding: 0 5px;
          }

          &.previous-button:after,
          &.next-button:after {
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(#{$image-path}/icons/suivant.svg) center right / 16px auto no-repeat;
            transform-origin: 50% 50%;
          }

          &.previous-button:after {
            transform: rotate(-180deg);
          }
        }
      }

      span:empty {
        display: none;
      }
    }
  }
}

.root-container::v-deep .b-tabs .tabs:first-of-type {
  display: none;
}
</style>
