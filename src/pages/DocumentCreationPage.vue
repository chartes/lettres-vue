<template>
  <div>
    <page-title :title="'Créer un nouveau document'" />
    <section>
      <b-field :label="'Renseigner le titre du document'">
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
        :loading="loading"
        @click="createNewDocument"
      />
    </section>
  </div>
</template>

<script>
import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";
import { mapState, mapActions } from "vuex";
import PageTitle from "@/components/ui/PageTitle";

export default {
  name: "DocumentCreationPage",
  components: {
    RichTextEditor,
    PageTitle,
  },
  data() {
    return {
      title: "Ceci est le titre du nouveau document",
      loading: false,
      defaultTitle: `${process.env.VUE_APP_UNSORTED_DOCUMENTS_COLLECTION_TITLE}`
    };
  },
  computed: {
    ...mapState("document", ["document", "documentLoading"]),
    ...mapState("collections", ["collectionsById"])
  },
  methods: {
    ...mapActions("collections", ["fetchAll"]),
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
                //from envir variables id: Object.values(this.collectionsById).filter((col) => col.title === process.env.VUE_APP_UNSORTED_DOCUMENTS_COLLECTION_TITLE)[0].id,
                id: Object.values(this.collectionsById).filter((col) => col.title === "Hors collections")[0].id,
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
  created(){
    this.fetchAll();
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
