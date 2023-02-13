<template>
  <span class="tags has-addons collection-deletion">
    <!--
      Delete
    -->
    <a
      class="button is-primary"
      :class="deleting === 'loading' ? 'is-loading' : ''"
      @click.stop="collectionIdToBeDeleted = collectionId"
    >
      <delete-button-icon :status="deleting === 'error' ? 'error' : deleting === 'normal' ? 'normal' : ''" />
    </a>
    <modal-confirm-collection-delete
      v-if="collectionIdToBeDeleted && current_user.isAdmin"
      :collection-id="collectionIdToBeDeleted"
      :cancel="cancelCollectionDelete"
      :submit="confirmCollectionDelete"
    />

  </span>
</template>

<script>
import {mapActions, mapState} from "vuex";
import DeleteButtonIcon from "@/components/ui/DeleteButtonIcon";//added from Carine
import ModalConfirmCollectionDelete from "@/components/forms/ModalConfirmCollectionDelete.vue";

export default {
  name: "CollectionDeletion",
  components: {ModalConfirmCollectionDelete, DeleteButtonIcon},
  props: {
    collectionId: { required: true, type: Number },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      collectionIdToBeDeleted: null,
      deleting: "normal",
      curatorId: null,
      error: {},
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    editMode() {
      return (
        this.editable &&
        this.current_user &&
        this.current_user.isAdmin
      );
    },
  },

  methods: {
    ...mapActions("collections", ["fetchOne", "deleteCollection"]),
    ...mapActions("user", ["fetchUsers"]),

    confirmCollectionDelete() {
        this.deleteCollectionUI();
        this.cancelCollectionDelete();
    },
    cancelCollectionDelete() {
      this.collectionIdToBeDeleted = null;
    },
    async deleteCollectionUI() {
      this.deleting = "loading";
      const resp = await this.deleteCollection({
        id: this.collectionId,
      });
      if (resp.error) {
        this.deleting = "error";
        console.warn("failed to delete collection", this.collectionId, resp.error);
      }
      else {
        console.warn("Collection Delete (Modal): suppression de la collection : ",this.collectionId, resp);
        this.deleting = "normal";
        this.$router.push({ name: "collections" });
      }
    },

  },
};
</script>
