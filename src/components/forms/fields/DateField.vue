<template>
  <div class="field-date">
    <div v-if="editable && editMode" ref="hover" class="field field-date__field">
      <div class="control">
        <input
          ref="input"
          v-model="value"
          v-mask="{
            mask: '(9999)|(9999-99)|(9999-99-99)',
            placeholder: 'AAAA-MM-JJ',
            greedy: false,
          }"
          class="field-date__input"
          type="text"
          @change="inputChanged"
          @keyup="maskCheck"
          @keyup.enter="checkAndExitEditMode"
          @blur="checkAndExitEditMode"
          @keyup.esc="cancelInput"
        />
      </div>
    </div>

    <div
      v-else-if="editable && !editMode"
      ref="hover"
      class="field"
      :tabindex="tabulationIndex"
      @click="enterEditMode"
      @focus="enterEditMode"
      @mouseover="overField"
      @mouseout="outField"
    >
      <div class="control">
        <span
          class="field-date__input field-date__input--fake"
          :class="fieldClasses"
          v-html="value || notSet"
        />
        <icon-pen-edit class="field-date__icon" />
      </div>
    </div>

    <div v-else>
      <span :class="unknownClass" v-html="value || notSet" />
    </div>
  </div>
</template>

<script>
import IconPenEdit from "../../ui/icons/IconPenEdit";
import TextFieldMixins from "./TextFieldMixins";
export default {
  name: "DateField",
  components: { IconPenEdit },
  mixins: [TextFieldMixins],
  data() {
    return {
      isValid: true,
    };
  },
  computed: {
    fieldClasses() {
      return {
        ...this.unknownClass,
        "field-text--invalid": !this.isValid,
      };
    },
  },
  methods: {
    maskCheck: function (field) {
      const isValidDate = !!Date.parse(this.value);
      this.isValid = !this.value || (field.target.inputmask.isComplete() && isValidDate);
    },
    checkAndExitEditMode() {
      this.exitEditMode(!this.isValid);
    },
  },
};
</script>
