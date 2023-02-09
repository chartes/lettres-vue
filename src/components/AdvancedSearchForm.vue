<template>
  <section class="advanced-search-form">
    <div class="section grid-container p-5">
      <section class="search-section">
        <div class="row is-flex is-align-items-center">
          <i
            class="fas fa-calendar-alt m-2"
            style="font-size:32px;"
          />
          <span class="advanced_search_header m-2">DATES</span>
        </div>
        <div class="row">
          <div>
            <!-- Input sliders -->
            <div>
              <div>
                <div class="row is-flex is-align-items-center is-justify-content-center">
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
                <div>
                  <vue-slider
                    v-model="DateRange"
                    :min="minDateRange"
                    :max="maxDateRange"
                    :marks="[1300, 1400, 1500, 1600, 1699]"
                    :lazy="true"
                    :enable-cross="false"
                    @dragging="(value, index) => updateDateRange(value, index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="search-section">
        <person-search-box />
      </section>

      <section class="search-section">
        <place-search-box />
      </section>

      <section class="search-section">
        <collection-search-box />
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

      <div class="divider is-left">
        Options d'affichage
      </div>
      <section class="display-section">
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
import PersonSearchBox from "@/components/PersonSearchBox.vue";
import PlaceSearchBox from "@/components/PlaceSearchBox.vue";
//import { templates, labels } from "@/store/modules/search";

export default {
  name: "AdvancedSearchForm",
  components: {
    VueSlider,
    CollectionSearchBox,
    PersonSearchBox,
    PlaceSearchBox,
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
        this.performSearch();
      },
    },

    DateRange: {
      get: function() {
        if (this.creationDateFrom.year.length >= 4 && this.creationDateTo.year.length >= 4) {
          console.log('test1')
          return [parseInt(this.creationDateFrom.year), parseInt(this.creationDateTo.year)]
        } else if (this.creationDateFrom.year.length >= 4) {
          console.log('test2')
          this.setWithDateRange(false);
          return [parseInt(this.creationDateFrom.year), 1699];
        } else if (this.creationDateTo.year.length >= 4) {
          console.log('test3')
          return [1300, parseInt(this.creationDateTo.year)];
        } else {
          console.log('test4')
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
        console.log('set creationDateFrom', value)
        if (!value.year || value.year.length < 4 ) {
          this.setWithDateRange(false);
          this.setCreationDateFrom(value);
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
            this.performSearch();
          } else {
            console.log('creationDateTo missing')
            this.setWithDateRange(false);
            this.DateRange = [parseInt(value.year) || 1300, Math.max(parseInt(value.year), 1699)];
            this.setCreationDateFrom(value);
            this.performSearch();
        }
      },
    },

    creationDateTo: {
      get: function () {
        return this._creationDateTo;
      },
      set: function (value) {
        if (!value.year || value.year.length < 4 ) {
          console.log('creationDateTo < 4', value.year)
          this.setWithDateRange(false);
          this.setCreationDateTo(value);
          this.performSearch();
          console.log('updating range with missing value To', value.year)
          if (this.creationDateFrom.year.length === 4) {
            this.DateRange=[this.creationDateFrom.year, 1699];
          } else {
              this.DateRange = [1300, 1699];
          }
        } else {
          console.log('creationDateTo = 4', value.year)
          this.setWithDateRange(true);
          this.DateRange = [Math.max(parseInt(this.creationDateFrom.year),1300), parseInt(value.year)];
          this.setCreationDateTo(value);
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
        let test = function() {return this.filteredDataArray(this.availableYears, this.creationDateTo.year).filter(dt => parseInt(dt) >= parseInt(this.creationDateFrom.year))};
        console.log('test : ', test)
        return this.filteredDataArray(this.availableYears, this.creationDateTo.year).filter(dt => parseInt(dt) >= parseInt(this.creationDateFrom.year));
      } else {
        return this.filteredDataArray(this.availableYears, this.creationDateTo.year);
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
      this.performSearch();
    },
    creationDateTo() {
      this.performSearch();
    },
  },
  methods: {
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

<style lang="scss">
@import "@/assets/sass/main.scss";

.advanced-search-form {
  background-color: white;
  height: 100%;
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
    background-color: $beige-lighter;
    border-radius: 5px;
    padding: 10px;
    /*.input {
      width: 250px;
    }*/
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
  font-family: "Barlow", sans-serif;
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

  font-family: "Barlow", sans-serif;
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
  height: 3px !important;
}
.vue-slider :deep(.vue-slider-dot) {
  width: 18px !important;
  height: 18px !important;
}
.vue-slider:hover :deep(.vue-slider-rail),
.vue-slider :deep(.vue-slider-rail) {
  background-color: #ffffff;
}
.vue-slider :deep(.vue-slider:hover .vue-slider-process),
.vue-slider :deep(.vue-slider-process) {
  background-color: #b9192f !important;
}
.vue-slider :deep(.vue-slider-dot-handle:hover),
.vue-slider :deep(.vue-slider-dot-handle-focus),
.vue-slider :deep(.vue-slider-dot-handle) {
  border-color: #b9192f !important;
}
.vue-slider :deep(.vue-slider-dot-handle-focus) {
  box-shadow: 0 0 0 5px rgba(185, 25, 47, 0.2);
}
</style>
