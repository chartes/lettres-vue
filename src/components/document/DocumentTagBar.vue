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
      v-if="current_user && preview.attributes['is-published'] !== null"
      classes-active="is-published tag"
      classes-inactive="tag"
      :action-when-on="publishDocument"
      :action-when-off="unpublishDocument"
      :starts-on="preview.attributes['is-published']"
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
      v-if="current_user && preview.isBookmarked !== null"
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
      v-if="current_user"
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
      v-if="lockEditMode"
      :doc-id="docId"
      :current-lock="preview.currentLock"
      :cancel="stopLockEditor"
      :submit="stopLockEditor"
    />
  

  </span>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import Badge from "../ui/Badge";
    import LockForm from "../forms/LockForm";

    export default {
        name: 'DocumentTagBar',
        components: {Badge, LockForm},
        props: {
            docId: {required: true, type: Number},
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
            ...mapGetters('document', ['getPreview'])
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
                    this.preview.attributes['is-published'] = true;
                    return Promise.resolve(true);
                })
            },
            unpublishDocument() {
                return this.$store.dispatch('document/unpublish', this.docId,
                ).then(resp => {
                    this.preview.attributes['is-published'] = false;
                    return Promise.resolve(false);
                })
            },
            /*
            fetchPreviewCard() {
                this.$store.dispatch('document/fetchPreview', this.docId).then(() => {
                     //fetch lock user info
                    if (this.current_user) {
                        //  isBookmarked 
                        http.get(`/users/${this.current_user.id}/relationships/bookmarks`).then(response => {
                            this.isBookmarked = response.data.data.filter(d => d.id === this.docId).length > 0;
                        });
                        // isPublished 
                        this.isPublished = this.preview.attributes['is-published'];

                        const lockId = this.preview.currentLock.id;
                        if (lockId) {
                            this.fetchLockOwner(lockId);
                        }
                    }
                });
            },
            fetchLockOwner(lockId) {
                return this.$store.dispatch('locks/fetchLockOwner', {docId: this.docId, lockId: lockId});
            },
            */
            startLockEditor() {
                this.lockEditMode = true;
                return Promise.resolve(!!this.lockOwner[this.docId]);
            },
            async stopLockEditor() {
                this.lockEditMode = false;
                this.preview = await this.getPreview(this.docId);
                return Promise.resolve(!!this.lockOwner[this.docId]);
            }
        },
    }
</script>