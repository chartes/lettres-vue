<template>
  <div class="component">
    <multiselect-field
      class="languages is-pulled-right"
      :editable="editable"
      :options-list="allLanguages"
      :selected-items="languages"
      :on-change="languagesChanged"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MultiselectField from "../forms/fields/MultiselectField";

export default {
  name: "DocumentLanguages",
  components: { MultiselectField },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("document", ["document", "languages"]),
    ...mapState({
      allLanguages: (state) => state.languages.languages,
    }),
  },
  methods: {
    languagesChanged(langs) {
      const data = {
        id: this.document.id,
        relationships: {
          languages: {
            data: langs.map((l) => {
              return {
                id: l.id,
                type: "language",
              };
            }),
          },
        },
      };

      this.$store.dispatch("document/save", data);
      console.log("lang data", data);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.component {
  align-self: center;
}
</style>
