<template>
  <modal-form
    v-if="!loading"
    class="lock-form"
    :title="title"
    :cancel="cancelAction"
    :submit="canBeLocked ? submitAction : null"
    :remove="canBeUnlocked ? removeAction : null"
    :submit-valid="true"
    :previous-value="true"
    :submitting="false"
    submit-text="Verrouiller"
    remove-text="Déverrouiller"
  >
    <!-- Non-admin features -->
    <div>
      <div v-if="lock.id && !loading">
        <div>
          <p>
            Le <b>document {{ docId }}</b> est actuellement verrouillé par
            <b>{{ lockOwner.attributes.username }}</b> du <b>{{ lock["event-date"] }}</b> au
            <b>{{ lock["expiration-date"] }}</b>.
          </p>
          <article
            v-if="!canEditLock"
            class="message lock-form__description"
          >
            <div class="message-body">
              <p>
                <u>Raison invoquée :</u>
                {{ lock.description }}
              </p>
            </div>
          </article>
        </div>
        <div v-if="canEditLock">
          <b-field label="Raison du verrouillage">
            <b-input 
              id="description" 
              v-model="description"
              maxlength="200"
              type="textarea"
              rows="2"
            />
          </b-field>
        </div>
      </div>
      <div v-else>
        <p>
          Vous pouvez verrouiller le <b>document {{ docId }}</b> pour une période
          renouvelable de sept jours.
        </p>
        <b-field label="Raison du verrouillage">
          <b-input 
            id="description" 
            v-model="description"
            maxlength="200"
            type="textarea"
            rows="2"
          />
        </b-field>
      </div>
    </div>
    <!-- Admin features -->
    <div v-if="current_user.isAdmin">
      <loading-indicator :active="loading" />
      <div
        v-if="!loading"
        class=""
      >
        <form @submit.prevent="">
          <b-field 
            label="Propriétaire du verrou"
          >
            <b-autocomplete
              v-model="formLockOwnerName"
              :data="filteredUserList"
              field="username"
              :placeholder="'Chercher l\'utilisateur'"
              dropdown-position="top"
              @select="updateNextLockOwner"
            >
              <template #empty>
                Aucun résultat
              </template>
            </b-autocomplete>
          </b-field>
        </form>
      </div>
    </div>
  </modal-form>
</template>

<script>
import {mapActions, mapState} from "vuex";

import ModalForm from "./ModalForm";
import LoadingIndicator from "../ui/LoadingIndicator";
import http_with_auth from "../../modules/http-common";

export default {
  name: "LockForm",
  components: {
    LoadingIndicator,
    ModalForm,
  },
  props: {
    docId: {type: Number, required: true },
    currentLock: { type: Object, default: null },
    cancel: { type: Function, default: () => {} },
    submit: { type: Function, default: () => {} },
    remove: { type: Function, default: () => {} },
  },
  data() {
    return {
      title: "Verrouillage du document",

      lock: { ...this.$props.currentLock },
      lockOwner: null,
      nextLockOwner: null,
      defaultDescription:
        "Ce document est verrouillé afin de me permettre de compléter la transcription et de corriger les metadonnées.",
      description: null,
      formLockOwnerName: "",
      loading: true,
      filteredUsers: [],
      canEditLock: false
    };
  },
  computed: {
    ...mapState("user", ["current_user", "users", "jwt"]),

    nextLock() {
      if (this.nextLockOwner) {
        return {
          type: "lock",
          attributes: {
            description: this.description ? this.description : this.defaultDescription,
            "object-type": "document",
            "object-id": this.docId,
          },
          relationships: {
            user: {
              data: [{ type: "user", id: this.nextLockOwner.id }],
            },
          },
        };
      } else {
        return null;
      }
    },
    selectedLock() {
      if (this.lockOwner && this.lock.id) {
        return {
          type: "lock",
          id: this.lock.id,
          attributes: {
            description: this.lock.description ? this.lock.description : this.defaultDescription,
            "object-type": "document",
            "object-id": this.docId,
          },
          relationships: {
            user: {
              data: [{ type: "user", id: this.lockOwner.id }],
            },
          },
        };
      } else {
        return null;
      }
    },
    canBeLocked() {
      console.log('canBeLocked : ', this.current_user.isAdmin ? true : this.lock.id === null)
      return this.current_user.isAdmin ? true : this.lock.id === null;
    },
    canBeUnlocked() {
      console.log('canBeUnlocked / this.$props.currentLock: ', this.$props.currentLock)
      console.log('canBeUnlocked / : this.lock.id', this.lock.id)
      console.log('canBeUnlocked / : this.lockOwner', this.lockOwner)
      console.log('canBeUnlocked : ', this.lock.id
        ? this.current_user.isAdmin
          ? true
          : this.lockOwner && this.lockOwner.id === this.current_user.id
        : false)
      return this.lock.id
        ? this.current_user.isAdmin
          ? true
          : this.lockOwner && this.lockOwner.id === this.current_user.id
        : false;
    },
    filteredUserList() {
      return this.users.filter((u) => u.username.toLowerCase().includes(this.formLockOwnerName.toLowerCase()))
    }
  },
  watch: {
    currentLock() {
      this.fetchLock();
    },
  },
  mounted() {
    this.fetchLock();
  },
  async created() {
    if (this.current_user) {
      if (this.current_user.isAdmin) {
        await this.fetchUsers();
      }
    }
  },
  methods: {
    ...mapActions("user", ["fetchUsers"]),
    ...mapActions("locks", ["saveLock", "updateLock"/*,"removeLock"*/]),
    submitAction() {
      console.log(this.nextLock)
      if (this.nextLock) {
        this.saveLock(this.nextLock).then((resp) => {
          this.$props.submit();
        });
      }
    },
    cancelAction() {
      this.$props.cancel();
    },
    removeAction() {
      let lockToRemove = {};
      lockToRemove = this.selectedLock;
      lockToRemove.attributes.description = (lockToRemove.attributes.description && lockToRemove.attributes.description !== this.defaultDescription)
          ? `Le document a été déverrouillé par ${this.current_user.username}.\nDescription précédente du verrou : ${lockToRemove.attributes.description}`
          : `Le document a été déverrouillé par ${this.current_user.username}.`
      this.updateLock(lockToRemove).then((resp) => {
        this.$props.submit();
      });
    },
    async fetchLock() {
      this.loading = true;
      this.lock = this.$props.currentLock;
      /* fetch lock user info*/
      if (this.lock && this.lock.id) {
        const http = http_with_auth(this.jwt);
        await http.get(`/locks/${this.lock.id}/user`).then((response) => {
          this.lockOwner = response.data.data;
          this.description = this.lock.description
          this.formLockOwnerName = this.lockOwner.attributes.username
          this.nextLockOwner = this.lockOwner
          this.canEditLock = this.lockOwner.attributes.username === this.current_user.username || this.current_user.isAdmin
          this.loading = false;
        });
      } else {
        this.formLockOwnerName = this.current_user.username
        this.nextLockOwner = this.current_user
        this.description = this.defaultDescription;
        this.loading = false;
      }
    },
    updateNextLockOwner(selectedNextLock) {
      this.nextLockOwner = selectedNextLock;
    }
  },
};
</script>
