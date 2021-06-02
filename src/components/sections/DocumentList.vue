<template>
  <div class="section">
    <div class="container">
      <div v-show="!loadingStatus">
        <div
          v-show="documents"
          class="has-text-centered"
        >
          <pagination />
        </div>
    
        <b-table
          :data="tableData"
          detailed
          detail-key="id"
          show-detail-icon
          :narrowed="true"
          :hoverable="true"
          :mobile-cards="true"
          class="pb-5 pt-5"
        >
          <b-table-column
            v-slot="props"
            field="id"
            label="Document"
            width="40"
          >
            <span
              class="tags has-addons document-tag-bar"
            >
              <router-link
                :to="{name: 'document', params: {docId: props.row.id}}"
                class="tag document-preview-card__doc-tag"
              >
                <span>Document {{ props.row.id }}</span>
              </router-link>
            </span>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="date"
            label="Date de rédaction"
            :td-attrs="columnTdAttrs"
          >
            {{ props.row.date }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="title"
            label="Titre"
          >
            <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
              <h2
                class="document-preview-card__title"
                v-html="props.row.title"
              />
            </router-link>
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">
              Aucun résultat
            </div>
          </template>

          <template #detail="props">
            <document-preview-card
              :doc-id="props.row.id"
            />
          </template>
        </b-table>
        

        <div
          v-show="documents"
          class="has-text-centered"
        >
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {http} from "@/modules/http-common";
import Pagination from "../ui/Pagination";

export default {
  name: "DocumentList",
  components: {
    DocumentPreviewCard: () => import("../document/DocumentPreviewCard"),
    Pagination,
  },
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapState("search", ["documents", "loadingStatus"]),
    ...mapState("user", ["current_user"]),

  },
  watch: {
    documents() {
      this.asyncLoadTable()
    }
  },
  created() {
    this.asyncLoadTable()
  },
  methods: {
    async asyncLoadTable() {
      this.tableData = await Promise.all(this.documents.map(async d => {
        //const witnesses = await http.get(`documents/${d.id}/witnesses?without-relationships`)
        return {
          id: d.id,
          tag: 'tag',
          title :d.attributes.title,
          date : d.attributes.creation,
          //witnesses: witnesses.data.data
        }
      }));
    },
    columnTdAttrs(row, column) {
      if (column.label === 'Date de rédaction') {
        return {
          class: 'has-text-weight-bold',
          style: {
            'min-width': '120px'
          }
        }
      }
      else {
        return null
      }
    },
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.section {
  width: 100%;
}
progress {
  margin-top: 30px;
}
</style>
