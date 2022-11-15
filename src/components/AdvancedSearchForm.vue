<template>
  <section class="advanced-search-form">
    <span class="close-form" @click="hideAdvancedSearchForm">
      <i class="far fa-times-circle" />
    </span>
    <div class="section grid-container">
      <section class="search-section">
        <search-box v-if="!showLeftSideBar" class="mt-5 mb-2" />
        <collection-search-box />
      </section>

      <div class="divider is-left">Dates de temps</div>
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
        </b-field>

        <!--
        date
        to
        -->
        <b-field>
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
      </section>

      <div class="divider is-left">Dates de lieu</div>
      <section class="places-section">
        <b-field label="Expédition">
          <b-autocomplete
            :data="placeFromData"
            placeholder="Montpellier"
            field="attributes.label"
            :loading="isFetchingPlaceFrom"
            @typing="getAsyncPlaceFromData"
            @select="(option) => (selectedPlaceFrom = option)"
            clearable
          >
            <template slot-scope="props">
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
      </section>

      <div class="divider is-left">Correspondants</div>
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
      </section>

      <div class="divider is-left">Options d'affichage</div>
      <section class="display-section">
        <div class="with-status">
          <b-field>
            <b-checkbox v-model="showStatuses"> Afficher les badges </b-checkbox>
          </b-field>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import debounce from "lodash/debounce";

import { mapState, mapActions } from "vuex";
import SearchBox from "@/components/SearchBox";
import CollectionSearchBox from "@/components/CollectionSearchBox";

import { templates, labels } from "@/store/modules/search";

export default {
  name: "AdvancedSearchForm",
  components: {
    SearchBox,
    CollectionSearchBox,
  },
  data() {
    return {
      availableYears: [].concat(
        Array.from({ length: 400 }, (x, i) => (1300 + i).toString())
      ),
      availableMonths: labels.monthLabels.map((m) => this.capitalize(m)),
      availableDays: [].concat(
        Array.from({ length: 31 }, (x, i) => (1 + i).toString().padStart(2, "0"))
      ),

      placeFromData: [],
      isFetchingPlaceFrom: false,
      selectedPlaceFrom: null,

      placeToData: [],
      isFetchingPlaceTo: false,
      selectedPlaceTo: null,

      personFromData: [],
      isFetchingPersonFrom: false,
      selectedPersonFrom: null,

      personToData: [],
      isFetchingPersonTo: false,
      selectedPersonTo: null,
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
    ...mapState("placenames", ["placenamesSearchResults"]),
    ...mapState("persons", ["personsSearchResults"]),

    showStatuses: {
      get: function () {
        return this.withStatus;
      },
      set: function (value) {
        this.setWithStatus(value);
        this.performSearch();
      },
    },

    withDateRange: {
      get: function () {
        return this._withDateRange;
      },
      set: function (value) {
        //console.log('cdt', value)
        this.setWithDateRange(value);
      },
    },

    creationDateFrom: {
      get: function () {
        return this._creationDateFrom;
      },
      set: function (value) {
        console.log("cdf", value);
        this.setCreationDateFrom(value);
      },
    },

    creationDateTo: {
      get: function () {
        return this._creationDateTo;
      },
      set: function (value) {
        console.log("cdt", value);
        this.setCreationDateTo(value);
      },
    },

    filteredCreationDateFromYear() {
      return this.filteredDataArray(this.availableYears, this.creationDateFrom.year);
    },
    filteredCreationDateFromMonth() {
      return this.filteredDataArray(this.availableMonths, this.creationDateFrom.month);
    },
    filteredCreationDateFromDay() {
      return this.filteredDataArray(this.availableDays, this.creationDateFrom.day);
    },

    filteredCreationDateToYear() {
      return this.filteredDataArray(this.availableYears, this.creationDateTo.year);
    },
    filteredCreationDateToMonth() {
      return this.filteredDataArray(this.availableMonths, this.creationDateTo.month);
    },
    filteredCreationDateToDay() {
      return this.filteredDataArray(this.availableDays, this.creationDateTo.day);
    },
  },
  watch: {
    withDateRange() {
      /* initialize the second date when the switch is triggered*/
      this.creationDateTo = this.withDateRange
        ? this.cloneDeep(this.creationDateFrom)
        : this.cloneDeep(templates.creationDateTemplate);
    },

    creationDateFrom() {
      this.performSearch();
    },
    creationDateTo() {
      this.performSearch();
    },
  },
  async created() {},
  methods: {
    ...mapActions("search", [
      "performSearch",
      "setWithStatus",
      "setWithDateRange",
      "setCreationDateFrom",
      "setCreationDateTo",
    ]),
    ...mapActions("layout", ["hideAdvancedSearchForm"]),

    ...mapActions("placenames", { searchPlacename: "search" }),
    ...mapActions("persons", { searchPerson: "search" }),

    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1);
    },

    filteredDataArray(data, value) {
      return data.filter((option) => {
        return option.toLowerCase().startsWith(value.toLowerCase());
      });
    },

    getAsyncPlaceFromData: debounce(async function (input) {
      if (input.length < 2) {
        this.placeFromData = [];
        return;
      }
      this.isFetchingPlaceFrom = true;
      await this.searchPlacename(input);
      this.placeFromData = [];
      this.placenamesSearchResults.map((item) => {
        this.placeFromData.push(item);
      });

      this.isFetchingPlaceFrom = false;
    }, 300),

    getAsyncPlaceToData: debounce(async function (input) {
      if (input.length < 2) {
        this.placeToData = [];
        return;
      }
      this.isFetchingPlaceTo = true;
      await this.searchPlacename(input);
      this.placeToData = [];
      this.placenamesSearchResults.map((item) => {
        this.placeToData.push(item);
      });

      this.isFetchingPlaceTo = false;
    }, 300),

    getAsyncPersonFromData: debounce(async function (input) {
      if (input.length < 2) {
        this.personFromData = [];
        return;
      }
      this.isFetchingPersonFrom = true;
      await this.searchPerson(input);
      this.personFromData = [];
      this.personsSearchResults.map((item) => {
        this.personFromData.push(item);
      });

      this.isFetchingPersonFrom = false;
    }, 300),

    getAsyncPersonToData: debounce(async function (input) {
      if (input.length < 2) {
        this.personToData = [];
        return;
      }
      this.isFetchingPersonTo = true;
      await this.searchPerson(input);
      this.personToData = [];
      this.personsSearchResults.map((item) => {
        this.personToData.push(item);
      });

      this.isFetchingPersonTo = false;
    }, 300),
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.advanced-search-form {
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
    .input {
      width: 250px;
    }
  }

  .autocomplete .icon {
    height: 31px !important;
  }
  .taginput .autocomplete .icon {
    height: 22px !important;
  }
}
</style>
