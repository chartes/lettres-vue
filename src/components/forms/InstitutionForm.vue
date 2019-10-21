<template>
  <modal-form
    class="institution-form__add-new__form"
    :title="title"
    :cancel="cancelAction"
    :submit="submitAction"
    :remove="remove"
    :valid="validForm"
    :submitting="false"
  >
    <div class="institution-form">
      <form @submit.prevent="">
        <error-message
          v-if="error"
          :error="error"
        />
        <field-text
          v-model="form.name"
          label="Nom *"
          placeholder="ex : BnF"
        />
        <div class="institution-form__link-to-ref">
          <div class="columns">
            <div class="column is-5">
              <select-autocomplete-field
                v-model="form.ref"
                class="institution-form__search-ref"
                label="Trouver l'institution via un référentiel"
                :items="institutionsWikidataSearchResults"
                :is-async="true"
                label-key="name"
                not-set="Rechercher sur wikidata"
                @search="searchInstitutionsOnWikidata"
              />
            </div>
            <div class="column is-1 institution-form__separator">
              <p><em>ou</em></p>
            </div>
            <div class="column is-5 institution-form__input-ref">
              <field-text
                v-model="model"
                label="Lier l'institution à un identifiant de référence"
                :placeholder="form.ref ? form.ref.name : 'ex: https://data.bnf.fr/ark:/12148/cb123351707'"
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
    name: "InstitutionForm",
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
        if (this.$props.submit) {
          this.$props.submit(this.form);
          this.$props.cancel();
        }
      },
      cancelAction () {
        this.$props.cancel();
      },
      removeAction () {
        this.$props.cancel();
      },
      searchInstitutionsOnWikidata(who) {
          return this.$store.dispatch('institutions/searchOnWikidata', who);
      }

    },
    computed: {

      ...mapState('institutions', ['institutionsWikidataSearchResults']),

      validForm () {
        return (
          !!this.form.name && (this.form.name.length >= 1)
        );
      },
      
      model() {
         return this.form.ref && this.form.ref.uriForDisplay ? this.form.ref.uriForDisplay : this.form.ref
      }

    }
  }
</script>
