<template>
  <div class="create-place-form">
    <div class="columns">
      <div class="column">
        <div class="block">
          <b-field label="Source">
            <b-radio
              v-model="source"
              name="source"
              native-value="wikidata"
              expanded
            >
              Wikidata
            </b-radio>
            <b-radio
              v-model="source"
              name="source"
              native-value="user"
              expanded
            >
              Saisie
            </b-radio>
          </b-field>
        </div>
        <div v-if="source === 'wikidata'">
          <b-field label="Nom du lieu">
            <b-autocomplete
              v-model="inputTerm"
              :data="autocompleteData"
              placeholder="Montpellier"
              field="label"
              :loading="isFetching"
              class="search-input"
              clearable
              open-on-focus
              @typing="fetchWikidataItems"
              @select="(option) => (selected = option)"
            >
              <template slot-scope="props">
                <div class="is-light">
                  <div class="heading">
                    {{ props.option.label }} ({{ props.option.country }})
                  </div>
                </div>
              </template>

              <template
                v-if="inputTerm"
                #empty
              >
                Aucun résultat pour {{ inputTerm }}
              </template>
            </b-autocomplete>
            <a
              class="button pl-5 pr-5"
              @click="fetchWikidataItems"
            >
              <span class="icon">
                <i class="fas fa-search" />
              </span>
            </a>
          </b-field>
        </div>
        <div v-else>
          <b-field label="Nom du lieu">
            <b-input
              v-model="placeName"
              type="text"
              required
              placeholder="Montpellier"
            />
          </b-field>
          <b-field label="Identifiant de référence">
            <b-input
              v-model="refId"
              type="text"
              placeholder="https://www.wikidata.org/entity/Q640968"
            />
          </b-field>
        </div>

        <b-button
          type="is-primary is-light"
          :disabled="!newPlace"
          class="mt-3 is-pulled-right"
          @click="selectNewPlace"
        >
          Sélectionner
        </b-button>
      </div>
      <div class="column">
        <article class="selected-placename">
          <div
            v-if="selected"
            class="is-light"
          >
            <my-awesome-map
              v-if="selected.coords"
              :key="inputTerm"
              :lat-lng="selected.coords"
            />
            <div class="heading">
              {{ selected.label }}
            </div>
            <div class="heading">
              {{ selected.item }}
            </div>
          </div>
          <b-skeleton
            v-if="selected === null || selected.coords.length === 0"
            :animated="false"
            :width="460"
            :height="320"
          />
        </article>
      </div>
    </div>
    <b-message
      v-if="existsCount > 0"
      type="is-warning is-small"
      has-icon
    >
      Un lieu possédant l'identifiant <b>{{ selected.item }}</b> existe déjà dans
      l'application.
    </b-message>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { searchWikidataPlacename } from "@/modules/sparql-helpers";
import MyAwesomeMap from "@/components/MyAwesomeMap.vue";

export default {
  name: "CreatePlaceForm",
  components: {
    MyAwesomeMap,
  },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-place-data"],
  data() {
    return {
      source: "wikidata",

      placeName: null,
      refId: null,

      autocompleteData: [],
      selected: null,
      existsCount: 0,
      isFetching: false,
      inputTerm: "",
    };
  },
  computed: {
    canAdd() {
      return this.newPlace;
    },
    newPlace() {
      if (this.source === "wikidata") {
        return this.selected ? {
          ...this.selected,
          ref: this.selected.item
        } : null ;
      } else {
        return this.placeName
          ? {
              label: this.placeName,
              ref: this.refId,
            }
          : null;
      }
    },
  },
  watch: {
    inputTerm() {},
    async selected() {
      if (this.selected) {
        if (this.selected.item) {
          this.existsCount = await this.$store.dispatch(
            "placenames/checkIfRefExists",
            this.selected.item
          );
        } else {
          this.existsCount = 0;
        }
      }
    },
    source() {
      if (this.source !== "wikidata") {
        this.selected = null;
        this.inputTerm = null;
      }
    },
  },
  methods: {
    selectNewPlace() {
      this.managePlaceData({
        action: { name: "set-place" },
        data: this.newPlace,
      });
    },

    fetchWikidataItems: debounce(async function () {
      if (this.inputTerm && this.inputTerm.length >= 2) {
        this.autocompleteData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPlacename(this.inputTerm);

        if (response.results.bindings) {
          this.autocompleteData = response.results.bindings.map((b) => {
            let coordsTmp = b.coords ? b.coords.value.split("(")[1] : null;
            if (coordsTmp) {
              coordsTmp = coordsTmp.slice(0, coordsTmp.length - 1).split(" ");
              coordsTmp = [parseFloat(coordsTmp[1]), parseFloat(coordsTmp[0])];
            }

            return {
              item: b.item.value,
              coords: coordsTmp,
              label: b.label.value,
              country: b.paysLabel.value,
            };
          });
        }
        this.isFetching = false;
      }
    }, 500),

    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },
  },
};
</script>

<style lang="scss">
.create-place-form {
  padding-left: 12px;

  .map {
    height: 320px;
    width: 460px;
  }
}
.search-input .icon {
  top: -4px !important;
}
</style>
