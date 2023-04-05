<template>
  <span class="tags has-addons document-tag-bar">
    <router-link
      :to="{ name: 'document', params: { docId } }"
      class="tag document-status-card__doc-tag"
    >
      <span
        v-if="!preview"
        class="document-id"
      >
        LETTRE {{ docId }}
      </span>
      <span
        v-else
        class="document-id"
      >{{ docId }}
      </span>
    </router-link>

    <!--
      Published
    -->
    <badge
      v-if="withStatus && current_user && status"
      class="tag publish-tag"
      classes-active="is-published tag"
      classes-inactive=""
      :action-when-on="publishDocument"
      :action-when-off="unpublishDocument"
      :starts-on="status.isPublished"
    >
      <template #active>
        <a><i class="fas fa-check-circle" /></a>
      </template>
      <template #inactive>
        <a><i class="far fa-check-circle" /></a>
      </template>
    </badge>

    <!--
      Bookmark
    -->
    <badge
      v-if="withStatus && current_user && status"
      class="tag bookmark-tag"
      classes-active="is-bookmarked tag"
      classes-inactive=""
      :action-when-on="addBookmark"
      :action-when-off="removeBookmark"
      :starts-on="status.isBookmarked"
    >
      <template #active>
        <a><i class="fas fa-bookmark" /></a>
      </template>
      <template #inactive>
        <a><i class="far fa-bookmark" /></a>
      </template>
    </badge>

    <!--
      Lock
    -->
    <badge
      v-if="withStatus && current_user && status"
      class="tag lock-tag"
      classes-active="is-locked tag"
      classes-inactive=""
      :action-when-on="startLockEditor"
      :action-when-off="startLockEditor"
      :starts-on="status.currentLock['is-active']"
    >
      <template #active>
        <a><i class="fas fa-lock" /></a>
      </template>
      <template #activeLabel>
        <span
          v-if="$route.name === 'document' && lockOwner[docId]"
          class="badge-label"
        >{{ lockOwner[docId].attributes.username }}
        </span>
      </template>
      <template #inactive>
        <a><i class="fas fa-unlock" /></a>
      </template>
    </badge>

    <lock-form
      v-if="withStatus && lockEditMode && status"
      :doc-id="docId"
      :current-lock="status.currentLock"
      :cancel="stopLockEditor"
      :submit="stopLockEditor"
    />
  </span>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Badge from "../ui/Badge";
import LockForm from "../forms/LockForm";

export default {
  name: "DocumentTagBar",
  components: { Badge, LockForm },
  props: {
    docId: { required: true, type: Number },
    withStatus: { required: true, type: Boolean, default: false },
    preview: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      baseUrl: `${process.env.VUE_APP_APP_ROOT_URL}`,
      lockEditMode: false,
      status: null,
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
    }
  },
  async created() {
    if (this.withStatus) {
      await this.fetchStatus();
      await this.fetchData();
    }

  },
  methods: {
        ...mapActions("locks", ["fetchLockOwner"]),
    async fetchStatus() {
      this.status = await this.getDocumentStatus(this.docId);
      console.log("status", this.docId, this.status);
    },
    async fetchData() {
      if (this.status.currentLock.id) {
        this.$store.state.lockOwner = await this.fetchLockOwner({
        docId: this.docId,
        lockId: this.status.currentLock.id
        })
      }
    },
    addBookmark() {
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
        this.status.isPublished = true;
        return Promise.resolve(true);
      });
    },
    unpublishDocument() {
      return this.$store.dispatch("document/unpublish", this.docId).then((resp) => {
        this.status.isPublished = false;
        return Promise.resolve(false);
      });
    },
    startLockEditor() {
      this.lockEditMode = true;
      //await this.fetchStatus().then( (resp) => {
        return Promise.resolve(this.status.currentLock['is-active']);
      //})
    },
    async stopLockEditor() {
      this.lockEditMode = false;
      await this.fetchStatus().then( (resp) => {
        return Promise.resolve(this.status.currentLock['is-active']);
      })
      //this.status = await this.getPreview(this.docId);
      // TODO: mettre à jour l'affichage du lock
      //console.warn("DocumentTagBar (lock): affichage du lock non mis à jour");
      //return Promise.resolve(!!this.lockOwner[this.docId]);
    },
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.tags {

  a.tag:first-child {
    padding: 0;

    .document-id {
      font-family: $family-primary;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: #000000;
      text-transform: uppercase;
    }
  }

  .tag:not(body) {
    display: inline-block;
    background-color: transparent !important;
    margin: 0;
    padding: 0;

    a {
      display: inline-block;
      min-width: 40px;
      height: 20px;
    }

    i {
      display: none;
    }

    &::after {
      display: none;
    }
  }

  .publish-tag {
    a {
      background: url(../../assets/images/icons/published-neutre.svg) center / 20px auto no-repeat;
    }
    &.is-published a {
      background-image: url(../../assets/images/icons/published-active.svg);
    }
  }

  .bookmark-tag {
    a {
      background: url(../../assets/images/icons/favori_neutre.svg) center / 15px auto no-repeat;
    }
    &.is-bookmarked a {
      background-image: url(../../assets/images/icons/favori_active.svg);
    }
  }

  .lock-tag {
    a {
      background: url(../../assets/images/icons/verrou-ouvert.svg) center / 15px auto no-repeat !important;
    }
    &.is-locked a {
      background-image: url(../../assets/images/icons/verrou-ferme.svg);
    }
  }

}

</style>