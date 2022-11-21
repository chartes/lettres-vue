<template>
  <div>
    <section>
      <b-field>
        <rich-text-editor
          v-model="title"
          :multiline="false"
          :formats="[['italic', 'superscript', 'note']]"
          :options="{ placeholder: 'Titre de la collection' }"
        />
      </b-field>
      {{ error.title }}
      <b-field>
        <rich-text-editor
          v-model="description"
          :multiline="true"
          :formats="[['italic', 'superscript', 'note']]"
          :options="{ placeholder: 'Description de la collection' }"
        />
      </b-field>
      <b-button
        type="is-primary"
        label="Créer la collection"
        :loading="loading"
        @click="createNewCollection"
      />
    </section>
  </div>
</template>
<script>
import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";

export default {
  name: "CollectionCreationPage",
  props: ["collectionId"],
  components: { RichTextEditor },
  data() {
    return {
      title: "",
      description: "",
      loading: false,
      error: {},
    }
  },
  methods: {
    async createNewCollection() {
      this.loading = true;
      if (this.title.length < 1) {
        this.error = {"title": "titre obligatoire"};
        this.loading = false;
        return;
      }
      const collection = {
        title: this.title,
        description: this.description,
        parentId: this.collectionId
      };
      console.log("submitting", collection);
      const newCollection = await this.$store.dispatch("collections/addCollection", collection);
      console.log("created collection", newCollection)
      this.loading = false;
      this.$router.push({ name: "collection", params: {collectionId: newCollection.id}});
    }
  }
};


</script>
