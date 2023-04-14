<template>
  <div>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <div class="popup-list-header is-inline-block">
        <div class="results-count">
          <span class="total-count">{{ totalCount }}</span> résultat(s)
        </div>
      </div>
      <div class="is-inline-block">
        <div
          v-if="totalPages"
          class="pagination-controls"
        >
          <a
            :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
            @click="currentPage <= 1 ? null : currentPage = 1"
          />
          <a
            :class="currentPage <= 1 ? 'button previous-page disabled' : 'button previous-page'"
            @click="currentPage <= 1 ? null : --currentPage"
          />
          <input
            v-model="currentPage"
            name="page"
            type="number"
            min="1"
            :max="totalPages"
            placeholder="Page..."
            class="current-page"
            @change.prevent="currentPage = parseInt(p)"
          >
          <span class="label-sur-page">sur</span>
          <span class="total-pages">{{ totalPages }}</span>
          <a
            :class="currentPage < totalPages ? 'button next-page' : 'button next-page disabled'"
            @click="currentPage < totalPages ? ++currentPage : null"
          />
          <a
            :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
            @click="currentPage < totalPages ? currentPage = totalPages : null"
          />
        </div>
      </div>
    </div>
    <div>
      <b-table
        ref="multiSortTable"
        class="locks-table"
        :data="data"
        detailed
        detail-key="object-id"
        show-detail-icon

        striped
        :loading="isLoading"
        backend-pagination
        :current-page.sync="currentPage"
        :per-page="pageSize"
        :total="totalCount"

        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"

        backend-filtering
        :debounce-search="1000"

        checkable
        checkbox-position="right"
        :checked-rows.sync="checkedRows"
        :custom-is-checked="(a, b) => { return a['object-id'] === b['object-id'] }"

        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
        @filters-change="onFilter"

        @details-open="(row, index) => $buefy.toast.open(`Expanded ${row['object-id']}`)"
      >
        <template #top-left>
          <span class="table_title">Status des verrouillages</span>
        </template>
        <template #bottom-left>
          <b>Total checked</b>: {{ checkedRows.length }}
        </template>
        <template #empty>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>Vous n'avez aucun verrouillage pour le moment.</p>
            </div>
          </section>
        </template>
        <template #detail="props">
          <document
            class="document-page"
            :doc-id="props.row['object-id']"
            :preview="true"
          />
        </template>
        <b-table-column
          field="object-id"
          label="Lettre"
          width="20%"
          sortable
          numeric
          searchable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <document-tag-bar
              :key="props.row['object-id']"
              :doc-id="props.row['object-id']"
              :with-status="true"
              :preview="true"
            />
          </template>
        </b-table-column>
        <b-table-column
          field="collections"
          label="Collection"
          width="20%"
          sortable
          searchable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <span
              v-for="collection in props.row.collections"
              :key="collection.id"
              class="is-block"
              v-html="collection.title"
            />
          </template>
        </b-table-column>
        <b-table-column
          field="username"
          label="User name"
          width="10%"
          :sortable="current_user.isAdmin"
          :searchable="current_user.isAdmin"
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <span v-html="props.row.username" />
          </template>
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
          width="40%"
          sortable
          searchable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <span v-html="props.row.description" />
          </template>
        </b-table-column>
        <b-table-column
          field="event-date"
          label="Date"
          width="15%"
          sortable
          searchable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <span
              class="tag"
              v-html="new Date(props.row['event-date']).toLocaleDateString()"
            />
          </template>
        </b-table-column>
        <b-table-column
          field="expiration-date"
          label="Expire"
          width="15%"
          sortable
          searchable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
                  <i class="fas fa-arrow-up" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down" />
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <span>
                {{ column.label }}
              </span>
            </div>
            <div v-else>
              {{ column.label }}
            </div>
          </template>
          <template #default="props">
            <span
              v-if="props.row['is-active']"
              class="tag is-success"
              v-html="new Date(props.row['expiration-date']).toLocaleDateString()"
            />
            <span
              v-else
              class="tag is-warning"
              v-html="new Date(props.row['expiration-date']).toLocaleDateString()"
            />
          </template>
        </b-table-column>
      </b-table>
      <lock-form
        v-if="withStatus && lockEditMode && status"
        :doc-id="checkedRows[0].docId"
        :current-lock="status.currentLock"
        :cancel="stopLockEditor"
        :submit="stopLockEditor"
      />
    </div>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar";
import LockForm from "@/components/forms/LockForm";
import Document from "@/components/sections/Document.vue";

export default {
  name: "LocksPage",
  components: {
    Document,
    DocumentTagBar,
    LockForm
  },
  data() {
    return {
      lockEditMode: false,
      withStatus: false,
      status: null,
      fetchedData: [],
      data: [],
      documentsCollections: [],
      checkedRows:[],
      sortingPriority: [{ field: "expiration-date", order: "desc" }],
      filters: [],
      numPage: 1,
      p: 1,
      pageSize: 3,
      totalCount: 0,
      isLoading: false,
    };
  },
  computed: {
    totalPages: function() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: async function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue && newValue >=1 && newValue <= this.totalPages) {
          this.p = newValue;
          this.numPage = newValue;
          await this.loadAsyncData();
        }
      },
    },
    ...mapState("user", ["current_user", "jwt"]),
    ...mapState("locks", ["fullLocks"]),
    ...mapGetters("document", ["getDocumentStatus"])
  },
  watch: {
    checkedRows: async function() {
      console.log("checked rows watch : ", this.checkedRows)
      /*TODO allow multiple locks processing */
      if (this.checkedRows.length === 1 && this.checkedRows[0].docId) {
        await this.fetchStatus(this.checkedRows[0].docId);
        this.lockEditMode = true;
        this.withStatus = true;
      }
    },
    /*fetchData() {
      this.loadAsyncData();
    }*/
  },
  async created() {
    if (this.current_user) {
      if (this.current_user.isAdmin) {
        await this.fetchUsers();
      }
      await this.fetchData();
    }
    if (this.fetchedData) {
          this.totalCount = this.fetchedData.locksWithCollections.length
    }
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("locks", ["fetchFullLocks"]),
    ...mapActions("user", ["fetchUsers"]),
    async fetchStatus(docId) {
      this.status = await this.getDocumentStatus(docId);
      console.log("status", docId, this.status);
    },
    async fetchData() {
      this.isLoading = true;
      let filters_list = [];
      let filtered_users = [];
      if (this.filters) {
        for (let i = 0; i < Object.keys(this.filters).length; i++) {
          // If username filter, get user_ids
          if (Object.keys(this.filters)[i] === 'username') {
            if (this.current_user.isAdmin) {
              filtered_users = this.$store.state.user.users.map(u => u.username.toLowerCase().includes(Object.values(this.filters)[i].toLowerCase()) ? u.id : false).filter(Boolean);
              console.log('filtered_users for admins: ', filtered_users)
              if (filtered_users.length > 0) {
                  // assign array of users as list (backend expects list)
                  filters_list.push('filter[user_id]=[' + filtered_users + ']');
              } else {
                  this.fetchedData = [];
                  this.data = [];
                  this.isLoading = false;
                  return;
              }
            }
          }
          else filters_list.push('filter[' + Object.keys(this.filters)[i] + ']=' + Object.values(this.filters)[i]);
        }
      }
      if (!this.current_user.isAdmin){
        console.log("For non-admin users, only fetch their own locks");
        filtered_users = [this.current_user.id]
        if (filtered_users.length > 0){
          filters_list.push('filter[user_id]=[' + filtered_users + ']');
        } else {
          this.data = [];
          this.isLoading = false;
          return;
        }
      }
      console.log('filters_list : ', filters_list)

      this.fetchedData = await this.fetchFullLocks({
        userId: this.current_user.id,
        sortingPriority: this.sortingPriority,
        numPage: this.numPage,
        pageSize: this.pageSize,
        filters: filters_list.length ? filters_list : null,
      });
      console.log('async fetchData() / this.fetchedData : ', this.fetchedData);
      return this.fetchedData;
    },
    /*TODO add lock sort reset button
    async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },*/
    async onFilter(filters){
      console.log("filters : ", filters);
      if (filters) {
        this.filters = Object.entries(filters).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {});
        console.log('onFilter / this.filters ', this.filters)
        await this.fetchData();
        this.loadAsyncData();
      }
    },
    // Backend sorting
    async sortingPriorityRemoved(field) {
      console.log('sortingPriorityRemoved', field);
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      if (this.sortingPriority.length > 0) {
          console.log(newPriority, this.sortingPriority);
      } else {
          // default sorting on descending locks expiration date
          this.sortingPriority = [{ field: "expiration-date", order: "desc" }];
          console.log("Default sorting new Priority", newPriority, this.sortingPriority);
      }
      await this.fetchData();
      this.loadAsyncData();
    },

    async sortPressed(field, order, event) {
      console.log('field, order, event', field, order, event);
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        console.log('condition', (this.customKey && event[this.customKey]) || !this.customKey);
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        console.log('existingPriority', existingPriority);
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
          this.sortingPriority[this.sortingPriority.findIndex(sp => sp.field === existingPriority.field)] = existingPriority;
          //this.sortingPriority.push({ field, order });
          console.log('sortingPriority', this.sortingPriority);
        } else {
          // request sorted data from backend
          console.log('change order', field, order );
          this.sortingPriority.push({ field, order });
        }
        await this.fetchData();
        this.loadAsyncData();
        this.currentPage = 1;
      } else {
        // request regular sorted data from backend
        console.log('no change order', field, order );
        this.sortingPriority = []; // [{field, order}]
        this.currentPage = 1;
      }
      // will reload the data (Note 24022023 : not true)
      //this.currentPage = 1;
    },
    /* function used to regroup locks by docId in the version with multiple historical locks by doc
    (see also loadAsyncData below)

    groupLocksByDoc(arr){

      const mapper = new Map()
      for (const { data, user} of arr) {
        if (!mapper.has(data.attributes['object-id'])) {
          mapper.set(data, { docId: data.attributes['object-id'], lock: [], user})
        }
        mapper.get(data).lock.push(data.attributes)
       }
       return Array.from(mapper.values())
    },*/
    loadAsyncData() {
      //if (this.fetchedData && this.documentsCollections) {
        console.log('loadAsyncData() / this.fetchedData : ', this.fetchedData)
        this.totalCount = this.fetchedData.totalCount;

        /* code used to regroup locks by docId in the version with multiple historical locks by doc

        let LocksByDocID = this.groupLocksByDoc(this.fetchedData.locks);
        console.log('LocksByDocID : ', LocksByDocID)

        this.data = LocksByDocID.map(({docId, lock, user}) => {
          const flatLockByDoc = {};

          flatLockByDoc['docId'] = parseInt(docId),
          flatLockByDoc['description'] = lock[0]['description'],
          flatLockByDoc['event_date'] = lock[0]['event-date'],
          flatLockByDoc['expiration_date'] = lock[0]['expiration-date'],
          flatLockByDoc['is_active'] = lock[0]['is-active'],
          flatLockByDoc['user_id'] = user.id,
          flatLockByDoc['username'] = user.username

          return flatLockByDoc;
          })*/

        this.data = this.fetchedData.locksWithCollections
          // local pagination
          .slice(
            (this.numPage- 1) * this.pageSize,
            this.numPage * this.pageSize,
          )
        //console.log('this.rootCollections : ', this.getCollectionAdmin());
        console.log('loadAsyncData() / this.data : ', this.data);
        this.isLoading = false;
      //}
    },
    /*getCollectionAdmin(){
      return Object.values(this.$store.state.collections.collectionsById).filter((c) => c.admin.username === this.current_user.username)

    },*/
    startLockEditor() {
      this.lockEditMode = true;
        return Promise.resolve(this.status.currentLock['is-active']);
    },
    async stopLockEditor() {
      this.lockEditMode = false;
      await this.fetchData();
      this.loadAsyncData();
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

  .pagination-controls {
    display: flex;
    align-items: center;
    /*visibility: hidden;*/

    & > * {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin-right: 4px;
    }
    & > a {
      display: inline-block;
      width: 38px;
      height: 38px;
      background-color: #C3C3C3;
      border-radius: 3.2px;
    }
    & > a.disabled {
      cursor: not-allowed !important;
    }
    & > a.first-page {
      background: #C3C3C3 url(../assets/images/icons/page_debut.svg)  center / 28px auto no-repeat;
    }
    & > a.previous-page {
      background: #C3C3C3 url(../assets/images/icons/page_precedent.svg) center / 28px auto no-repeat;
    }
    & > a.next-page {
      background: #C3C3C3 url(../assets/images/icons/page_suivant.svg) center / 28px auto no-repeat;
    }
    & > a.last-page {
      background: #C3C3C3 url(../assets/images/icons/page_fin.svg) center / 28px auto no-repeat;
    }
    & > input {
      height: 38px !important;
      padding: 0 !important;
      border: 1px solid #C00055;
      border-radius: 3.2px;

      font-family: $family-primary;
      font-size: 18px;
      color: #CB2158;
      font-weight: 800;
      text-align: center;
      text-decoration: none;

      &:focus {
        outline: 1px solid #C00055;
      }
    }

    & > span.label-sur-page {
      font-family: $family-primary;
      font-size: 11px;
      line-height: 38px;
      color: #979797;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
    }

    & > span.total-pages {
      background-color: #DFDFDF;
      border-radius: 3.2px;

      font-family: $family-primary;
      font-size: 18px;
      line-height: 38px;
      color: #818181;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
  .popup-list-header {
    /*border-top: solid 1px #FDB3CC;
    border-bottom: solid 1px #C7C7C7;*/
    margin-bottom: 25px;

    .results-count {
      display: flex;
      align-items: center;
      gap: 10px;

      font-family: $family-primary;
      font-size: 14px;
      color: #6D7278;
      font-weight: 600;
      text-transform: uppercase;

      .total-count {
        font-size: 50px;
        color: #FF0052;
        text-align: center;
        font-weight: 700;
      }
    }
  }
  .table_title {
    margin-bottom: 25px;
    font-family: $family-primary;
    font-size: 20px;
    font-weight: 500;
    color: #C00055;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  ::v-deep {
    input[type=number] {
      -moz-appearance: textfield;
    }
  }
</style>