<template>
  <div class="person-info-card">
    <div v-if="$attrs.person" class="heading is-size-5">
      {{ $attrs.person.label }}
    </div>
    <div v-if="$attrs.person && $attrs.person.description" class="heading is-size-7">
      {{ $attrs.person.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonInfoCard",
  components: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.label {
  color: inherit !important;
}
.person-info-card {
  font-family: "Bitter", sans-serif;
  color: $nice-blue;
}
.l-map {
  width: 270px;
  height: 280px;
}
</style>
