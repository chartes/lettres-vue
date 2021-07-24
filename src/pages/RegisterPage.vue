<template>
  <div>
    <form @submit.prevent="register">
      <label for="name"> Name: </label>
      <input v-model="name" type="text" name="name" value />

      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name value />

      <button type="submit" name="button">Register</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  mounted() {
    this.hideRightSideBar();
  },
  methods: {
    register() {
      this.$store.dispatch("user/register", {
        name: this.name,
        email: this.email,
        password: this.password,
      });
    },
    ...mapActions("layout", [
      "toggleLeftSideBar",
      "toggleRightSideBar",
      "hideRightSideBar",
    ]),
  },
};
</script>

<style></style>
