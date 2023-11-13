<template>
  <div class="suggestions-box-header-container">
    <div class="row is-flex is-justify-content-space-between suggestions-box-header-header my-1">
      <span class="advanced_search_header m-2">CORRESPONDANTS FRÉQUENTS</span>
    </div>
    <div class="row is-flex-direction-column">
      <div
        v-for="person in sortSuggestions()"
        :key="person.label + person.role_id"
        class="row is-flex is-justify-content-space-between suggestions-box-header-persons my-2"
      >
        <div
          class="tag-container"
          @click="searchSuggestion(person)"
        >
          <span class="tag-flag">
            {{ person.role_id === 1 ? "EXP" : person.role_id === 2 ? "DEST" : "CIT" }}
          </span>
          <span class="tag-label">
            {{ person.label }}
          </span>
          <span class="tag-count">
            {{ person.count }}
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
        return ['persons'].includes(value)
      }
    }
  },
  data() {
    return {
      showMore: false,
    };
  },
  computed: {
    ...mapState("persons", {allPersons: "persons_roles"}),
    ...mapState("search", [
      "selectedPersonFrom",
      "selectedPersonTo",
      "selectedPersonCited",
      "selectedPlaceFrom",
      "selectedPlaceTo",
      "selectedPlaceCited"
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
      "resetSearchState",
      "performSearch"
    ]),
    sortSuggestions() {
      if (this.allPersons.length >= 3) {
        const personsSuggestions = [...new Set([...this.allPersons[0]['persons'] ,...this.allPersons[1]['persons'], ...this.allPersons[2]['persons']])];
        const sortedPersonsSuggestions = personsSuggestions.sort((person_x, person_y) => (person_x.count > person_y.count) ? -1 : 1)
        console.log("personsSuggestions in SUGGESTIONS compo", personsSuggestions);
        if (this.showMore) {
          return sortedPersonsSuggestions.slice(0, 20)
        } else {
          return sortedPersonsSuggestions.slice(0, 5)
        }
      } else {
        return []
      }

    },
    searchSuggestion (person) {
      console.log("searchSuggestion : ", person)
      if (person.role_id === 1) {
        this.resetSearchState();
        this.setSelectedPersonFrom([person]);
      }
      if (person.role_id === 2) {
        this.resetSearchState();
        this.setSelectedPersonTo([person]);
      }
      if (person.role_id === 3) {
        this.resetSearchState();
        this.setSelectedPersonCited([person]);
      }
      this.performSearch()
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
.suggestions-box-header-header {
  padding-left: 30px;
  background: url('../assets/images/icons/picto-personnes.svg') center left no-repeat;
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
