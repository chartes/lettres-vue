<template>
  <section
    class="document-placenames mb-3"
    style="width: 100%"
  >
    <div class="columns">
      <div class="document-placenames__senders column is-one-third">
        <h3 class="document-placenames__subtitle heading has-add-btn">
          Dates de lieu d'expédition
          <a
            v-if="editable && locationDateFrom.length === 0"
            class="tag"
            href="#"
            @click.prevent="openAddPlace('location-date-from')"
          >
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
              @click.prevent="unlinkPlace(c.placename.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="locationDateFrom.length === 0">
          <p class="placename-item">
            <em>Aucune date de lieu d'expédition renseignée</em>
          </p>
        </div>
      </div>

      <div class="document-placenames__recipients column is-one-third">
        <h3 class="document-placenames__subtitle heading has-add-btn">
          Dates de lieu de destination
          <a
            v-if="editable && locationDateTo.length === 0"
            class="tag"
            href="#"
            @click.prevent="openAddPlace('location-date-to')"
          >
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
              @click.prevent="unlinkPlace(c.placename.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="locationDateTo.length === 0">
          <p class="placename-item">
            <em>Aucune date de lieu de destination renseignée</em>
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
    unlinkPlace(id, relationId, roleId) {
      console.log("UNLINK", id, relationId, roleId);
      this.$emit("unlink-place", { id, relationId, roleId });
    },
  },
};
</script>

<style></style>
