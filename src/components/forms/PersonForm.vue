<template>
  <modal-form
    class="person-form__add-new__form"
    :title="title"
    :cancel="cancelAction"
    :submit="submitAction"
    :remove="remove"
    :valid="validForm"
    :submitting="false"
  >
    <div class="person-form">
      <form @submit.prevent="">
        <error-message
          v-if="error"
          :error="error"
        />
        <field-text
          v-model="form.label"
          label="Étiquette *"
          placeholder="ex : Nom, Prénom"
        />
        <!--
        <field-text
                label="Fonction occupée"
                placeholder="ex : Duc d'Anjou, prince marchand, etc."
                v-model="form.func"
        />
        -->

        <div class="person-form__link-to-ref">
          <div class="columns">
            <div class="column is-5">
              <select-autocomplete-field
                v-model="form.ref"
                class="person-form__search-ref"
                label="Lier la personne via un référentiel"
                :items="personsWikidataSearchResults"
                :is-async="true"
                label-key="label"
                not-set="Rechercher sur wikidata"
                @search="searchPersonOnWikidata"
              />
            </div>
            <div class="column is-1 person-form__separator">
              <p><em>ou</em></p>
            </div>
            <div class="column is-5 person-form__input-ref">
              <field-text
                v-model="model"
                label="Lier la personne à un identifiant de référence"
                :placeholder="form.ref ? form.ref.label : 'ex: https://data.bnf.fr/ark:/12148/cb123351707'"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </modal-form>
</template>

<script>

  import { mapState } from 'vuex';

  import ModalForm from './ModalForm';
  import FieldText from './fields/TextField';
  import ErrorMessage from '../ui/ErrorMessage';
  import SelectAutocompleteField from "./fields/SelectAutocompleteField";

  export default {
    name: "PersonForm",
    components: {
      ErrorMessage,
      FieldText,
      ModalForm,
      SelectAutocompleteField
    },
    props: {
      title: { type: String, default: '' },
      label: { type: String, default: '' },
      institution: { type: Object, default: null },
      cancel: { type: Function },
      submit: { type: Function },
      remove: { type: Function },
      error: { type: Object, default: null },
    },
    data() {
      return {
        form: { ...this.$props.institution },
        loading: false,
      }
    },
    mounted () {

    },
    methods: {
  
      submitAction () {
        this.form.ref = this.form.ref && this.form.ref.uriForDisplay ? this.form.ref.uriForDisplay : this.form.ref;
        this.$props.submit(this.form);
      },
      cancelAction () {
        this.$props.cancel();
      },
      removeAction () {
        this.$props.cancel();
      },
      searchPersonOnWikidata(who) {
          return this.$store.dispatch('persons/searchOnWikidata', who);
      }

    },
    computed: {

      ...mapState('persons', ['roles', 'personsWikidataSearchResults']),

      validForm () {
        return (
          !!this.form.label && (this.form.label.length >= 1)
        );
      },
      model() {
         return this.form.ref && this.form.ref.uriForDisplay ? this.form.ref.uriForDisplay : this.form.ref
      }
    }
  }
</script>
