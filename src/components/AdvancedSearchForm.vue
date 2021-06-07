<template>
  <section class="">
    <span
      class="close-form"
      @click="hideAdvancedSearchForm"
    >
      <i
        class="far fa-times-circle"
      />
    </span>
    <div class="section grid-container">
      <search-box
        v-if="!showLeftSideBar"
        class="mt-5 mb-2"
      />

      <p>Formulaire de recherche avancée (en cours de développement)</p>

      <div class="with-status">
        <b-field>
          <b-checkbox v-model="showStatuses">
            Afficher les badges
          </b-checkbox>
        </b-field>
      </div>

      <div class="field date-slider">
        <span class="label">Date de rédaction</span>
        <b-field>
          <b-slider
            v-model="creationDateSelection"
            tooltip-always
            size="is-medium"
            :min="1300"
            :max="1600"
          >
            <template v-for="val in [1300, 1400, 1500, 1600]">
              <b-slider-tick
                :key="val"
                :value="val"
              >
                {{ val }}
              </b-slider-tick>
            </template>
          </b-slider>
        </b-field>
      </div>

      <div class="field">
        <div class="field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select name="country">
                <option value="Argentina">
                  Argentina
                </option>
                <option value="Bolivia">
                  Bolivia
                </option>
                <option value="Brazil">
                  Brazil
                </option>
                <option value="Chile">
                  Chile
                </option>
                <option value="Colombia">
                  Colombia
                </option>
                <option value="Ecuador">
                  Ecuador
                </option>
                <option value="Guyana">
                  Guyana
                </option>
                <option value="Paraguay">
                  Paraguay
                </option>
                <option value="Peru">
                  Peru
                </option>
                <option value="Suriname">
                  Suriname
                </option>
                <option value="Uruguay">
                  Uruguay
                </option>
                <option value="Venezuela">
                  Venezuela
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <button
              type="submit"
              class="button is-primary"
            >
              Choose
            </button>
          </div>
        </div>
      </div>
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
        return {
          creationDateSelection: [1370, 1415],
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
      }
    },
    created() {
     
    },
    methods: {
      ...mapActions('search', ['performSearch', 'setWithStatus']),
      ...mapActions('layout', ['hideAdvancedSearchForm']),
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

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

.with-status {
  margin-top: 30px;
  .checkbox {
    display: inline-flex;
  }
}

.date-slider {
    margin-top: 16px;
    margin-bottom: 40px !important;
    .label {
      margin-bottom: 50px;
    }
   .field {
      margin-left: 20px;
      margin-right: 10px;
   }
}

</style>