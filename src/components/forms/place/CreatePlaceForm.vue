<template>
  <div class="create-place-form is-flex-direction-column">
    <div class="mb-5">
      <span class="label">Chercher sur Wikidata</span>
      <b-field class="term-search">
        <div class="field has-addons">
          <div class="control">
            <input
              v-model="placeNameWikidataInput"
              class="input"
              type="text"
              placeholder="Turin"
              @keyup.enter="fetchWikidataItems"
            />
          </div>
          <div class="control">
            <a class="button pl-5 pr-5" @click="fetchWikidataItems">
              <span class="icon">
                <i v-if="isFetching" class="fas fa-spinner fa-pulse" />
                <i v-else class="fas fa-search" />
              </span>
            </a>
          </div>
        </div>
      </b-field>

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
              >{{ props.row.item }}</a
            >
            <span v-else>{{ props.row.item }}</span>
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

    <div>
      <b-field label="Aucun résultat ? Ajoutez un nouveau lieu :" class="mt-2">
        <b-input
          v-model="placeNameInput"
          type="text"
          placeholder="Turin"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="placeNameInput = ''"
          style="max-width: 360px"
        />
      </b-field>

      <expanded-select
        :items="filteredPlacenames"
        class="mt-2"
        @changed="selectionChanged"
        :selected-index="selectedPlaceName"
        style="max-height: 120px"
      />

      <b-field label="Identifiant de référence" v-show="false">
        <b-input
          v-model="refId"
          type="text"
          placeholder="https://www.wikidata.org/entity/Q640968"
        />
      </b-field>
    </div>

    <b-message v-if="existsCount > 0" type="is-warning is-small" has-icon>
      Un lieu possédant l'identifiant <b>{{ selected.item }}</b> existe déjà dans
      l'application.
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
      isFetching: false,
      placeNameWikidataInput: "",

      //table
      tableData: [],

      //manual
      selectedPlaceName: null,
    };
  },
  computed: {
    ...mapState("placenames", { allPlaces: "placenames" }),
    newPlace() {
      if (this.selected) {
        return this.selected
          ? {
              ...this.selected,
              ref: this.selected.item,
            }
          : null;
      } else {
        return this.placeName
          ? {
              label: this.placeName,
              ref: this.refId,
            }
          : null;
      }
    },

    filteredPlacenames() {
      return this.allPlaces.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(this.placeNameInput.toLowerCase()) >= 0
        );
      });
    },
  },
  watch: {
    async selected() {
      if (this.selected) {
        if (this.selected.item) {
          this.selectedPlaceName = null;
          this.existsCount = await this.$store.dispatch(
            "placenames/checkIfRefExists",
            this.selected.item
          );
          if (this.existsCount === 0) {
            this.selectNewPlace();
          }
        } else {
          this.existsCount = 0;
        }
      }
    },
    placeNameInput() {
      this.placeName = this.placeNameInput;
      this.placeNameWikidataInput = "";
      this.selected = null;
      this.selectNewPlace();
    },
  },
  methods: {
    selectNewPlace: debounce(function () {
      this.managePlaceData({
        action: { name: "set-place" },
        data: this.newPlace,
      });
    }, 75),

    selectionChanged(evt) {
      this.placeName = evt.item;
      this.selectedPlaceName = evt.index;
      this.selected = null;
      this.selectNewPlace();
    },

    fetchWikidataItems: debounce(async function () {
      if (this.placeNameWikidataInput && this.placeNameWikidataInput.length >= 2) {
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
            return {
              item: b.item.value,
              coords: coordsTmp,
              label: b.label.value,
              description: b.itemDescription.value,
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

<style lang="scss">
.create-place-form {
  .place-table {
    overflow-y: auto;
    max-height: 320px;

    tr:hover {
      cursor: pointer;
    }
  }
  .description {
    font-style: lighter;
    &:first-letter {
      text-transform: uppercase;
    }
  }
}
.search-input .icon {
  top: -4px !important;
}
</style>
