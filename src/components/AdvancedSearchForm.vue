<template>
  <section class="advanced-search-form">
    <span class="close-form" @click="hideAdvancedSearchForm">
      <i class="far fa-times-circle" />
    </span>
    <div class="section grid-container">
      <div class="divider is-left">Recherche</div>
      <section class="search-section">
        <search-box v-if="!showLeftSideBar" class="mt-5 mb-2" />
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
          <b-taginput
            v-model="placesTagsFrom"
            :data="filteredPlacesFromTags"
            autocomplete
            open-on-focus
            field="user.first_name"
            icon="map-marker-alt"
            placeholder="Montpellier"
            @typing="getFilteredTags"
          />
        </b-field>
        <b-field label="Destination">
          <b-taginput
            v-model="placesTagsTo"
            :data="filteredPlacesToTags"
            autocomplete
            open-on-focus
            field="user.first_name"
            icon="map-marker-alt"
            placeholder="Venise"
            @typing="getFilteredTags"
          />
        </b-field>
      </section>

      <div class="divider is-left">Correspondants</div>
      <section class="correspondents-section">
        <!-- expéditeur -->
        <b-field v-for="(c, i) in correspondentFrom" :key="`from_${i}`" grouped>
          <span :style="i === 0 ? '' : 'visibility: hidden'">De</span>
          <!-- person -->
          <b-autocomplete
            v-model="correspondentFrom[i].person"
            :data="filteredCorrespondentsFrom.persons[i]"
            placeholder="Expéditeur"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="(option) => (correspondentFrom[i].selection.person = option)"
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>
          <!-- function -->
          <b-autocomplete
            v-model="c.func"
            :data="filteredCorrespondentsFrom.functions[i]"
            placeholder="Fonction"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="(option) => (c.selection.func = option)"
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-button
            v-if="i === correspondentFrom.length - 1"
            icon-left="plus"
            type="is-light"
            @click="addCorrespondentFrom"
          />
          <b-button
            v-else
            icon-left="minus"
            type="is-light"
            @click="removeCorrespondentFrom(i)"
          />
        </b-field>

        <!-- destinataire -->
        <b-field v-for="(c, i) in correspondentTo" :key="`to_${i}`" grouped>
          <span :style="i === 0 ? '' : 'visibility: hidden'">À</span>
          <!-- person -->
          <b-autocomplete
            v-model="correspondentTo[i].person"
            :data="filteredCorrespondentsTo.persons[i]"
            placeholder="Destinataire"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="(option) => (correspondentTo[i].selection.person = option)"
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>
          <!-- function -->
          <b-autocomplete
            v-model="c.func"
            :data="filteredCorrespondentsTo.functions[i]"
            placeholder="Fonction"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="(option) => (c.selection.func = option)"
          >
            <template #empty> Aucun résultat </template>
          </b-autocomplete>

          <b-button
            v-if="i === correspondentTo.length - 1"
            icon-left="plus"
            type="is-light"
            @click="addCorrespondentTo"
          />
          <b-button
            v-else
            icon-left="minus"
            type="is-light"
            @click="removeCorrespondentTo(i)"
          />
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
import { cloneDeep as _cloneDeep } from "lodash";

import { mapState, mapActions } from "vuex";
import SearchBox from "@/components/SearchBox";

import { templates, labels } from "@/store/modules/search";

export default {
  name: "AdvancedSearchForm",
  components: {
    SearchBox,
  },
  data() {
    const availablePlacesTags = ["Nice", "Brest", "Montpellier"];
    const correspondentTemplate = {
      person: "",
      func: "",
      selection: {
        person: null,
        func: null,
      },
    };

    return {
      availableYears: [].concat(
        Array.from({ length: 400 }, (x, i) => (1300 + i).toString())
      ),
      availableMonths: labels.monthLabels.map((m) => this.capitalize(m)),
      availableDays: [].concat(
        Array.from({ length: 31 }, (x, i) => (1 + i).toString().padStart(2, "0"))
      ),
      availableCorrespondents: ["Caterine", "Robert de la Mark", "Salviati"].sort(),
      availableFunctions: [
        "Duc",
        "Prince héritier",
        "Régente",
        "Comte",
        "Cardinal",
      ].sort(),
      availablePlacesTags: availablePlacesTags,

      correspondentTemplate,
      correspondentFrom: [this.cloneDeep(correspondentTemplate)],
      correspondentTo: [this.cloneDeep(correspondentTemplate)],

      filteredPlacesFromTags: availablePlacesTags,
      filteredPlacesToTags: availablePlacesTags,
      placesTagsFrom: [],
      placesTagsTo: [],
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

    filteredCorrespondentsFrom() {
      return this.filterCorrespondent(this.correspondentFrom);
    },
    filteredCorrespondentsTo() {
      return this.filterCorrespondent(this.correspondentTo);
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
  created() {},
  methods: {
    ...mapActions("search", [
      "performSearch",
      "setWithStatus",
      "setWithDateRange",
      "setCreationDateFrom",
      "setCreationDateTo",
    ]),
    ...mapActions("layout", ["hideAdvancedSearchForm"]),

    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1);
    },

    filteredDataArray(data, value) {
      return data.filter((option) => {
        return option.toLowerCase().startsWith(value.toLowerCase());
      });
    },

    getFilteredTags(text) {
      this.filteredPlacesTagsFrom = this.availablePlacesTags.filter((option) => {
        return option.toString().toLowerCase().startsWith(text.toLowerCase());
      });
    },

    cloneDeep(obj) {
      return _cloneDeep(obj);
    },

    filterCorrespondent(correspondents) {
      let persons = [];
      let functions = [];
      for (let i = 0; i < correspondents.length; i++) {
        persons.push(
          this.filteredDataArray(this.availableCorrespondents, correspondents[i].person)
        );
        functions.push(
          this.filteredDataArray(this.availableFunctions, correspondents[i].func)
        );
      }

      return {
        persons,
        functions,
      };
    },

    addCorrespondentFrom() {
      this.correspondentFrom.push(this.cloneDeep(this.correspondentTemplate));
    },
    removeCorrespondentFrom(i) {
      this.correspondentFrom.splice(i, 1);
    },
    addCorrespondentTo() {
      this.correspondentTo.push(this.cloneDeep(this.correspondentTemplate));
    },
    removeCorrespondentTo(i) {
      this.correspondentTo.splice(i, 1);
    },
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
  .correspondents-section,
  .places-section,
  .display-section,
  .search-section {
    margin-top: 16px;
    .input {
      width: 250px;
    }
  }

  .correspondents-section {
    span {
      align-self: center;
      margin-right: 12px;
      width: 24px;
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
