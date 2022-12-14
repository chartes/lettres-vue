<template>
  <div v-if="current_user.isAdmin">
    <section>
      <b-field>
        <rich-text-editor
          v-model="title"
          :multiline="false"
          :formats="[['italic', 'superscript', 'note']]"
          :options="{ placeholder: 'Titre de la collection' }"
        />
      </b-field>
      <b-field>
        <rich-text-editor
          v-model="description"
          :multiline="true"
          :formats="[['italic', 'superscript', 'note']]"
          :options="{ placeholder: 'Description de la collection' }"
        />
      </b-field>
      <b-field label="Curator">
        <select
          v-model="curatorId"
        >
         <option v-for="option in users.filter((u) => u.isAdmin === true)" :value="option.id" :key="option.id">
           {{ option.username }}
         </option>
        </select>
      </b-field>
      <div>
      {{ error.title }}
      </div>
      <b-button
        type="is-primary"
        label="Créer la collection"
        :loading="loading"
        @click="createNewCollection"
      />
    </section>
  </div>
  <div v-else>
    <section>
      Page réservée aux administrateurs du site.
    </section>
  </div>
</template>
<script>
import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "CollectionCreationPage",
  props: ["collectionId"],
  components: { RichTextEditor },
  data() {
    return {
      title: "",
      description: "",
      loading: false,
      curatorId: null,
      error: {},
    }
  },
  computed: {
    ...mapState("user", ["current_user", "users"]),
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    ...mapActions("user", ["fetchUsers"]),
    async createNewCollection() {
      this.loading = true;
      if (this.title.length < 1) {
        this.error = {"title": "titre obligatoire"};
        this.loading = false;
        return;
      }
      if (this.curatorId === null) {
        this.error = {"title": "curator obligatoire"};
        this.loading = false;
        return;
      }
      const collection = {
        title: this.title,
        description: this.description,
        parentId: this.collectionId,
        curatorId: this.curatorId
      };
      console.log("submitting", collection);
      const newCollection = await this.$store.dispatch("collections/addCollection", collection);
      if (newCollection.error) {
        if (newCollection.error.response.data) {
          this.error = {"title": newCollection.error.response.data["errors"]["title"]};
        }
        else {
          this.error = {"title": newCollection.error};
        }
        this.loading = false;
        return;
      }
      console.log("created collection", newCollection)
      this.loading = false;
      this.$router.push({ name: "collection", params: {collectionId: newCollection.id}});
    }
  }
};


</script>
