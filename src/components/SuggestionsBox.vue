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
          v-if="showExpandButton"
          class="suggestions-show-more"
          @click="function() {expanded = !expanded; sortSuggestions()}"
        >
          {{ expanded ? "VOIR MOINS" :"VOIR PLUS" }}
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
        return ['persons', 'places', 'collections'].includes(value)
      }
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
      showExpandButton: false,
    };
  },
  computed: {
    ...mapState("persons", {allPersons: "persons_roles"}),
    ...mapState("placenames", {allPlaces: "places"}),
    ...mapState("collections", {collectionsTags: "collectionsTags"}),
    ...mapState("search", [
      "selectedPersonFrom",
      "selectedPersonTo",
      "selectedPersonCited",
      "selectedPlaceFrom",
      "selectedPlaceTo",
      "selectedPlaceCited",
      "selectedCollections",
    ]),
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
      "setSelectedCollections",
      "resetSearchState",
      "performSearch",
    ]),
    sortSuggestions() {
      const expandLimit = 5
      const maxElements = this.expanded ? 20 : expandLimit
      let suggestions = []
      if (this.type === "persons") {
        suggestions = this.getPersonsToSuggest()
      } else if (this.type === "places") {
        suggestions = this.getPlacesToSuggest()
      } else if (this.type === "collections") {
        suggestions = this.getCollectionsToSuggest()
      }
      this.showExpandButton = suggestions.length > expandLimit
      return suggestions
          .sort((a, b) => {return  a.label.localeCompare(b.label)})
          .sort((a, b) => (a.originalObject.role_id > b.originalObject.role_id) ? -1 : 1)
          .sort((a, b) => (a.count > b.count) ? -1 : 1)
          .slice(0, maxElements)
    },
    getPersonsToSuggest() {
      if (this.allPersons.length){
        return [
          ...new Set([
            ...this.allPersons[0]['persons'],
            ...this.allPersons[1]['persons'],
            ...this.allPersons[2]['persons']
          ])
        ].map((item) => ({
          label: item.label, 
          count: item.count, 
          tag: item.role_id === 1 ? "EXP" : item.role_id === 2 ? "DES" : "CIT",
          originalObject: item
        }));
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
        ].map((item) => ({
          label: item.label, 
          count: item.count, 
          tag: item.role_id === 1 ? "EXP" : item.role_id === 2 ? "DES" : "CIT",
          originalObject: item
        }));
      } else {
        return []
      }
    },
    getCollectionsToSuggest() {
      return Object.values(this.collectionsTags)
      .filter((c) => c.resultsCount)
      .filter((c) => !this.selectedCollections.some((sc) => sc.id === c.id))
      .map((item) => ({
          label: item.title, 
          count: item.resultsCount,
          tag: null,
          originalObject: item
        }));
    },
    searchSuggestion(suggestion) {
      if (this.type === "persons") {
        this.selectPerson(suggestion.originalObject)
      } else if (this.type === "places") {
        this.selectPlace(suggestion.originalObject)
      } else if (this.type === "collections") {
        this.selectCollection(suggestion.originalObject)
      }
      this.performSearch()
    },
    selectPerson(person) {
      switch(person.role_id) {
        case 1:
          this.setSelectedPersonFrom([...this.selectedPersonFrom, person]);
          break;
        case 2:
          this.setSelectedPersonTo([...this.selectedPersonTo, person]);
          break;
        case 3:
          this.setSelectedPersonCited([...this.selectedPersonCited, person]);
          break;
      }
    },
    selectPlace(place) {
      switch(place.role_id) {
        case 1:
          this.setSelectedPlaceFrom([...this.selectedPlaceFrom, place]);
          break;
        case 2:
          this.setSelectedPlaceTo([...this.selectedPlaceTo, place]);
          break;
        case 3:
          this.setSelectedPlaceCited([...this.selectedPlaceCited, place]);
          break;
      }
    },
    selectCollection(collection) {
      this.setSelectedCollections([...this.selectedCollections, collection])
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
.suggestions-box-header-header-collections {
  background: url('../assets/images/icons/picto-collections.svg') center left no-repeat;
}
.tag-container {
  display: flex;
  align-items: center;
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
