<template>
  <div class="field field-select-autocomplete">
    <field-label
      :label="label"
      :add-colons="label.length !== 0"
    />

    <div class="field-select-autocomplete__wrapper">
      <div class="control">
        <a
          class="field-select-autocomplete__value"
          @click.prevent="openSearchBox"
        >
          {{ labelString(value) }}
        </a>
      </div>


      <div
        v-show="isOpen"
        class="field-select-autocomplete__searchbox"
      >
        <div class="field-select-autocomplete__search">
          <span
            class="control"
            :class="{ 'is-loading': isLoading }"
          >
            <input
              ref="searchInput"
              v-model="search"
              class="input is-search"
              placeholder="Rechercher"
              type="text"
              @input="onChange"
              @keydown.down="onArrowDown"
              @keydown.up="onArrowUp"
              @keydown.enter="onEnter"
              @keydown.capture.esc="closeSearchBox"
            >
            <slot name="inputActions" />
          </span>
        </div>
  
        <div class="field-select-autocomplete__results">
          <ul class="field-select-autocomplete__items">
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
              class="field-select-autocomplete__item"
              :class="{ 'is-active': i === arrowCounter }"
              @click="setResult(result)"
            >
              {{ labelString(result) }}
            </li>
          </ul>
        </div>

        <div
          v-if="slotNotEmpty"
          class="field-select-autocomplete__footer"
        >
          <slot />
        </div>
      </div>
      
      <slot name="outputActions" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import FieldLabel from './FieldLabel';
  import LoadingIndicator from '../../ui/LoadingIndicator';
  export default {
    name: 'SelectAutocompleteField',
    components: {LoadingIndicator, FieldLabel},
    props: {
      value: {},
      label: { type: String, default: '' },
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
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
      }
    },

    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        isLoading: false,
        arrowCounter: 0,
      };
    },
    computed: {
      slotNotEmpty () {
        return !!this.$slots.default;
      },
    },
    watch: {
      items: function (val, oldValue) {
        // actually compare the
        if (val) {
	        if ((val.length !== oldValue.length) || (val.length === 0)) {
		        this.results = val;
		        this.isLoading = false;
		        this.isOpen = true;
	        }
        }
      },
    },

    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },

    methods: {
      onChange() {

        this.loading = true
        this.$emit('search', this.search);

        if (this.isAsync) {
          this.isLoading = true;
        } else {
          this.filterResults();
          this.isOpen = true;
        }
      },

      filterResults() {
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      },
      setResult(result) {
        this.$emit('input', result);
        this.closeSearchBox();
      },
      onArrowDown(evt) {
        this.arrowCounter = (this.arrowCounter + 1) % this.results.length;
      },
      onArrowUp() {
        this.arrowCounter = (this.arrowCounter + this.results.length - 1) % this.results.length;
      },
      onEnter() {
        this.setResult(this.results[this.arrowCounter]);
        this.closeSearchBox()
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.closeSearchBox()
        }
      },
      openSearchBox () {
        this.search = '';
        this.isOpen = true;
        Vue.nextTick(() => {
          this.$refs.searchInput.focus()
        })
      },
      closeSearchBox () {
        this.isOpen = false;
        this.arrowCounter = -1;
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
