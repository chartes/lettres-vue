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
                @manage-place-data="managePlaceData"
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
                @manage-place-data="managePlaceData"
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
import { mapState, mapGetters } from "vuex";

import SelectOrCreatePlaceForm from "@/components/forms/place/SelectOrCreatePlaceForm.vue";
import PlaceInfoCard from "@/components/forms/place/PlaceInfoCard.vue";
import FunctionPlaceForm from "@/components/forms/place/FunctionPlaceForm.vue";

export default {
  name: "PlaceWizardForm",
  components: {
    SelectOrCreatePlaceForm,
    PlaceInfoCard,
    FunctionPlaceForm,
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
      place: {},
      loading: false,
      initLoading: true,
      unlink: false
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapGetters("placenames", ["getRoleByLabel"]),

    wizardLabel() {
      return "Date de lieu";
    },
    currentStep() {
      if (!this.initLoading) {
        return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
      } else {
        return ''
      }
    },
    stepItems() {
      if (this.place.id && !this.initLoading) {
        console.log("with id");
        return [
          {
            name: "select-or-create",
            next: this.place && this.place.label ? "set-description" : null,
            left: {
              label: "left",
              component: "PlaceInfoCard",
              attributes: {place: this.place},
            },
            center: {
              label: "center",
              component: "SelectOrCreatePlaceForm",
              attributes: {place: this.place, popupMode: this.popupMode},
            },
            footer: {
              buttons: this.unlink ? [{label: "Supprimer", type: "is-primary", action: this.unlinkPlace}] : null,
            }
          },
          {
            name: "set-description",
            prev: "select-or-create",
            left: {
              label: "left",
              component: "PlaceInfoCard",
              attributes: {place: this.place},
            },
            center: {
              label: "center",
              component: "FunctionPlaceForm",
              attributes: {place: this.place},
            },
            footer: {
              buttons: [{label: "Terminer", type: "is-primary", action: this.savePlace}],
            },
          },
        ]
      } else if (!this.initLoading) {
        console.log("without id ?")
        return [
          {
            name: "select-or-create",
            next: this.place && this.place.label ? "set-description" : null,
            left: {
              label: "left",
              component: "PlaceInfoCard",
              attributes: {place: this.place},
            },
            center: {
              label: "center",
              component: "SelectOrCreatePlaceForm",
              attributes: {place: this.place, popupMode: this.popupMode},
            },
          },
          {
            name: "set-description",
            prev: "select-or-create",
            left: {
              label: "left",
              component: "PlaceInfoCard",
              attributes: {place: this.place},
            },
            center: {
              label: "center",
              component: "FunctionPlaceForm",
              attributes: {place: this.place},
            },
            footer: {
              buttons: [{label: "Terminer", type: "is-primary", action: this.savePlace}],
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
    await this.$store.dispatch("placenames/fetchAllPlacenames");
    await this.$store.dispatch("placenames/fetchRoles");
    let place = {};

    if (this.$props.inputData) {
      console.log('created this.$props.inputData', this.$props.inputData)
      const p = this.$props.inputData;
      // if existing Place annotation, (inputData) p.formats.location is a dict, checking location.id which has to be used
      // if new Place annotation, use (inputData) p.formats.location directly
      const id = p.formats && p.formats.location ? p.formats.location.id ? p.formats.location.id : p.formats.location : null;

      if (p.label !== null) {
        place.label = p.label;
      }
      if (p.selection !== null) {
        place.selection = p.selection;
      }
      if (p.description !== null) {
        place.description = p.description;
      }
      if (p.coords !== null) {
        place.coords = p.coords;
      }
      if (p.ref !== null) {
        place.ref = p.ref;
      }
      if (p.role !== null) {
        place.role = p.role;
      }
      if (p.restoreRangeCallback !== null) {
        place.restoreRangeCallback = p.restoreRangeCallback;
      }
      if (p.insertTagCallback !== null) {
        place.insertTagCallback = p.insertTagCallback;
      }
      if (p.removeTagCallback !== null) {
        place.removeTagCallback = p.removeTagCallback;
      }

      if (id !== null) {
        place.id = id;
        this.unlink = true;

        //load existing data
        const item = await this.$store.dispatch(
          "placenames/getInlinedPlacenameWithRoleById",
          { docId: this.document.id, placeId: place.id }
        );

        place = {
          ...place,
          ...item.place,
          ...item.phr,
          description: item.phr.function,
          phrId: item.phrId,
        };
        console.log("ITEM", place);
      }
    }

    this.place = place;
    this.initLoading = false;
  },
  mounted() {
    this.$store.dispatch("placenames/setPageSize", 5);
  },
  methods: {
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
    managePlaceData({ action, data }) {
      console.log(`place[${action.name}]`, data);
      switch (action.name) {
        case "set-place":
          if (this.popupMode) {
            this.place = {
              role: this.place.role,
              source: this.place.source,
              restoreRangeCallback: this.place.restoreRangeCallback,
              insertTagCallback: this.place.insertTagCallback,
              removeTagCallback: this.place.removeTagCallback,
            };
          }
          this.place = {
            ...this.place,
            ...data,
          };
          break;
        case "set-description":
          this.place.description = data;
          break;
        default:
          break;
      }
      this.place = { ...this.place };
    },
    closeWizard() {
      if (this.place && this.place.restoreRangeCallback) {
        this.place.restoreRangeCallback();
      }

      this.loading = false;
      this.unlink = false;
      if (this.$parent.close) {
        this.$parent.close();
      }
    },
    async savePlace() {
      this.loading = true;
      if (this.place) {
        let placeToSave = {
          long: null,
          lat: null,
          ref: this.place.ref,
          label: this.place.label,
        };

        if (this.place.coords) {
          placeToSave.long = this.place.coords[0];
          placeToSave.lat = this.place.coords[1];
        }

        if (this.place.id) {
          placeToSave.id = this.place.id;
        } else {
          const response = await this.$store.dispatch("placenames/addPlace", placeToSave);
          placeToSave.id = response.id;
        }

        // when editing a document
        if (this.popupMode) {
          console.log(this.place);
          if (this.place.role && placeToSave.id) {
            // link the place to the document
            const role = this.getRoleByLabel(this.place.role);
            const roleId = role && role.id ? role.id : null;

            await this.$store.dispatch("placenames/linkToDocument", {
              placenameId: placeToSave.id,
              roleId,
              func: this.place.description,
              phrId: this.place.phrId,
            });

            // and then insert the tag in the content
            if (this.place.restoreRangeCallback) {
              this.place.restoreRangeCallback();
              console.log('placeToSave : ', placeToSave)
              this.place.insertTagCallback(placeToSave); // LocationBlot data source (Location.js)
            }

            // if not inlined, refresh the places
            if (!this.place.role !== "inlined") {
              await this.$store.dispatch("document/fetch", this.document.id);
            }
          }
        }
      }
      this.closeWizard();
    },
    async unlinkPlace() {
      this.loading = true;
      if (this.place) {
        let placeToUnlink = {
          long: null,
          lat: null,
          ref: this.place.ref,
          label: this.place.label,
          id: this.place.id
        };

        if (this.place.coords) {
          placeToUnlink.long = this.place.coords[0];
          placeToUnlink.lat = this.place.coords[1];
        }

        // when editing a document
        if (this.popupMode) {
          console.log("when editing a document : ", this.place);
          if (this.place.role && placeToUnlink.id) {
            // unlink the place to the document
            const role = this.getRoleByLabel(this.place.role);
            const roleId = role && role.id ? role.id : null;

            /*await this.$store.dispatch("placenames/unlinkFromDocument", {
              relationId: this.place.phrId,
              personId: this.place.id,
              roleId: roleId
            });*/

            // and then remove the tag in the content
            //  if (this.place.restoreRangeCallback) {
            //    this.place.restoreRangeCallback();
            //    console.log('placeToUnlink : ', placeToUnlink)
            //    this.place.removeTagCallback(placeToUnlink.id);
            //  }

            this.place.removeTagCallback(placeToUnlink);
            console.log('this.place : ', this.place);

            // if not inlined, refresh the places
            //if (!this.place.role !== "inlined") {
            //  await this.$store.dispatch("document/fetch", this.document.id);
            //}
          }
        }
      }
      this.closeWizard();
    },
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
  padding: 30px 60px !important;
  min-height: 720px;
  height: inherit;
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
    .place-wizard-center-form .expanded-select  {
      max-height: 180px !important;

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
  }

  .popup-mode {
    margin: auto;
    grid-template-columns: auto 320px;
    grid-template-rows: 62px auto 80px;
    grid-template-areas:
      "leftbar-header leftbar-header"
      "center-content leftbar-content"
      "leftbar-footer nav-footer";

    @include on-tablet {
      margin: 0;
      grid-template-columns: 100%;
      grid-template-rows: 62px auto min(100px) 80px;
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
  }

  .leftbar-content-area,
  .nav-footer-area {
    background-color: #7F0038 !important;
    margin-left: 10px;

    @include on-tablet {
      margin-left: 0;
    }
  }

  .leftbar-content-area {
    grid-area: leftbar-content;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    @include on-tablet {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .b-tabs {
      ::v-deep {

        .tab-content {
          background-color: #CB2158;
          color: #FFF;

          .heading {
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
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

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

          .create-place-form {
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
    grid-area: nav-footer;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    position: relative;

    .buttons {
      position: absolute;
      bottom: 60px;

      display: flex;
      justify-content: center;
      align-items: center;

      @include on-tablet {
        bottom: 20px;
        width: 100%;
        padding: 0 20px;
        justify-content: flex-end;
      }

      button {
        width: 140px;
        margin: 10px !important;
        background-color: #CB2158;

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
