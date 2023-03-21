<template>
  <div class="component">
    <b-field label="Langues">
      <b-taginput
        v-if="editable"
        v-model="tags"
        placeholder="Français"
        :data="filteredTags"
        :readonly="!editable"
        autocomplete
        field="label"
        open-on-focus
        @typing="getFilteredTags"
      />
      <div v-else>
        <b-taglist>
          <b-tag
            v-for="tag in tags"
            :key="tag.id"
            type="is-light"
          >
            {{ tag.label }}
          </b-tag>
        </b-taglist>
      </div>
    </b-field>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DocumentLanguages",
  components: {},
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filteredTags: [],
      tags: [],
      init: false,
    };
  },
  computed: {
    ...mapState("document", ["document", "languages"]),
    ...mapState({
      allLanguages: (state) => state.languages.languages,
    }),
  },
  watch: {
    tags() {
      if (this.init) {
        const data = {
          id: this.document.id,
          relationships: {
            languages: {
              data: this.tags.map((l) => {
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
      } else {
        this.init = true;
      }
    },
  },
  created() {
    this.filteredTags = this.allLanguages;
    this.tags = this.languages;
  },
  methods: {
    getFilteredTags(text) {
      this.filteredTags = this.allLanguages.filter((option) => {
        return option.label.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0;
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.component {
  align-self: center;
  padding-left: 16px;
  border-left: 1px solid $coffee;
}
</style>
