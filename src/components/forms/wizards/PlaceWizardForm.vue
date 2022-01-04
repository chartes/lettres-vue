<template>
  <div class="root-container" :class="popupMode ? 'box modal-card' : ''">
    <div class="root-grid-container" :class="popupMode ? 'popup-mode' : ''">
      <div v-if="popupMode" class="leftbar-header-area">
        <h1 class="step-label is-uppercase is-size-2">
          {{ wizardLabel }}
        </h1>
        <h2 v-if="subtitle" class="step-label is-uppercase is-size-5 mb-3">
          {{ subtitle }}
        </h2>
        <h2 v-if="currentStep.label" class="step-label is-uppercase is-size-5">
          {{ currentStep.label }}
        </h2>
      </div>
      <div v-if="popupMode" class="leftbar-content-area">
        <b-tabs v-model="activeTab" :animated="false">
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
      <div v-if="popupMode" class="leftbar-footer-area" />

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
      <div v-if="popupMode" class="center-footer-area">
        <div class="buttons">
          <b-button type="is-primary" size="is-medium" @click="closeWizard">
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

          <span v-for="(stepItem, i) in stepItems" :key="`footer-buttons-step-${i}`">
            <span v-if="stepItem.footer && activeTab === i">
              <b-button
                v-for="(button, j) in stepItem.footer.buttons"
                :key="`button-${j}`"
                :type="button.type ? button.type : 'is-primary'"
                size="is-medium"
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
      place: null,
      collectedPages: [],
    };
  },
  computed: {
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
          next: this.place ? "set-description" : null,
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
    if (this.$props.inputData) {
      const p = this.$props.inputData;
      const id = p.formats ? p.formats.location : null;
      let place = {};

      if (id !== null) {
        place.id = id;
      }
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

      this.place = place;
    }
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
          this.place = data;
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
      if (this.$parent.close) {
        this.$parent.close();
      }
    },
    async savePlace() {
      if (this.place) {
        let long = null;
        let lat = null;
        if (this.place.coords) {
          long = this.place.coords[0];
          lat = this.place.coords[1];
        }
        // TODO sauvegarder le place
        //const response = await this.$store.dispatch("placenames/addOne", this.place);

        console.log("save place:", this.place);
      }
      this.closeWizard();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.root-container {
  overflow: hidden;

  min-height: 720px;
  min-width: 960px;

  width: 100%;
  height: inherit;

  padding: 0px !important;

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
  }

  .previous-button {
    margin-left: 40px;
  }

  .leftbar-header-area,
  .leftbar-content-area,
  .leftbar-footer-area {
    background-color: $light !important;
  }

  .leftbar-header-area {
    grid-area: leftbar-header;
    h1 {
      padding-bottom: 0px;
    }
    h2 {
      padding-top: 0px;
      top: -12px;
      position: relative;
      left: 0px;
    }
  }
  .leftbar-content-area {
    grid-area: leftbar-content;
  }
  .leftbar-footer-area {
    grid-area: leftbar-footer;

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

    & > .b-tabs {
      height: 100%;
      .tab-content {
        padding: 0;
      }
      .tab-content,
      .tab-item {
        height: 100%;
      }
    }
  }
  .center-footer-area {
    grid-area: center-footer;
    justify-self: end;
    align-self: center;
    .buttons {
      margin-right: 20px;
    }
  }

  .root-grid-container {
    display: grid;
    min-height: inherit;
    height: 100%;

    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "center-content";
  }
  .popup-mode {
    grid-template-columns: 320px auto;
    grid-template-rows: 120px auto 80px;
    grid-template-areas:
      "leftbar-header center-content"
      "leftbar-content center-content"
      "leftbar-footer center-footer";
  }
}

.root-container::v-deep .b-tabs .tabs:first-of-type {
  display: none;
}
</style>
