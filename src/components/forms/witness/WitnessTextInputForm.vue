<template>
  <div>
    <div class="editor">
      <rich-text-editor
        v-model="witnessTextContent"
        label="Témoin *"
        :formats="[['italic','superscript'], ['note','link']] "
        :options="{placeholder: 'Ex. Bibl. nat. Fr., Français 3512, fol. 53r'}"
        :multiline="false"
      />
    </div>
    <div class="editor">        
      <rich-text-editor
        v-model="classificationMark"
        label="Cote / unité de conservation"
        :formats="[['italic','superscript'], ['link']]"
        :options="{placeholder: 'Ex. Français 3512, Ms. 564, K 35'}"
        :multiline="false"
      />
    </div>
  </div>
</template>

<script>

import RichTextEditor from '@/components/forms/fields/RichTextEditor';

export default {
  name: "WitnessTestInputForm",
  components: {
      RichTextEditor
  },
  data() {
      return {
          classificationMark: '',
          witnessTextContent: ''
      }
  }
};
</script>

<style lang="scss" scoped>
    .editor {
        margin-bottom: 40px;
    }
</style>