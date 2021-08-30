<template>
  <div class="doc-tag">
    <router-link :to="{ name: 'document', params: { docId } }">
      <div class="tags has-addons">
        <span class="tag doc-id is-primary"> Doc {{ docId }}</span>
        <span class="tag doc-creation-label" v-html="creationLabel">{{
          creationLabel
        }}</span>
        <span class="tag doc-title" v-html="title" />
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "DocumentTitleBar",
  props: ["docId", "title", "creationLabel"],
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";
.doc-tag {
  margin-bottom: 4px;
}
.doc-id {
}
.doc-title {
}
.doc-creation-label {
  font-weight: bold;
  justify-content: start !important;
}
</style>
