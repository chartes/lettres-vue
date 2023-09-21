<template>
  <section class="document-correspondents">
    <div class="panel">
      <div
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <div class="heading mb-2 has-add-btn is-flex is-align-items-center">
          Expéditeur{{ documentSender.length > 1 ? "s" : "" }}
          <a
            v-if="editable && documentSender.length === 0"
            class="tag"
            href="#"
            @click.prevent="openAddPerson('sender')"
          ><!-- to add + icon (icon-add) even if there is one Sender, remove from above v-if: && documentSender.length === 0 -->
            <icon-add />
          </a>
        </div>
        <div v-if="documentSender.length">
          <div
            v-for="c in documentSender"
            :key="c.person.id"
            class="tags has-addons are-medium correspondent-item mb-1"
          >
            <span class="tag">
              <a
                :href="c.person.ref"
                target="_blank"
              >
                {{
                  !!c.relation.function
                    ? `${c.person.label}, ${c.relation.function}`
                    : c.person.label
                }}
              </a>
            </span>
            <a
              v-if="editable"
              class="tag is-delete"
              @click.prevent="unlinkPerson(c.person.label, c.person.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="documentSender.length === 0">
          <p class="person-item">
            <em>Aucun expéditeur renseigné</em>
          </p>
        </div>
      </div>
      <div
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <div class="heading mb-2 has-add-btn is-flex is-align-items-center">
          Destinataire{{ documentRecipients.length > 1 ? "s" : "" }}
          <a
            v-if="editable"
            class="tag"
            href="#"
            @click.prevent="openAddPerson('recipient')"
          ><!-- to remove + icon (icon-add) when there is one Recipient, add to above v-if: && documentRecipients.length === 0 -->
            <icon-add />
          </a>
        </div>
        <div v-if="documentRecipients.length > 0">
          <div
            v-for="c in documentRecipients"
            :key="c.person.id"
            class="tags has-addons are-medium correspondent-item mb-1"
          >
            <span class="tag">
              <a
                :href="c.person.ref"
                target="_blank"
              >
                {{
                  !!c.relation.function
                    ? `${c.person.label}, ${c.relation.function}`
                    : c.person.label
                }}
              </a>
            </span>
            <a
              v-if="editable"
              class="tag is-delete"
              @click.prevent="unlinkPerson(c.person.label, c.person.id, c.relation.id, c.role.id)"
            />
          </div>
        </div>
        <div v-if="documentRecipients.length === 0">
          <p class="person-item">
            <em>Aucun destinataire renseigné</em>
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
  name: "DocumentPersons",
  components: { IconAdd },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["add-person", "unlink-person"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("document", ["documentSender", "documentRecipients"]),
  },
  methods: {
    openAddPerson(role) {
      this.$emit("add-person", { role });
    },
    unlinkPerson(label, id, relationId, roleId) {
      console.log("UNLINK", label, id, relationId, roleId);
      this.$emit("unlink-person", { label, id, relationId, roleId });
    },
  },
};
</script>

<style scoped  lang="scss">

.has-add-btn.is-flex {
  gap: 5px;
}

</style>
