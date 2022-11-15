<template>
  <span class="tags has-addons document-deletion">
    <!--
      Delete
    -->
    <a
      v-if="current_user.isAdmin"
      class="tag"
      @click="delete_documentId = docId"
    >Supprimer le document {{docId}}
      <icon-bin />
      </a>
    <modal-confirm-document-delete
      v-if="delete_documentId && current_user.isAdmin"
      :doc-id="delete_documentId"
      :cancel="cancelDocumentDelete"
      :submit="confirmDocumentDelete"
    />

  </span>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ModalConfirmDocumentDelete from "../forms/ModalConfirmDocumentDelete";
import IconBin from "@/components/ui/icons/IconBin";

export default {
  name: "DocumentDeletion",
  components: { IconBin, ModalConfirmDocumentDelete},
  props: {
    docId: { required: true, type: Number },
    withStatus: { required: true, type: Boolean, default: false },
  },
  data() {
    return {
      baseUrl: `${process.env.VUE_APP_APP_ROOT_URL}`,
      lockEditMode: false,
      status: null,
      delete_documentId: false,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("locks", ["lockOwner"]),
    ...mapGetters("document", ["getDocumentStatus"]),
  },
  watch: {
    async withStatus() {
      if (this.withStatus) {
        await this.fetchStatus();
      }
    },
  },
  async created() {
    if (this.withStatus) {
      await this.fetchStatus();
    }
  },
  methods: {
    async fetchStatus() {
      this.status = await this.getDocumentStatus(this.docId);
      console.log("status", this.docId, this.status);
    },
    confirmDocumentDelete(docId) {
        this.deleteDocument();
        this.cancelDocumentDelete();
    },
    cancelDocumentDelete() {
      this.delete_documentId = false;
    },
    /*addBookmark() {
      return this.$store
        .dispatch("bookmarks/postUserBookmark", {
          userId: this.current_user.id,
          docId: this.docId,
        })
        .then((resp) => {
          this.status.isBookmarked = true;
          return Promise.resolve(true);
        });
    },
    removeBookmark() {
      return this.$store
        .dispatch("bookmarks/deleteUserBookmark", {
          userId: this.current_user.id,
          docId: this.docId,
        })
        .then((resp) => {
          this.status.isBookmarked = false;
          return Promise.resolve(false);
        });
    },
    publishDocument() {
      return this.$store.dispatch("document/publish", this.docId).then((resp) => {
        this.status.isPublished = resp.attributes["is-published"];
        return Promise.resolve(true);
      });
    },
    unpublishDocument() {
      return this.$store.dispatch("document/unpublish", this.docId).then((resp) => {
        this.status.isPublished = resp.attributes["is-published"];
        return Promise.resolve(false);
      });
    },
    startLockEditor() {
      this.lockEditMode = true;
      return Promise.resolve(!!this.lockOwner[this.docId]);
    },
    async stopLockEditor() {
      this.lockEditMode = false;
      //this.status = await this.getPreview(this.docId);
      // TODO: mettre à jour l'affichage du lock
      console.warn("DocumentTagBar (lock): affichage du lock non mis à jour");
      return Promise.resolve(!!this.lockOwner[this.docId]);
    },*/
    async deleteDocument() {
      if (this.docId == this.docId) {
        await this.$store.dispatch("document/removeDocument", document);
        console.warn("DocumentTagBar (delete): suppression du document"+this.docId);
      }
    },
  },
};
</script>
