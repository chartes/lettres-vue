<template>
  <div>
    <section>
      <b-field>
        <rich-text-editor
          v-model="title"
          :multiline="false"
          :formats="[['italic', 'superscript', 'note']]"
          :options="{ placeholder: 'Ex. Français 3512, Ms. 564, K 35' }"
        />
      </b-field>
      <b-button
        type="is-primary"
        label="Créer le document"
        @click="createNewDocument"
        :loading="loading"
      />
    </section>
  </div>
</template>

<script>
import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";
import { mapState } from "vuex";

export default {
  name: "DocumentCreationPage",
  components: { RichTextEditor },
  data() {
    return {
      title: "Ceci est le titre du nouveau document",
      loading: false,
    };
  },
  computed: {
    ...mapState("document", ["document", "documentLoading"]),
  },
  methods: {
    async createNewDocument() {
      this.loading = true;
      const defaultData = {
        attributes: {
          title: this.title,
        },
        relationships: {
          collections: {
            data: [
              {
                type: "collection",
                id: 1, // TODO
              },
            ],
          },
        },
      };
      await this.$store.dispatch("document/initializeDummyDocument", defaultData);
      console.log("submitting", this.document);
      const doc = await this.$store.dispatch("document/add");
      console.log("document added !", doc);
      this.$router.push({ name: "document", params: { docId: doc.id } });
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
