<template>
  <div class="field field-list-autocomplete">
    <field-label
      v-if="label"
      :label="label"
    />

    <div class="field-list-autocomplete__wrapper">
      <div class="field-list-autocomplete__searchbox">
        <div class="field-list-autocomplete__search">
          <div
            class="control"
            :class="{ 'is-loading': isLoading }"
          >
            <input
              ref="searchInput"
              v-model="search"
              class="input is-search"
              :placeholder="searchPlaceholder"
              type="text"
              @input="onChange"
              @keydown.down="onArrowDown"
              @keydown.up="onArrowUp"
              @keydown.enter="onEnter"
            >
          </div>
        </div>

        <div class="field-list-autocomplete__results">
          <ul class="field-list-autocomplete__items">
            <li
              v-if="isLoading"
              class="loading"
            >
              <loading-indicator :active="true" />
            </li>
            <li
              v-for="(result, i) in results"
              v-else
              :key="i"
              class="field-list-autocomplete__item"
              :class="{ 'is-active': i === arrowCounter }"
              @click="setResult(result)"
            >
              {{ labelString(result) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import FieldLabel from './FieldLabel';
  import LoadingIndicator from '../../ui/LoadingIndicator';
  export default {
    name: 'ListAutocompleteField',
    components: {LoadingIndicator, FieldLabel},
    props: {
      value: {},
      label: { type: String, default: '' },
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      valueKey: {
        type: String,
        default: 'id'
      },
      labelKey: {
        type: String,
        default: 'label'
      },
      notSet: {
        type: String,
        default: 'Non renseigné'
      },
      searchPlaceholder: {
        type: String,
        default: 'Rechercher'
      }
    },

    data() {
      return {
        results: [],
        search: '',
        isLoading: false,
        arrowCounter: -1,
      };
    },
    computed: {
      slotNotEmpty () {
        return !!this.$slots.default;
      },
    },
    watch: {
      items: function (val, oldValue) {
        if (val !== oldValue) {
          this.arrowCounter = -1;
          this.results = val;
          this.isLoading = false;
        }
      },
    },

    methods: {
      onChange() {

        this.loading = true
        this.$emit('search', this.search);

        this.isLoading = true;
      },

      filterResults() {
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      },
      setResult(result) {
        this.$emit('input', result);
      },
      onArrowDown() {
        if (this.results.length) this.arrowCounter = (this.arrowCounter + 1) % this.results.length;
      },
      onArrowUp() {
        if (this.results.length) this.arrowCounter = (this.arrowCounter + this.results.length - 1) % this.results.length;
      },
      onEnter() {
        if (this.results.length) this.setResult(this.results[this.arrowCounter]);
      },
      labelString (val) {
        if (!val) return this.notSet
        return val[this.labelKey] || this.notSet
      },
    }
  };
</script>

<style>
</style>