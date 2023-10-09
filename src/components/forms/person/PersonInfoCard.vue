<template>
  <div
    v-if="$attrs.person && $attrs.person.label"
    class="person-info-card"
  >
    <div class="labels">
      <div
      
        class="heading is-size-5"
      >
        {{ $attrs.person.label }}
      </div>
      <div
        v-if="$attrs.person.description"
        class="heading is-size-7"
      />
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

  .labels {
    padding: 8px;
    border-left: 2px solid $coffee;
    margin-bottom: 20px;
  }
}
.l-map {
  max-width: 100%;
  width: 270px;
  height: 280px;
}
</style>
