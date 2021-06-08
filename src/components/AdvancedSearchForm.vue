<template>
  <section class="advanced-search-form">
    <span
      class="close-form"
      @click="hideAdvancedSearchForm"
    >
      <i
        class="far fa-times-circle"
      />
    </span>
    <div class="section grid-container">
      <div class="divider is-left">
        Recherche
      </div>
      <section class="search-section">
        <search-box
          v-if="!showLeftSideBar"
          class="mt-5 mb-2"
        />
      </section>


      <div class="divider is-left">
        Dates de temps
      </div>
      <section class="date-section">
        <b-field
          label="Date de rédaction"
          grouped
        >
          <b-autocomplete
            v-model="creationDateFrom.day"
            :data="filteredCreationDateFromDay"
            placeholder="Jour"
            open-on-focus
            clearable
            class="day-search"
            @select="option => creationDateFrom.selection.day = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateFrom.month"
            :data="filteredCreationDateFromMonth"
            placeholder="Mois"
            open-on-focus
            clearable
            class="month-search"
            @select="option => creationDateFrom.selection.month = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
        
          <b-autocomplete
            v-model="creationDateFrom.year"
            :data="filteredCreationDateFromYear"
            placeholder="Année"
            open-on-focus
            clearable
            class="year-search"
            @select="option => creationDateFrom.selection.year = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
        </b-field>

        <!--
        date
        to
        -->
        <b-field>
          <b-checkbox v-model="withDateRange">
            Plage de dates (jusqu'au…)
          </b-checkbox>
        </b-field>

        <b-field
          grouped
        >
          <b-autocomplete
            v-model="creationDateTo.day"
            :data="filteredCreationDateToDay"
            placeholder="Jour"
            open-on-focus
            clearable
            class="day-search"
            :disabled="!withDateRange"
            @select="option => creationDateTo.selection.day = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>

          <b-autocomplete
            v-model="creationDateTo.month"
            :data="filteredCreationDateToMonth"
            placeholder="Mois"
            open-on-focus
            clearable
            class="month-search"
            :disabled="!withDateRange"
            @select="option => creationDateTo.selection.month = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
        
          <b-autocomplete
            v-model="creationDateTo.year"
            :data="filteredCreationDateToYear"
            placeholder="Année"
            open-on-focus
            clearable
            class="year-search"
            :disabled="!withDateRange"
            @select="option => creationDateTo.selection.year = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
        </b-field>
      </section>

    
      <div class="divider is-left">
        Dates de lieu
      </div>
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

      <div class="divider is-left">
        Correspondants
      </div>
      <section class="correspondents-section">
        <!-- expéditeur -->
        <b-field grouped>
          <span>De</span> 
          <!-- person -->
          <b-autocomplete
            v-model="correspondentFrom[0].person"
            :data="filteredCorrespondentsFrom.persons[0]"
            placeholder="Expéditeur"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="option => correspondentFrom[0].selection.person = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
          <!-- function -->
          <b-autocomplete
            v-model="correspondentFrom[0].func"
            :data="filteredCorrespondentsFrom.functions[0]"
            placeholder="Fonction"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="option => correspondentFrom[0].selection.func = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
          <b-button 
            icon-left="plus"
            type="is-light"
          />
        </b-field>

        <!-- destinataire -->
        <b-field grouped>
          <span>À</span>
          <!-- person -->
          <b-autocomplete
            v-model="correspondentTo[0].person"
            :data="filteredCorrespondentsTo.persons[0]"
            placeholder="Destinataire"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="option => correspondentTo[0].selection.person = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
          <!-- function -->
          <b-autocomplete
            v-model="correspondentTo[0].func"
            :data="filteredCorrespondentsTo.functions[0]"
            placeholder="Fonction"
            open-on-focus
            clearable
            class="year-search"
            expanded
            @select="option => correspondentTo[0].selection.func = option"
          >
            <template #empty>
              Aucun résultat
            </template>
          </b-autocomplete>
          <b-button 
            icon-left="plus"
            type="is-light"
          />
        </b-field>
      </section>


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
import { mapState, mapActions } from 'vuex';
import SearchBox from "@/components/SearchBox";

export default {
    name: "AdvancedSearchForm",
    components: {
      SearchBox
    },
    data() {

        const availablePlacesTags = ['Nice', 'Brest', 'Montpellier']

        return {
          availableYears: ['n/a'].concat(Array.from({length: 400}, (x, i) => (1300+i).toString())),
          availableMonths: ['n/a'].concat(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
          'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']),
          availableDays: ['n/a'].concat(Array.from({length: 30}, (x, i) => (1+i).toString().padStart(2, '0'))),
          availableCorrespondents: ['Caterine', 'Robert de la Mark', 'Salviati'].sort(),
          availableFunctions: ['Duc', 'Prince héritier', 'Régente', 'Comte', 'Cardinal'].sort(),
          availablePlacesTags: availablePlacesTags,

          withDateRange: false,
        
          creationDateFrom: {
            year: '1474', 
            month: '',
            day: '',
            selection: {
              year: null,
              month: null,
              day: null
            }
          },

          creationDateTo: {
            year: '', 
            month: '',
            day: '',
            selection: {
              year: null,
              month: null,
              day: null
            }
          },

          correspondentFrom:[{
            person: '',
            func: '',
            selection: {
              person:null,
              func: null
            }
          }],

          correspondentTo:[{
            person: '',
            func: '',
            selection: {
              person:null,
              func: null
            }
          }],

          filteredPlacesFromTags: availablePlacesTags,
          filteredPlacesToTags: availablePlacesTags,
          placesTagsFrom: [],
          placesTagsTo: []
        }
    },
    computed: {
      ...mapState('layout', ['showLeftSideBar']),
      ...mapState('search', ['withStatus']),

      showStatuses: {
        get: function() { return this.withStatus },
        set: function(value) {
          this.setWithStatus(value)
          this.performSearch()
        } 
      },

      filteredCreationDateFromYear() { return this.filteredDataArray(this.availableYears, this.creationDateFrom.year) },
      filteredCreationDateFromMonth() { return this.filteredDataArray(this.availableMonths, this.creationDateFrom.month) },
      filteredCreationDateFromDay() { return this.filteredDataArray(this.availableDays, this.creationDateFrom.day) },

      filteredCreationDateToYear() { return this.filteredDataArray(this.availableYears, this.creationDateTo.year) },
      filteredCreationDateToMonth() { return this.filteredDataArray(this.availableMonths, this.creationDateTo.month) },
      filteredCreationDateToDay() { return this.filteredDataArray(this.availableDays, this.creationDateTo.day) },
      
      filteredCorrespondentsFrom() { 
        return {
          persons:[this.filteredDataArray(this.availableCorrespondents, this.correspondentFrom[0].person)],
          functions:[this.filteredDataArray(this.availableFunctions, this.correspondentFrom[0].func)]
        }
      },
      filteredCorrespondentsTo() { 
        return {
          persons:[this.filteredDataArray(this.availableCorrespondents, this.correspondentTo[0].person)],
          functions:[this.filteredDataArray(this.availableFunctions, this.correspondentTo[0].func)]
        }
      }
    },
    watch: {
      withDateRange() {
        if (this.withDateRange) {
          this.creationDateTo = {...this.creationDateFrom}
        } else {
          this.creationDateTo = {
            year: '', 
            month: '',
            day: '',
            selection: {
              year: null,
              month: null,
              day: null
            }
          }
        }
      }
    },
    created() {
     
    },
    methods: {
      ...mapActions('search', ['performSearch', 'setWithStatus']),
      ...mapActions('layout', ['hideAdvancedSearchForm']),

      filteredDataArray(data, value) {
        return data.filter((option) => {
          return option.startsWith(value)
        })
      },

      getFilteredTags(text) {
        this.filteredPlacesTagsFrom = this.availablePlacesTags.filter((option) => {
          return option.toString()
                       .toLowerCase()
                       .startsWith(text.toLowerCase())
          })
      }
    },
}
</script>

<style lang="scss" >
@import "@/assets/sass/main.scss";
@import "~@creativebulma/bulma-divider";

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
    width: 100px
  }
  .month-search {
    width: 140px;
  }
  .day-search {
    width: 80px
  }


  .date-section, .correspondents-section, .places-section, .display-section, .search-section {
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

  .autocomplete .icon{
    height: 31px !important;
  }
  .taginput .autocomplete .icon{
    height: 22px !important;
  }
}
</style>