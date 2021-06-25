<template>
  <div>
    Home Page
    <div class="main-form">
      <wizard-form />
    </div>
  </div>
</template>

<script>
import WizardForm from "@/components/forms/wizards/WizardForm";

export default {
  name: "HomePage",
  components: {
    WizardForm,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.main-form {
  width: 90%;
  height: 80vh;
}
</style>
