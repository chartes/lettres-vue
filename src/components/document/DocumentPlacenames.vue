<template>
  <section
    class="document-placenames mb-3"
    style="width: 100%"
  >
    <div class="columns">
      <div class="document-placenames__senders column is-one-third">
        <h3 class="document-placenames__subtitle heading has-add-btn is-flex is-align-items-center">
          Expédition
          <a
            v-if="editable && locationDateFrom.length === 0"
            class="tag"
            href="#"
            @click.prevent="openAddPlace('location-date-from')"
          ><!-- to add + icon (icon-add) even if there is one locationDateFrom, remove from above v-if: && locationDateFrom.length === 0 -->
            <icon-add />
          </a>
        </h3>
        <div v-if="locationDateFrom.length">
          <div
            v-for="c in locationDateFrom"
            :key="c.placename.id"
            class="tags has-addons are-medium document-placenames__senders-list mb-1"
          >
            <span class="tag">
              <a
                :href="c.placename.ref"
                target="_blank"
              >
                {{
                  !!c.relation.function
                    ? `${c.placename.label}, ${c.relation.function}`
                    : c.placename.label
                }}
              </a>
            </span>
            <a
              v-if="editable"
              class="tag is-delete"
              @click.prevent="unlinkPlace(c.placename.label, c.placename.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="locationDateFrom.length === 0">
          <p class="placename-item">
            <em>Lieu d'expédition non renseigné</em>
          </p>
        </div>
      </div>

      <div class="document-placenames__recipients column is-one-third">
        <h3 class="document-placenames__subtitle heading has-add-btn is-flex is-align-items-center">
          Destination
          <a
            v-if="editable"
            class="tag"
            href="#"
            @click.prevent="openAddPlace('location-date-to')"
          ><!-- to remove + icon (icon-add) when there is one locationDateTo, add to above v-if: && locationDateTo.length === 0 -->
            <icon-add />
          </a>
        </h3>
        <div v-if="locationDateTo.length">
          <div
            v-for="c in locationDateTo"
            :key="c.placename.id"
            class="tags has-addons are-medium document-placenames__senders-list mb-1"
          >
            <span class="tag">
              <a
                :href="c.placename.ref"
                target="_blank"
              >
                {{
                  !!c.relation.function
                    ? `${c.placename.label}, ${c.relation.function}`
                    : c.placename.label
                }}
              </a>
            </span>
            <a
              v-if="editable"
              class="tag is-delete"
              @click.prevent="unlinkPlace(c.placename.label, c.placename.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="locationDateTo.length === 0">
          <p class="placename-item">
            <em>Lieu de destination non renseigné</em>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import IconAdd from "../ui/icons/IconAdd";

export default {
  name: "DocumentPlacenames",
  components: { IconAdd },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["add-place", "unlink-place"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("document", ["locationDateFrom", "locationDateTo"]),
  },
  methods: {
    openAddPlace(role) {
      this.$emit("add-place", { role });
    },
    unlinkPlace(label, id, relationId, roleId) {
      console.log("UNLINK", label, id, relationId, roleId);
      this.$emit("unlink-place", { label, id, relationId, roleId });
    },
  },
};
</script>


<style scoped  lang="scss">

.document-placenames__subtitle {
  margin-bottom: 0.5em;
}

.has-add-btn.is-flex {
  gap: 5px;
}

</style>

