<template>
  <div
    v-if="hasOptions"
    class="field field-select"
  >
    <p class="control">
      <field-label :label="label" />
      <span
        class="select"
        :class="isLoading"
      >
        <select
          ref="field"
          @change="updateValue"
        >
          <option
            v-for="opt in options"
            :key="opt.id"
            :value="opt.id"
            :selected="opt.id === value"
            v-html="opt.label"
          />
        </select>
      </span>
    </p>
  </div>
</template>

<script>
  import FieldLabel from './FieldLabel';
  export default {
    name: "FieldSelect",
      components: {FieldLabel},
      props: {
      options: {
        type: Array
      },
      label: {
        type: String
      },
      value: {},
    },
    data() {
      return {
        //val: this.$props.value || this.$props.options[0].id
      }
    },
    computed: {
      hasOptions () {
        return this.options && this.options.length > 0;
      },
      isLoading () {
        return !(this.options && this.options.length > 0) ? 'is-loading': false;
      },
    },
    mounted () {
      console.log("SelectField mounted", this.$refs.field.value)
      this.updateValue()
    },
    methods: {
      updateValue () {
        console.log("SelectField updateValue", this.$refs.field.value)
        this.$emit('input', this.$refs.field.value)
      },
    }
  }
</script>