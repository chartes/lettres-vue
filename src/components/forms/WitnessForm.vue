<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <modal-form
    :title="title"
    :cancel="cancelAction"
    :submit="submitAction"
    :remove="remove"
    :valid="isValid"
    :submitting="false"
  >
    <loading-indicator :active="loading" />
    <div
      v-if="!loading"
      class="witness-form textinput-form"
    >
      <form @submit.prevent="">
        <div class="columns">
          <div class="column">
            <field-select
              v-model="form.status"
              label="Statut"
              :options="statusesList"
            />
          </div>
          <div class="column">
            <field-select
              v-model="form.tradition"
              label="Tradition"
              :options="traditionsList"
            />
          </div>
          <div class="column" />
        </div>
        
        <rich-text-editor
          v-model="form.content"
          label="Témoin *"
          :formats="[['italic','superscript'], ['note','link']] "
          :options="{placeholder: 'Ex. Bibl. nat. Fr., Français 3512, fol. 53r'}"
          :multiline="false"
        />
        
        <div style="margin-bottom: 1em;">
          <institution-list-form :witness="form" />
        </div>
        
        <rich-text-editor
          v-model="form['classification-mark']"
          label="Unité de conservation"
          :formats="[['italic','superscript'], ['link']]"
          :options="{placeholder: 'Ex. Français 3512, Ms. 564, K 35'}"
          :multiline="false"
        />
      </form>
    </div>
  </modal-form>
</template>

<script>
	
	import {mapActions, mapState} from 'vuex';
	import IconAdd from '../ui/icons/IconAdd';
	
	import ModalForm from './ModalForm';
	import FieldLabel from './fields/FieldLabel';
	import FieldSelect from './fields/SelectField';
	import FieldText from './fields/TextField';
	import { statuses, traditions } from './data';
	import RichTextEditor from './fields/RichTextEditor';
	import SelectAutocompleteField from './fields/SelectAutocompleteField';
	import LoadingIndicator from '../ui/LoadingIndicator';
	import InstitutionForm from './InstitutionForm';
	import LaunchButton from './LaunchButton';
	import IconBin from "../ui/icons/IconBin";
	import InstitutionListForm from "./InstitutionListForm";
	
	export default {
		name: "WitnessForm",
		components: {
			InstitutionListForm,
			LoadingIndicator,
			RichTextEditor,
			FieldSelect,
			ModalForm,
		},
		props: {
			title: { type: String, default: '' },
			label: { type: String, default: '' },
			witness: { type: Object, default: null },
			cancel: { type: Function },
			submit: { type: Function },
			remove: { type: Function },
		},
		data() {
			return {
				form: { ...this.$props.witness },
				loading: false
			}
		},
		watch: {
			currentWitness (val) {
				this.form = { ...val }
				this.loading = false
			},
			currentInstitution(val) {
				this.form.institution = val;
				this.loading = false
			}
		},
		mounted () {
			if (this.$props.witness.id) {
				this.$store.dispatch('witnesses/fetchOne', this.$props.witness.id)
				this.loading = true;
			}
		},
		methods: {
			submitAction () {
				if (this.isValid) {
          if (this.form.institution && this.form.institution.id === null) this.form.institution = null
          if (this.form.tradition === '') this.form.tradition = null;
          
          if (this.form.institution === null && !!this.currentWitness) {
            this.$store.dispatch('document/removeWitnessInstitution', this.currentWitness.id)
          }
          
          this.$props.submit(this.form);
				}
			},
			cancelAction () {
				this.$props.cancel();
			},
			removeAction () {
				this.$props.cancel();
			},
		},
		computed: {
			...mapState('witnesses', ['currentWitness']),
			...mapState('institutions', ['currentInstitution', 'institutionsSearchResults']),
			
			statusesList () {
				return statuses;
			},
			traditionsList () {
				return traditions;
			},
			isValid () {
				console.log(this.form)
				return !!(this.form.content && this.form.content.length >= 1 && this.form.content !== '<p><br></p>')
			}
			
		}
	}
</script>
