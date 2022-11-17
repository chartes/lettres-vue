<template>
  <span class="tags has-addons document-deletion">
    <!--
      Delete
    -->
    <a
      v-if="current_user.isAdmin"
      class="tag"
      @click="documentIdToBeDeleted = docId"
    >Supprimer le document {{docId}}
      <icon-bin />
      </a>
    <modal-confirm-document-delete
      v-if="documentIdToBeDeleted && current_user.isAdmin"
      :doc-id="documentIdToBeDeleted"
      :cancel="cancelDocumentDelete"
      :submit="confirmDocumentDelete"
    />

  </span>
</template>

<script>
import { mapState } from "vuex";
import ModalConfirmDocumentDelete from "../forms/ModalConfirmDocumentDelete";
import IconBin from "@/components/ui/icons/IconBin";

export default {
  name: "DocumentDeletion",
  components: { IconBin, ModalConfirmDocumentDelete},
  props: {
    docId: { required: true, type: Number },
  },
  data() {
    return {
      documentIdToBeDeleted: null,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
  },
  watch: {

  },
  async created() {

  },
  methods: {

    confirmDocumentDelete() {
        this.deleteDocument();
        this.cancelDocumentDelete();
    },
    cancelDocumentDelete() {
      this.documentIdToBeDeleted = null;
    },

    async deleteDocument() {
        const response = await this.$store.dispatch("document/delete", this.docId);
        if (response.status === 204) {
          await this.$router.push({name: "home"});
        }
        console.warn("DocumentTagBar (delete): suppression du document : ",this.docId,response);

    },
  },
};
</script>
