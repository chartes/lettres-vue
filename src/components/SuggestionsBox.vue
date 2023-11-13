<template>
  <div class="suggestions-box-header-container">
    <div 
      class="row is-flex is-justify-content-space-between suggestions-box-header-header my-1"
      :class="`suggestions-box-header-header-${type}`"
    >
      <span class="advanced_search_header m-2">
        {{ title }}
      </span>
    </div>
    <div class="row is-flex-direction-column">
      <div
        v-for="suggestion in sortSuggestions()"
        :key="suggestion.label + suggestion.tag"
        class="row is-flex is-justify-content-space-between suggestions-box-header-persons my-2"
      >
        <div
          class="tag-container"
          @click="searchSuggestion(suggestion)"
        >
          <span
            v-if="type !== 'collections'"
            class="tag-flag"
          >
            {{ suggestion.tag }}
          </span>
          <span class="tag-label">
            {{ suggestion.label }}
          </span>
          <span class="tag-count">
            {{ suggestion.count }}
          </span>
        </div>
      </div>
      <div class="is-flex is-justify-content-flex-end my-2">
        <button
          class="suggestions-show-more"
          @click="function() {showMore = !showMore; sortSuggestions()}"
        >
          {{ showMore ? "VOIR PLUS" : "VOIR MOINS" }}
        </button>
      </div>
    </div>
  </div>
</template>
  
<script>
import {mapState, mapActions} from "vuex";
import {value} from "lodash/seq";

export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ['persons', 'places'].includes(value)
      }
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMore: false,
    };
  },
  computed: {
    ...mapState("persons", {allPersons: "persons_roles"}),
    ...mapState("placenames", {allPlaces: "places"}),
  },
  methods: {
    value,
    ...mapState("search", ["currentQuery"]),
    ...mapActions("search", [
      "setSelectedPersonFrom",
      "setSelectedPersonTo",
      "setSelectedPersonCited",
      "setSelectedPlaceFrom",
      "setSelectedPlaceTo",
      "setSelectedPlaceCited",
      "resetSearchState",
      "performSearch"
    ]),
    sortSuggestions() {
      const maxElements = this.showMore ? 20 :5
      const suggestions = this.type === "persons" ? this.getPersonsToSuggest() : this.getPlacesToSuggest()
      const sortedSuggestions = suggestions
          .sort((person_x, person_y) => (person_x.count > person_y.count) ? -1 : 1)
          .slice(0, maxElements)
        return sortedSuggestions.map((p) => ({
          label: p.label, 
          count: p.count, 
          tag: p.role_id === 1 ? "EXP" : p.role_id === 2 ? "DES" : "CIT",
          originalObject: p
        }))
    },
    getPersonsToSuggest() {
      if (this.allPersons.length){
        return [
          ...new Set([
            ...this.allPersons[0]['persons'],
            ...this.allPersons[1]['persons'],
            ...this.allPersons[2]['persons']
          ])
        ];
      } else {
        return []
      }
    },
    getPlacesToSuggest() {
      if (this.allPlaces.length){
        return [
          ...new Set([
            ...this.allPlaces[0]['places'],
            ...this.allPlaces[1]['places'],
            ...this.allPlaces[2]['places']
          ])
        ];
      } else {
        return []
      }
    },
    searchSuggestion(suggestion) {
      this.resetSearchState();
      if (this.type === "persons") {
        this.selectPerson(suggestion.originalObject)
      } else {
        this.selectPlace(suggestion.originalObject)
      }
      this.performSearch()
    },
    selectPerson(person) {
      switch(person.role_id) {
        case 1:
          this.setSelectedPersonFrom([person]);
          break;
        case 2:
          this.setSelectedPersonTo([person]);
          break;
        case 3:
          this.setSelectedPersonCited([person]);
          break;
      }
    },
    selectPlace(place) {
      switch(place.role_id) {
        case 1:
          this.setSelectedPlaceFrom([place]);
          break;
        case 2:
          this.setSelectedPlaceTo([place]);
          break;
        case 3:
          this.setSelectedPlaceCited([place]);
          break;
      }
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
.suggestions-box-header-header {
  padding-left: 30px;
}
.suggestions-box-header-header-persons {
  background: url('../assets/images/icons/picto-personnes.svg') center left no-repeat;
}
.suggestions-box-header-header-places {
  background: url('../assets/images/icons/picto-lieux.svg') center left no-repeat;
}
.tag-container {
  display: flex;
  width: 100%;
  cursor: pointer;
}
.tag-flag {
  font-size: small;
  font-weight: bolder;
  padding: 2px;
  width: 50px;
}
.tag-label {
  flex: 1;
}
.tag-count {
  font-weight: bold;
}
.suggestions-show-more {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-weight: 600;
  font-size: small;
  padding: 0;
  margin-top: 6px;
}
.advanced_search_header {
  align-self: center;
  font-weight: 600;
}
.advanced_search_router {
  align-self: center;
  margin-left: auto;
}
i {
  color: rgba(140, 140, 140) !important;
}
.suggestions-box-header-container {
  border-bottom: solid 1px #C7C7C7;
}
</style>
