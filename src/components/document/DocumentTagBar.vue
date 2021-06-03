<template>
  <span
    class="tags has-addons document-tag-bar"
  > 
    <router-link
      :to="{name: 'document', params: {docId}}"
      class="tag document-preview-card__doc-tag"
    >
      <span>Document {{ docId }}</span>
    </router-link>
  
    <!--
      Published
    -->
    <badge
      v-if="withStatus && current_user && preview.isPublished !== null"
      classes-active="is-published tag"
      classes-inactive="tag"
      :action-when-on="publishDocument"
      :action-when-off="unpublishDocument"
      :starts-on="preview.isPublished"
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
      v-if="withStatus && current_user && preview.isBookmarked !== null"
      classes-active="is-bookmarked tag"
      classes-inactive="tag"
      :action-when-on="addBookmark"
      :action-when-off="removeBookmark"
      :starts-on="preview.isBookmarked"
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
      v-if="withStatus && current_user"
      classes-active="is-locked tag"
      classes-inactive="tag"
      :action-when-on="startLockEditor"
      :action-when-off="startLockEditor"
      :starts-on="lockOwner[docId]"
    >
      <template #active>
        <a><i class="fas fa-lock" /></a>
      </template>
      <template #activeLabel>
        <span
          v-if="lockOwner[docId]"
          class="badge-label"
        >{{ lockOwner[docId].attributes.username }}</span>
      </template>
      <template #inactive>
        <a><i class="fas fa-unlock" /></a>
      </template>
    </badge>
  
    <lock-form
      v-if="withStatus && lockEditMode"
      :doc-id="docId"
      :current-lock="preview.currentLock"
      :cancel="stopLockEditor"
      :submit="stopLockEditor"
    />
  

  </span>
</template>

<script>
    import {mapState} from 'vuex'
    import Badge from "../ui/Badge";
    import LockForm from "../forms/LockForm";

    export default {
        name: 'DocumentTagBar',
        components: {Badge, LockForm},
        props: {
            docId: {required: true, type: Number},
            withStatus: {required: true, type:Boolean, default: false},
            previewData : {required: true, type: Object}
        },
        data() {
            return {
                baseUrl: `${process.env.VUE_APP_APP_ROOT_URL}`,
                lockEditMode: false,
                preview: this.$props.previewData
            }
        },
        computed: {
            ...mapState('user', ['current_user']),
            ...mapState('locks', ['lockOwner']),
            //...mapGetters('document', ['getPreview'])
        },
        watch: {},
        methods: {
            addBookmark() {
                return this.$store.dispatch('bookmarks/postUserBookmark', {
                    userId: this.current_user.id,
                    docId: this.docId,
                }).then(resp => {
                    this.preview.isBookmarked = true;
                    return Promise.resolve(true);
                })
            },
            removeBookmark() {
                return this.$store.dispatch('bookmarks/deleteUserBookmark', {
                    userId: this.current_user.id,
                    docId: this.docId,
                }).then(resp => {
                    this.preview.isBookmarked = false;
                    return Promise.resolve(false);
                })
            },
            publishDocument() {
                return this.$store.dispatch('document/publish', this.docId,
                ).then(resp => {
                    this.preview.isPublished = true;
                    return Promise.resolve(true);
                })
            },
            unpublishDocument() {
                return this.$store.dispatch('document/unpublish', this.docId,
                ).then(resp => {
                    this.preview.isPublished = false;
                    return Promise.resolve(false);
                })
            },
            startLockEditor() {
                this.lockEditMode = true;
                return Promise.resolve(!!this.lockOwner[this.docId]);
            },
            async stopLockEditor() {
                this.lockEditMode = false;
                //this.preview = await this.getPreview(this.docId);
                // TODO: mettre à jour l'affichage du lock
                console.warn('DocumentTagBar (lock): affichage du lock non mis à jour')
                return Promise.resolve(!!this.lockOwner[this.docId]);
            }
        },
    }
</script>