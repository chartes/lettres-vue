<template>
  <span class="tags has-addons collection-deletion">
    <!--
      Delete
    -->
    <a
      class="delete-collection-btn button is-primary"
      :class="deleting === 'loading' ? 'is-loading' : ''"
      @click.stop="collectionIdToBeDeleted = collectionId; collectionTitleToBeDeleted = collectionTitle "
    >
      <delete-button-icon :status="deleting === 'error' ? 'error' : deleting === 'normal' ? 'normal' : ''" />
    </a>
    <modal-confirm-collection-delete
      v-if="collectionIdToBeDeleted && current_user.isAdmin"
      :collection-id="collectionIdToBeDeleted"
      :collection-title="collectionTitleToBeDeleted"
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
    collectionTitle: { type: String, required: true},
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      collectionIdToBeDeleted: null,
      collectionTitleToBeDeleted: null,
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
      this.collectionTitleToBeDeleted = null;
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

<style scoped  lang="scss">
@import "@/assets/sass/main.scss";

.delete-collection-btn.button.is-primary {
  display: inline-block;
  width: 38px;
  max-width: unset;
  max-height: unset;
  height: 38px;
  background: url(../assets/images/icons/bouton_supprimer.svg) center / 38px auto no-repeat !important;
  border-radius: 0!important;
  border: none !important;

  .icon {
    display: none;
  }
}

::v-deep {

  .modal-card {

    @include on-small-tablet {
      width: 80% !important;
      min-width: auto !important;
      margin: 0;
    }

    @include on-small-mobile {
      width: 90% !important;
    }

    .modal-card-head {
      margin-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .modal-card-body {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}

</style>
