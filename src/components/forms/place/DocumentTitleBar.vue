<template>
  <div class="doc-tag">
    <router-link :to="{ name: 'document', params: { docId } }">
      <div class="tags has-addons">
        <span class="tag doc-id is-primary"> Lettre {{ docId }}</span>
        <span
          class="tag doc-creation-label"
          v-html="creationLabel"
        />
        <span
          class="tag doc-title"
          v-html="title"
        />
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "DocumentTitleBar",
  props: {
    docId: {type: Number, default: null},
    title: {type: String, default: ''},
    creationLabel: {type: String, default: ''}
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";
.doc-tag {
  margin-bottom: 4px;
}

.doc-creation-label {
  font-weight: bold;
  justify-content: start !important;
}
</style>
