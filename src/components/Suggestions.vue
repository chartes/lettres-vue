<template>
  <div>
    <section>
      <div>
        <span class="row is-flex is-justify-content-space-between suggestions-section-header my-3">
          SUGGESTIONS
        </span>
        <suggestions-box 
          type="persons"
          title="CORRESPONDANTS FRÉQUENTS" 
        />
        <suggestions-box
          type="places"
          title="LIEUX FRÉQUENTS"
        />
      </div>
    </section>
  </div>
</template>

<script>
import SuggestionsBox from "@/components/SuggestionsBox.vue";

export default {
  name: "AdvancedSearchForm",
  components: {
    SuggestionsBox
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
.suggestions-section-header {
  font-family: $family-primary;
  font-size: 16px;
  color: #C00055;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: solid 1px #FDB3CC;
  padding-bottom: 5px;
}
</style>
