<template>
  <aside class="menu">
    <search-box class="mt-5 mb-5" />
    <p class="menu-label">
      Général
    </p>
    <ul class="menu-list">
      <li><a>Mon historique</a></li>
      <li><a>Mes favoris</a></li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li><a>Team Settings</a></li>
      <li>
        <a class="is-active">Manage Your Team</a>
        <ul>
          <li><a>Members</a></li>
          <li><a>Plugins</a></li>
          <li><a>Add a member</a></li>
        </ul>
      </li>
    </ul>
  </aside>
</template>


<script>
import { mapState, mapGetters } from "vuex";
import SearchBox from "./ui/SearchBox";

export default {
  name: "NavBar",
  components: { SearchBox },
  data() {
    return {

    };
  },
  computed: {
 
  },
  methods: {
   
  }
};
</script>

<style scoped>
  aside {
    position: relative;
    float: left;
    display: block;
  }
</style>