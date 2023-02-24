<template>
  <modal-form
    v-if="nextLockOwner && !loading"
    class="lock-form"
    :title="title"
    :cancel="cancelAction"
    :submit="canBeLocked ? submitAction : false"
    :remove="canBeUnlocked ? removeAction : false"
    :valid="true"
    :submitting="false"
    submit-text="Verrouiller"
    remove-text="Déverrouiller"
  >
    <!-- Non-admin features -->
    <div>
      <div v-if="lock.id && !loading">
        <p>
          Le <b>document {{ docId }}</b> est actuellement verrouillé par
          <b>{{ lockOwner.attributes.username }}</b>.
        </p>
        <article class="message lock-form__description">
          <div class="message-body">
            <p class="lock-form__description__lock-dates">
              Verrouillé du <b>{{ lock["event-date"] }}</b> au
              <b>{{ lock["expiration-date"] }}</b>
            </p>
            <p>
              <u>Raison invoquée :</u>
              {{ lock.description }}
            </p>
          </div>
        </article>
      </div>
      <div v-else>
        <p>
          Vous pouvez verrouiller le <b>document {{ docId }}</b> pour une période
          renouvelable de sept jours.
        </p>
        <div class="lock-form__textarea">
          <label for="description"><u>Raison du verrouillage :</u></label>
          <textarea
            id="description"
            v-model="description"
            class="textarea"
          />
        </div>
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
          <b-autocomplete
            v-model="nextLockOwner.id"
            label="Choisir le propriétaire du verrou"
            :items="usersSearchResults"
            :is-async="true"
            label-key="username"
            @search="searchUser"
          />
        </form>
        <form @submit.prevent="">
          <b-field>
            <select>
              <option
                v-for="option in users"
                :key="option.id"
                :value="option.id"
              >
                {{ option.username }}
              </option>
            </select>
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

      loading: true,
    };
  },
  computed: {
    ...mapState("user", ["current_user", "users", "usersSearchResults", "jwt"]),
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
            description: this.description ? this.description : this.defaultDescription,
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
  },
  watch: {
    currentLock() {
      this.fetchLock();
    },
  },
  /*async created() {
    await this.fetchLock()
  },*/
  mounted() {
    this.fetchLock();
    this.nextLockOwner = this.current_user;
    this.description = this.defaultDescription;
  },
  methods: {
    ...mapActions("user", ["fetchUsers"]),
    submitAction() {
      if (this.nextLock) {
        this.saveLock().then((resp) => {
          console.log('submitAction() RESP : ', resp)
          console.log('this.$props : ', this.$props)
          this.$props.submit();
        });
      }
    },
    cancelAction() {
      this.$props.cancel();
    },
    removeAction() {
      this.removeLock().then((resp) => {
        console.log('submitAction() RESP : ', resp)
          console.log('this.$props : ', this.$props)
        this.$props.submit();
      });
    },
    async fetchLock() {
      console.log('fetchLock() launched')
      this.loading = true;
      this.lock = this.$props.currentLock;
      /* fetch lock user info*/
      if (this.lock && this.lock.id) {
        const http = http_with_auth(this.jwt);
        await http.get(`/locks/${this.lock.id}/user`).then((response) => {
          this.lockOwner = response.data.data;
          console.log('fetchLock() / this.lockOwner', this.lockOwner)
          this.loading = false;
        });
      } else {
        console.log('fetchLock() / this.lock && this.lock.id', this.lock && this.lock.id)
        this.loading = false;
      }
    },
    saveLock() {
      console.log('saveLock(this.nextLock)', this.nextLock)
      return this.$store.dispatch("locks/saveLock", this.nextLock);
    },
    removeLock() {
      console.log('this.selectedLock : ', this.selectedLock)
      console.log('removeLock(this.nextLock)', this.nextLock)
      return this.$store.dispatch("locks/removeLock", this.selectedLock);
    },
    searchUser(search) {
      return this.$store.dispatch("user/search", search);
    },
    resetDescription() {
      this.description = this.defaultDescription;
    },
  },
};
</script>
