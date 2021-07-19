<template>
  <div class="document-title__component">
    <header v-if="!preview">
      <!-- <span class="heading">Titre</span> -->

      <title-field-in-place
        :tabulation-index="0"
        label="Titre"
        name="title"
        not-set="Non renseigné"
        :initial-value="document.title"
        :editable="editable"
        :status="titleStatus"
        specific-class="field-title__input"
        @changed="titleChanged"
      />
    </header>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TitleFieldInPlace from "../forms/fields/TitleFieldInPlace";

export default {
  name: "DocumentTitle",
  components: { TitleFieldInPlace },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    editAttributes: {
      type: Boolean,
      default: true,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      titleStatus: "normal",
    };
  },
  methods: {
    titleChanged(fieldProps) {
      const data = { id: this.document.id, attributes: {} };
      data.attributes[fieldProps.name] = fieldProps.value;
      this.titleSetStatusNormal();
      this.$store
        .dispatch("document/save", data)
        .then((response) => {
          this.titleSetStatusSuccess();
          setTimeout(this.titleSetStatusNormal, 3000);
        })
        .catch(() => {
          this.titleSetStatusError();
          setTimeout(this.titleSetStatusNormal, 3000);
        });
    },
    titleSetStatusNormal() {
      this.titleStatus = "normal";
    },
    titleSetStatusSuccess() {
      this.titleStatus = "success";
    },
    titleSetStatusError() {
      this.titleStatus = "error";
    },
  },
  computed: {
    ...mapState("document", ["document"]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document-title__component {
  color: #444;
}
</style>
