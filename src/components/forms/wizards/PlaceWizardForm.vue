<template>
  <div
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
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapGetters("placenames", ["getRoleByLabel"]),

    wizardLabel() {
      return "Date de lieu";
    },
    currentStep() {
      return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
    },
    stepItems() {
      return [
        {
          name: "select-or-create",
          next: this.place && this.place.label ? "set-description" : null,
          left: {
            label: "left",
            component: "PlaceInfoCard",
            attributes: { place: this.place },
          },
          center: {
            label: "center",
            component: "SelectOrCreatePlaceForm",
            attributes: { place: this.place, popupMode: this.popupMode },
          },
        },
        {
          name: "set-description",
          prev: "select-or-create",
          left: {
            label: "left",
            component: "PlaceInfoCard",
            attributes: { place: this.place },
          },
          center: {
            label: "center",
            component: "FunctionPlaceForm",
            attributes: { place: this.place },
          },
          footer: {
            buttons: [{ label: "Terminer", type: "is-primary", action: this.savePlace }],
          },
        },
      ];
    },
  },
  async created() {
    await this.$store.dispatch("placenames/fetchAllPlacenames");
    await this.$store.dispatch("placenames/fetchRoles");
    let place = {};

    if (this.$props.inputData) {
      const p = this.$props.inputData;
      const id = p.formats && p.formats.location ? p.formats.location : null;

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
      }
    }

    this.place = place;
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
              this.place.insertTagCallback(placeToSave.id);
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

.root-container {
  overflow: hidden;
  width: 1024px !important;
  min-height: 720px;
  height: inherit;
  padding: 0 !important;
  background: transparent !important;

  &.modal-card {
    @include on-tablet {
      width: 100% !important;
      min-width: 100% !important;
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

  .previous-button {
    margin-left: 40px;
  }

  /*  Grid */
  .root-grid-container {
    display: grid;
    min-height: inherit;
    height: 100%;
    background: none;

    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "center-content";
  }

  .popup-mode {
    grid-template-columns: auto 320px ;
    grid-template-rows: 62px auto 80px;
    grid-template-areas:
      "leftbar-header leftbar-header"
      "center-content leftbar-content"
      "leftbar-footer nav-footer";

    @include on-tablet {
      grid-template-columns: auto;
      grid-template-rows: 62px auto auto 80px;
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
        font-size: $font-size-title-tablet;
      }

      @include on-mobile {
        font-size: $font-size-title-mobile;
      }
    }
  }

  .leftbar-content-area,
  .nav-footer-area {
    background-color: #7F0038 !important;
    margin-left: 10px;
  }

  .leftbar-content-area {
    grid-area: leftbar-content;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .b-tabs {
      ::v-deep {

        .tab-content {
          background-color: #CB2158;
          color: #FFF;

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
        }
      }

      .tab-content {
        padding: 0;
      }

      .tab-content,
      .tab-item {
        height: 100%;
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
      bottom: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      button {
        width: 140px;
        margin: 10px !important;
        background-color: #CB2158;
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
