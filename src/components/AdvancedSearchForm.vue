<template>
  <section class="advanced-search-form">
    <div class="section grid-container">
      <section class="search-section search-section-dates">
        <div class="row is-flex is-align-items-center search-section-header-dates">
          <span class="advanced_search_header m-2">DATES</span>
        </div>
        <div class="row">
          <div>
            <!-- Input sliders -->
            <div>
              <div>
                <div class="row is-flex is-align-items-center is-justify-content-center mb-5">
                  <span
                    class="date_label m-2"
                    style="font-size: small"
                  >ENTRE</span>
                  <b-field
                    class="is-inline-block mb-0"
                  >
                    <b-autocomplete
                      v-model="creationDateFrom.year"
                      :data="filteredCreationDateFromYear"
                      placeholder="Année"
                      open-on-focus
                      clearable
                      class="year-search"
                      pattern="\d{4}"
                      @input="
                        (option) => {
                          creationDateFrom.selection.year = option;
                          creationDateFrom = cloneDeep(creationDateFrom);
                        }
                      "
                      @select="
                        (option) => {
                          creationDateFrom.selection.year = option;
                          creationDateFrom = cloneDeep(creationDateFrom);
                        }
                      "
                    />
                  </b-field>
                  <span
                    class="date_label m-2"
                    style="font-size: small"
                  >ET</span>
                  <b-field class="is-inline-block">
                    <b-autocomplete
                      v-model="creationDateTo.year"
                      :data="filteredCreationDateToYear"
                      placeholder="Année"
                      open-on-focus
                      clearable
                      class="year-search"
                      pattern="\d{4}"
                      @input="
                        (option) => {
                          creationDateTo.selection.year = option;
                          creationDateTo = cloneDeep(creationDateTo);
                        }
                      "
                      @select="
                        (option) => {
                          creationDateTo.year = option;
                          creationDateTo.selection.year = option;
                          creationDateTo = cloneDeep(creationDateTo);
                        }
                      "
                    >
                      <template #empty>
                        Aucun résultat
                      </template>
                    </b-autocomplete>
                  </b-field>
                </div>
                <div class="vue-slider-parent">
                  <vue-slider
                    v-model="DateRange"
                    :min="minDateRange"
                    :max="maxDateRange"

                    :lazy="true"
                    :enable-cross="false"
                    @dragging="(value, index) => updateDateRange(value, index)"
                  />
                </div><!-- :marks="[1300, 1400, 1500, 1600, 1699]" -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="search-section">
        <facet-search-box
          type="persons"
          title="PERSONNES"
          placeholder="Catherine"
        />
      </section>

      <section class="search-section">
        <facet-search-box
          type="places"
          title="LIEUX"
          placeholder="Paris"
        />
      </section>

      <section class="search-section">
        <collection-search-box />
      </section>

      <section>
        <suggestions />
      </section>


      <!--<div class="divider is-left">Dates de temps</div>
      <section class="date-section">
        <b-field label="Date de rédaction" grouped>
          <b-autocomplete
            v-model="creationDateFrom.day"
            :data="filteredCreationDateFromDay"
            placeholder="Jour"
            open-on-focus
            clearable
            class="day-search"
            @input="
              (option) => {
                creationDateFrom.selection.day = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
            @select="
              (option) => {
                creationDateFrom.selection.day = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateFrom.month"
            :data="filteredCreationDateFromMonth"
            placeholder="Mois"
            open-on-focus
            clearable
            class="month-search"
            @input="
              (option) => {
                creationDateFrom.selection.month = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
            @select="
              (option) => {
                creationDateFrom.selection.month = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateFrom.year"
            :data="filteredCreationDateFromYear"
            placeholder="Année"
            open-on-focus
            clearable
            class="year-search"
            @input="
              (option) => {
                creationDateFrom.selection.year = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
            @select="
              (option) => {
                creationDateFrom.selection.year = option;
                creationDateFrom = cloneDeep(creationDateFrom);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>
        </b-field>-->

      <!--
        date
        to
        -->
      <!--<b-field>
          <b-checkbox v-model="withDateRange"> Plage de dates (jusqu'au…) </b-checkbox>
        </b-field>

        <b-field grouped>
          <b-autocomplete
            v-model="creationDateTo.day"
            :data="filteredCreationDateToDay"
            placeholder="Jour"
            open-on-focus
            clearable
            class="day-search"
            :disabled="!withDateRange"
            @input="
              (option) => {
                creationDateTo.selection.day = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
            @select="
              (option) => {
                creationDateTo.selection.day = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateTo.month"
            :data="filteredCreationDateToMonth"
            placeholder="Mois"
            open-on-focus
            clearable
            class="month-search"
            :disabled="!withDateRange"
            @input="
              (option) => {
                creationDateTo.selection.month = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
            @select="
              (option) => {
                creationDateTo.selection.month = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateTo.year"
            :data="filteredCreationDateToYear"
            placeholder="Année"
            open-on-focus
            clearable
            class="year-search"
            :disabled="!withDateRange"
            @input="
              (option) => {
                creationDateTo.selection.year = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
            @select="
              (option) => {
                creationDateTo.selection.year = option;
                creationDateTo = cloneDeep(creationDateTo);
              }
            "
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>
        </b-field>
      </section>-->

      <!--<div class="divider is-left">Dates de lieu</div>
      <section class="places-section">
        <b-field label="Expédition">
          <b-autocomplete
            :data="placeFromData"
            placeholder="Montpellier"
            field="attributes.label"
            :loading="isFetchingPlaceFrom"
            @typing="getAsyncPlaceFromData"
            @select="(option) => {selectPlaceFrom = option;/* TODO: review next row, added temporarily
            setSelectedPlaceFrom = setSelectedPlaceFrom*/}"
            clearable
          >
            <template v-slot="props">TODO: slot-scope replaced by v-slot
              {{ props.option.attributes.label }}
            </template>
          </b-autocomplete>
        </b-field>
        <b-field label="Destination">
          <b-autocomplete
            :data="placeToData"
            placeholder="Genève"
            field="attributes.label"
            :loading="isFetchingPlaceTo"
            @typing="getAsyncPlaceToData"
            @select="(option) => (selectedPlaceTo = option)"
            clearable
          >
            <template slot-scope="props">
              {{ props.option.attributes.label }}
            </template>
          </b-autocomplete>
        </b-field>
      </section>-->

      <!--<div class="divider is-left">Correspondants</div>
      <section class="correspondents-section">
        <b-field label="Expéditeur">
          <b-autocomplete
            :data="personFromData"
            placeholder="Henri IV"
            field="label"
            :loading="isFetchingPersonFrom"
            @typing="getAsyncPersonFromData"
            @select="(option) => (selectedPersonFrom = option)"
            clearable
          >
            <template slot-scope="props">
              {{ props.option.label }}
            </template>
          </b-autocomplete>
        </b-field>
        <b-field label="Destinataire">
          <b-autocomplete
            :data="personToData"
            placeholder="Catherine de Médicis"
            field="label"
            :loading="isFetchingPersonTo"
            @typing="getAsyncPersonToData"
            @select="(option) => (selectedPersonTo = option)"
            clearable
          >
            <template slot-scope="props">
              {{ props.option.label }}
            </template>
          </b-autocomplete>
        </b-field>
      </section>-->

      <div
        v-if="current_user"
        class="divider is-left"
      >
        Options d'affichage
      </div>
      <section
        v-if="current_user"
        class="display-section"
      >
        <div class="with-status">
          <b-field>
            <b-checkbox v-model="showStatuses">
              Afficher les badges
            </b-checkbox>
          </b-field>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import {cloneDeep} from "lodash";

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

import { mapState, mapActions } from "vuex";
import CollectionSearchBox from "@/components/CollectionSearchBox";
import FacetSearchBox from "@/components/FacetSearchBox.vue";
import Suggestions from "@/components/Suggestions.vue";
//import { templates, labels } from "@/store/modules/search";

export default {
  name: "AdvancedSearchForm",
  components: {
    VueSlider,
    CollectionSearchBox,
    FacetSearchBox,
    Suggestions
  },
  data() {
    return {
      minDateRange : 1300,
      maxDateRange : 1699,
      availableYears: [].concat(
        Array.from({ length: 400 }, (x, i) => (1300 + i).toString())
      ),
      /*availableMonths: labels.monthLabels.map((m) => this.capitalize(m)),
      availableDays: [].concat(
        Array.from({ length: 31 }, (x, i) => (1 + i).toString().padStart(2, "0"))
      ),*/
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar"]),
    ...mapState("search", {
      withStatus: "withStatus",
      _withDateRange: "withDateRange",
      _creationDateFrom: "creationDateFrom",
      _creationDateTo: "creationDateTo",
    }),

    showStatuses: {
      get: function () {
        return this.withStatus;
      },
      set: function (value) {
        this.setWithStatus(value);
      },
    },

    DateRange: {
      get: function() {
        if (this.creationDateFrom.year && this.creationDateTo.year && this.creationDateFrom.year.length >= 4 && this.creationDateTo.year.length >= 4) {
          console.log('DateRange GET with a valid Range', this.creationDateFrom.year.length >= 4 && this.creationDateTo.year.length >= 4, this.creationDateTo.year)
          return [parseInt(this.creationDateFrom.year), parseInt(this.creationDateTo.year)]
        } else if (this.creationDateFrom.year && this.creationDateFrom.year.length >= 4) {
          console.log('DateRange GET with a year From only')
          this.setWithDateRange(false);
          return [parseInt(this.creationDateFrom.year), 1699];
        } else if (this.creationDateTo.year && this.creationDateTo.year.length >= 4) {
          console.log('DateRange GET with a year To only')
          return [1300, parseInt(this.creationDateTo.year)];
        } else {
          console.log('DateRange GET no dates (default range)')
        return [1300,1699]
        }
      },
      set: function (value) { //do nothing
      },
    },

    creationDateFrom: {
      get: function () {
        console.log('creationDateFrom reset via get')
        return this._creationDateFrom;
      },
      set: function (value) {
        console.log('set creationDateFrom', value.selection.year)
        if (!value.selection.year || value.selection.year.length < 4 ) {
          console.log('creationDateFrom < 4', value.selection.year)
          this.setWithDateRange(false);
          this.setCreationDateFrom(value);
          console.log("AdvanceSearch Set creationDateFrom if loop this.performSearch")
          this.performSearch();
          if (this.creationDateTo.year.length === 4) {
            this.DateRange=[1300, this.creationDateTo.year];
          } else {
              this.DateRange = [1300, 1699];
          }
        } else if (this.creationDateTo.year) {
            this.setWithDateRange(true);
            this.DateRange = [parseInt(value.year) || 1300, Math.max(parseInt(value.year), parseInt(this.creationDateTo.year))];
            this.setCreationDateFrom(value);
            console.log("AdvanceSearch Set creationDateFrom elseif loop this.performSearch")
            this.performSearch();
          } else {
            console.log('creationDateTo missing')
            this.setWithDateRange(false);
            this.DateRange = [parseInt(value.year) || 1300, Math.max(parseInt(value.year), 1699)];
            this.setCreationDateFrom(value);
            console.log("AdvanceSearch Set creationDateFrom else loop this.performSearch")
            this.performSearch();
        }
      },
    },

    creationDateTo: {
      get: function () {
        return this._creationDateTo;
      },
      set: function (value) {
        console.log('set creationDateTo', value.selection.year);
        if (!value.selection.year || value.selection.year.length < 4 ) {
          console.log('creationDateTo < 4', value.selection.year)
          this.setWithDateRange(false);
          console.log("value", value)
          console.log("value.selection", value.selection)
          this.setCreationDateTo(value);
          console.log("AdvanceSearch Set creationDateTo if loop this.performSearch")
          this.performSearch();
          console.log('updating range with missing value To', value.selection.year)
          if (this.creationDateFrom.year.length === 4) {
            this.DateRange=[this.creationDateFrom.year, 1699];
          } else {
              this.DateRange = [1300, 1699];
          }
        } else {
          console.log('creationDateTo = 4', value.selection.year)
          this.setWithDateRange(true);
          this.DateRange = [Math.max(parseInt(this.creationDateFrom.year),1300), parseInt(value.selection.year)];
          this.setCreationDateTo(value);
          console.log("AdvanceSearch Set creationDateTo else loop this.performSearch")
          this.performSearch();
        }
      },
    },
    filteredCreationDateFromYear() {
      if (this.creationDateTo.year) {
        return this.filteredDataArray(this.availableYears, this.creationDateFrom.year).filter(dt => parseInt(dt) <= parseInt(this.creationDateTo.year));
      } else {
        return this.filteredDataArray(this.availableYears, this.creationDateFrom.year);
      }
    },
    /*filteredCreationDateFromMonth() {
      return this.filteredDataArray(this.availableMonths, this.creationDateFrom.month);
    },
    filteredCreationDateFromDay() {
      return this.filteredDataArray(this.availableDays, this.creationDateFrom.day);
    },*/
    filteredCreationDateToYear() {
      if (this.creationDateFrom.year) {
        return this.filteredDataArray(this.availableYears, this.creationDateTo.year ? this.creationDateTo.year : '').filter(dt => parseInt(dt) >= parseInt(this.creationDateFrom.year));
      } else {
        return this.filteredDataArray(this.availableYears, this.creationDateTo.year ? this.creationDateTo.year : '');
      }
    },
    /*filteredCreationDateToMonth() {
      return this.filteredDataArray(this.availableMonths, this.creationDateTo.month);
    },
    filteredCreationDateToDay() {
      return this.filteredDataArray(this.availableDays, this.creationDateTo.day);
    },*/
  },
  watch: {
    creationDateFrom() {
      console.log("AdvanceSearch watch creationDateFrom this.performSearch")
      this.performSearch();
    },
    creationDateTo() {
      console.log("AdvanceSearch watch creationDateTo this.performSearch")
      this.performSearch();
    },
    /*persons_roles(newValue, oldValue) {
      console.log(`Updating persons from to`, oldValue, newValue);
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        console.log("JSON.stringify(oldValue) !== JSON.stringify(newValue)", JSON.stringify(oldValue) !== JSON.stringify(newValue))
        if ((this.selectedPersonFrom.length === 0 && this.selectedPersonTo.length === 0 && this.selectedPersonCited.length === 0) &&
            (this.selectedPlaceFrom.length === 0 && this.selectedPlaceTo.length === 0 && this.selectedPlaceCited.length === 0)) {
          console.log("AdvanceSearch watch Places this.fetchAllPersons")
          this.fetchAllPersons()
          this.fetchAllPlaces()
        }
      }
    },
    places(newValue, oldValue) {
      console.log(`Updating places from to`, oldValue, newValue);
      console.log("check", this.selectedPersonFrom.length === 0 && this.selectedPersonTo.length === 0 && this.selectedPersonCited.length === 0)
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        console.log("JSON.stringify(oldValue) !== JSON.stringify(newValue)", JSON.stringify(oldValue) !== JSON.stringify(newValue))
        if ((this.selectedPersonFrom.length === 0 && this.selectedPersonTo.length === 0 && this.selectedPersonCited.length === 0) &&
            (this.selectedPlaceFrom.length === 0 && this.selectedPlaceTo.length === 0 && this.selectedPlaceCited.length === 0)) {
          console.log("AdvanceSearch watch Places this.fetchAllPersons")
          this.fetchAllPersons()
          this.fetchAllPlaces()
        }
      }
    }*/
  },
  /*async created() {
     await this.fetchAllPersons();
     await this.fetchAllPlaces();
  },*/
  methods: {
    //...mapActions("persons", {fetchAllPersons: "fetchAll"}),
    //...mapActions("placenames", {fetchAllPlaces: "fetchAll"}),
    cloneDeep,
    ...mapActions("search", [
      "performSearch",
      "setWithStatus",
      "setWithDateRange",
      "setCreationDateFrom",
      "setCreationDateTo",
      "setSelectedCollections"
    ]),

    updateDateRange(value, index) {
      console.log('index :', index)
      console.log('value :', value)
      if (value[0].toString().length >= 4 && value[1].toString().length >= 4) {
        console.log('both values >= 4, proceed with :', value)
        this.setWithDateRange(true);
        if (index === 0) {
          this.creationDateFrom.year = value[0].toString();
        }
        if (index === 1) {
          this.creationDateTo.year = value[1].toString();
        }
      } else if (value[0].toString().length >= 4) {
        console.log('value0 >= 4, proceed with single from date :', value);
        this.setWithDateRange(false);
        if (index === 0) {
          this.creationDateFrom.year = value[0].toString();
        }
      } else if (value[1].toString().length >= 4) {
        console.log('value1 >= 4, proceed with single to date :', value);
          this.setWithDateRange(false);
          if (index === 1) {
            //this.creationDateFrom.year = value[0].toString();
            this.creationDateTo.year = value[1].toString();
          }
        }
    },
    filteredDataArray(data, value) {
      return data.filter((option) => {
        return option.toLowerCase().startsWith(value.toLowerCase());
      });
    },

  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.advanced-search-form {
  background-color: white;
  height: 100%;

  color: #6D7278;
  font-weight: 400;

  .section.grid-container {
    padding: 0;
  }

  .b-slider .b-slider-thumb-wrapper.has-indicator .b-slider-thumb {
    padding: 14px 4px !important;
  }

  .close-form {
    font-size: 28px;
    position: relative;
    float: right;
    top: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .checkbox {
    display: inline-flex;
  }
  .year-search {
    width: 100px;
  }
  .month-search {
    width: 140px;
  }
  .day-search {
    width: 80px;
  }

  .date-section,
  .display-section,
  .search-section {
    margin-top: 16px;
    background-color: #F0F0F0;
    border-radius: 5px;
    padding: 14px 20px 5px;
    /*.input {
      width: 250px;
    }*/
  }

  .search-section .search-section-header-dates {
    padding-left: 30px;
    background: url('../assets/images/icons/picto-dates.svg') center left no-repeat;
  }

  .search-section::v-deep {

    .row:first-of-type {
      margin-bottom: 20px;
    }

    .advanced_search_header {
      font-weight: 500;
    }

    a.advanced_search_router {
      font-size: 14px;
      color: #6D7278;
      text-transform: uppercase;
    }

    .taginput .taginput-container .autocomplete input {
      height: auto;
      margin-bottom: 0;
      padding-top: 8px;
      padding-bottom: 8px;
      border-radius: 5px;
    }
  }

  .search-section.search-section-dates .autocomplete.year-search::v-deep {
    input {
      height: auto;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      border: #BAB9B6 solid 1px;

      font-family: $family-primary;
      font-size: 14px;
      font-weight: 500;
      color: #8B8A7E;
    }

    .control.has-icons-right .icon {
      height: 24px;
      padding: 0;
    }
  }

  .search-section:first-of-type {
    margin-top: 0;
    padding-bottom: 60px;
  }

  .autocomplete .icon {
    height: 31px !important;
  }
  .taginput .autocomplete .icon {
    height: 22px !important;
  }
}


/* sliders */
.sliders {
  font-family: $family-primary;
  font-weight: 500;
  text-transform: uppercase;
}
.sliders label {
  font-size: 16px;
  color: #4a4a4a;
  margin-bottom: 10px;
}
.sliders span {
  font-size: 14px;
  color: #979797;
}
.sliders input[type="number"].year {
  inset: unset;
  border: none;
  text-shadow: none;
  -moz-appearance: textfield;
  background-color: #fff;

  max-width: 70px;
  padding: 2px 0;
  margin: 0 15px;

  font-family: $family-primary;
  font-weight: 500;
  font-size: 14px;
  color: #979797;
  text-transform: uppercase;
  text-align: center;
}
.sliders input[type="number"].year:focus {
  outline: solid 2px #b9192f;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.sliders span.year {
  background-color: #fff;
  padding: 2px 20px;
  margin: 0 15px;
}
.slider-control {
  flex: 50% 0 0;
  padding: 24px;
}
.slider-control label {
  display: block;
}
.vue-slider.vue-slider-ltr {
  margin-top: 15px !important;
  padding: 0 10px !important;
  height: 6px !important;
}

.vue-slider-parent::v-deep {

  .vue-slider-rail {
    background-color: #CECECE;
  }

  .vue-slider-process {
    background-color: #CB2158;
  }

  .vue-slider-dot {
    width: 23px !important;
    height: 23px !important;
  }

  .vue-slider-mark,
  .vue-slider-dot-handle {
    border-width: 5px;
    border-color: #CB2158;
  }

  .vue-slider-dot-handle:hover {
    border-color: #CB2158;
    box-shadow: 0 0 0 1px #CB2158;
  }

  .vue-slider-mark,
  .vue-slider-mark.vue-slider-mark-active {
    width: 6px !important;
    height: 6px !important;
  }

  .vue-slider-mark-step-active,
  .vue-slider-mark:hover,
  .vue-slider:hover .vue-slider-mark-step-active,
  .vue-slider-mark.vue-slider-mark-active:hover {
    box-shadow: 0 0 0 1px #CB2158 !important;
  }

  .vue-slider-dot-handle-focus {
    box-shadow: 0 0 0 5px rgba(185, 25, 47, 0.2);
  }
}
</style>
