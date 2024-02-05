<template>
  <div class="create-place-form">
    <div class="search-container mb-5">
      <span class="label">Chercher sur Wikidata</span>
      <b-field class="term-search">
        <div class="field has-addons">
          <b-input
            v-model="placeNameWikidataInput"
            class="search_input"
            type="search"
            placeholder="Chercher sur Wikidata"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="placeNameWikidataInput = ''"
            @focus="$event.target.select()"
            @keyup.native.enter="fetchWikidataItems"
          />
          <div>
            <a
              class="button pl-5 pr-5 search_button"
              :disabled="!placeNameWikidataInput || placeNameWikidataInput === ''"
              @click="fetchWikidataItems"
            >
              <span class="icon">
                <i v-if="isFetching" class="fas fa-spinner fa-pulse" />
                <i v-else class="fas fa-search" />
              </span>
            </a>
          </div>
        </div>
      </b-field>
    </div>
    <div>
      <b-table
        ref="multiSortTable"
        :data="tableData"
        detail-key="label"
        show-detail-icon
        :narrowed="true"
        :mobile-cards="true"
        :selected.sync="selected"
        class="place-table"
      >
        <b-table-column v-slot="props" field="label" label="Nom">
          <div class="label">
            {{ props.row.label }}
          </div>
          <div class="description">
            {{ props.row.description }}
          </div>
        </b-table-column>

        <b-table-column v-slot="props" field="country" label="Pays">
          {{ props.row.country }}
        </b-table-column>

        <b-table-column v-slot="props" field="ref" label="Identifiant de référence">
          <span v-if="props.row.item">
            <a
              v-if="props.row.item.startsWith('http')"
              :href="props.row.item"
              target="_blank"
            >
              {{ props.row.item }}
            </a>
            <span v-else>
              {{ props.row.item }}
            </span>
          </span>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">Aucun résultat</div>
        </template>

        <template #detail="props">
          {{ props.row }}
        </template>
      </b-table>
    </div>

    <div class="search-container">
      <span class="label">Aucun résultat ? Ajoutez un nouveau lieu :</span>
      <b-field>
        <b-input
          v-model="placeNameInput"
          class="search_input"
          type="search"
          placeholder="Lieu inexistant sur Wikidata"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="placeNameInput = ''"
        />
        <div class="hide">
          <a
            class="hide button pl-5 pr-5 search_button"
            :disabled="!placeNameWikidataInput || placeNameWikidataInput === ''"
            @click="fetchWikidataItems"
          >
            <span class="hide icon">
              <i v-if="isFetching" class="hide fas fa-spinner fa-pulse" />
              <i v-else class="hide fas fa-search" />
            </span>
          </a>
        </div>
      </b-field>

      <expanded-select
        v-if="placeNameInput.length"
        :items="filteredPlacenames"
        class="mt-2"
        @changed="selectionChanged"
        :selected-index="selectedPlaceName"
      />

      <b-field label="Identifiant de référence" v-show="false">
        <b-input
          v-model="refId"
          type="text"
          placeholder="https://www.wikidata.org/entity/Q640968"
        />
      </b-field>
    </div>

    <b-message
      v-if="existsCount > 0 && refId"
      type="is-warning is-small"
      has-icon
    >
      Un lieu possédant l'identifiant <b>{{ this.refId }}</b> existe déjà dans
      l'application.
    </b-message>
    <b-message
      v-else-if="existsCount > 0 && !refId"
      type="is-warning is-small"
      has-icon
    >
      Un lieu similaire existe déjà dans l'application.
    </b-message>
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash/debounce";
import { searchWikidataPlacename } from "@/modules/sparql-helpers";
import ExpandedSelect from "@/components/ui/ExpandedSelect.vue";

export default {
  name: "CreatePlaceForm",
  components: { ExpandedSelect },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-place-data"],
  data() {
    return {
      placeName: "",
      placeNameInput: "",

      refId: null,

      autocompleteData: [],
      selected: null,
      existsCount: 0,
      existingPlace: {},
      isFetching: false,
      placeNameWikidataInput: "",

      //table
      tableData: [],

      //manual
      selectedPlaceName: null,
    };
  },
  computed: {
    ...mapState("placenames", { allPlacesLabels: "placenames" }),

    newPlace() {
      if (this.selected) {
        return this.selected
          ? {
              ...this.selected,
              ref: this.selected.item,
            }
          : null;
      } else {
        if (Object.keys(this.existingPlace).length > 0) {
          return this.existingPlace
              ? {
                ...this.existingPlace,
                ref: this.existingPlace.item,
              }
              : null;
        } else {
          if (this.placeName && Object.keys(this.existingPlace).length === 0) {
            return {label: this.placeName, ref: this.refId}
          } else {
            return null
          }
        }
      }
    },
    filteredPlacenames() {
      return this.allPlacesLabels.filter((option) => {
        return (
          option.toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.placeNameInput.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0
        );
      });
    },
  },
  watch: {
    async selected() {
      this.reset()
      if (this.selected) {
        let _selected = this.selected
        if (this.selected.item) {
          this.selectedPlaceName = null;
          await this.$store.dispatch(
            "placenames/checkIfRefExists",
            this.selected.item
          ).then((response) => {
            this.existsCount = response.count;
            this.existingPlace = response.place
          });
          if (this.existsCount === 0) {
            this.selectNewPlace();
          } else {
            this.selected.id = this.existingPlace.id
            this.selected.label = this.existingPlace.attributes.label
            this.selected.item = this.existingPlace.attributes.ref
            this.selected.ref = this.existingPlace.attributes.ref
            this.selected.description = _selected.description ? _selected.description : ""
            this.selected.functions = this.existingPlace.attributes.functions

            //updating other variables
            this.refId = this.existingPlace.attributes.ref
          }
        } else {
          this.existsCount = 0;
        }
        this.selectNewPlace();
      }
    },
    placeNameInput() {
      this.placeName = this.placeNameInput;
      this.placeNameWikidataInput = "";
      this.selected = null;
      this.tableData = [];
      this.existingPlace = {};
      this.existsCount = 0;
      this.refId = null
      /*if (!this.existingPlace) {
        this.selected = null;
      }*/
      this.selectNewPlace();
    },
    placeNameWikidataInput(newVal, OldVal) {
      if (newVal === '') {
        this.placeName = ''
        this.tableData = [];
        this.selected = null;
        this.existingPlace = {};
        this.existsCount = 0;
        this.refId = null
        this.selectNewPlace();
      }
    }
  },
  methods: {
    selectNewPlace() {
      this.managePlaceData({
        action: { name: "set-place" },
        data: this.placeNameInput && !this.selected ? {...this.newPlace, "initialLabel": this.placeNameInput} : this.newPlace
      });
    },
    reset() {
      this.placeName = '';
      this.existingPlace = {};
      this.existsCount = 0;
      this.refId = null;
      //this.placeNameWikidataInput = ""
      this.placeNameInput = ""
    },

    async selectionChanged(evt) {
      this.existsCount = 0
      this.placeName = evt.item;
      this.selectedPlaceName = evt.index;
      this.existingPlace = {};
      let responsePlace = {}
      await this.$store.dispatch("placenames/search", this.placeName)
          .then((response) => {
            this.existsCount = response.response.meta["total-count"];
            this.responsePlace = response.response.data[0] ? response.response.data[0] : null
          });
      if (this.existsCount === 0) {
        this.selected = null;
      } else {
        this.existingPlace.id = this.responsePlace.id
        this.existingPlace.label = this.responsePlace.attributes.label
        this.existingPlace.ref = this.responsePlace.attributes.ref
        this.existingPlace.item = this.responsePlace.attributes.ref
        this.existingPlace.functions = this.responsePlace.attributes.functions
        if (this.responsePlace.attributes.long && this.responsePlace.attributes.lat) {
          this.existingPlace.coords = [parseFloat(this.responsePlace.attributes.long), parseFloat(this.responsePlace.attributes.lat)]
        }
        this.refId = this.responsePlace.attributes.ref
      }
      this.selectNewPlace();
    },

    fetchWikidataItems: debounce(async function () {
      if (this.placeNameWikidataInput && this.placeNameWikidataInput.length >= 2) {
        this.placeNameInput = '';
        this.tableData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPlacename(this.placeNameWikidataInput);

        if (response.results.bindings) {
          this.tableData = response.results.bindings.map((b) => {
            let coordsTmp = b.coords ? b.coords.value.split("(")[1] : null;
            if (coordsTmp) {
              coordsTmp = coordsTmp.slice(0, coordsTmp.length - 1).split(" ");
              coordsTmp = [parseFloat(coordsTmp[1]), parseFloat(coordsTmp[0])];
            }
            //console.log(b);
            return {
              item: b.item.value.replace("http:", "https:"),
              coords: coordsTmp,
              label: b.label.value,
              description: b.itemDescription ? b.itemDescription.value : null,
              country: b.paysLabel.value,
            };
          });
        }
        this.isFetching = false;
      }
    }, 300),

    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.create-place-form {
  .place-table {
    overflow-y: auto;
    max-height: 320px;

    tr:hover {
      cursor: pointer;
    }
  }
  .description {
    font-weight: lighter;
    &:first-letter {
      text-transform: uppercase;
    }
  }
}

.search-container input {
  width: 100% !important;
  vertical-align: center;
}
.hide {
  visibility: hidden !important;
}
.control, .search_input {
  width: 100% !important;
  margin-right: 1px !important;

  ::v-deep .icon {
    padding: 0px !important;
  }

  ::v-deep input {
    //border-right-color: #FFFFFF !important;
    border-bottom-right-radius: 4px !important;
    border-top-right-radius: 4px !important;
    height: 100%;
    padding-top: 2px;
    padding-bottom: 2px;

    font-family: $family-primary;
    font-size: 18px;
    font-weight: 400;
    color: #343434;

    @include on-mobile {
      font-size: 15px;
    }

    &:hover,
    &:focus {
      border-bottom-right-radius: 4px !important;
      border-top-right-radius: 4px !important;
      //border-right-color: transparent !important;
      box-shadow: none !important;
    }
  }
}
.search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow: none !important;
  color: rgba(127, 0, 56) !important;
  //border-bottom-left-radius: 0px !important;
  //border-top-left-radius: 0px !important;

  &.pl-5 {
    @include on-mobile {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }

  i.fa-search {
    text-indent: -9999px;
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url(../../../assets/images/icons/loupe_header.svg) center / contain no-repeat;

    @include on-mobile {
      width: 20px;
      height: 20px;
    }
  }
}

</style>
