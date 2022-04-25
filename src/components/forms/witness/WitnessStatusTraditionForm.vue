<template>
  <div>
    <b-field label="Statut">
      <b-select
        v-model="selectedStatus"
        multiple
        native-size="4"
        expanded
      >
        <option
          v-for="(status, i) in statuses"
          :key="`status-${i}`"
          :value="status.id"
        >
          {{ status.label }}
        </option>
      </b-select>
    </b-field>

    <b-field label="Tradition">
      <b-select
        v-model="selectedTradition"
        multiple
        native-size="4"
        expanded
      >
        <option
          v-for="(tradition, i) in traditions"
          :key="`status-${i}`"
          :value="tradition.id"
        >
          {{ tradition.label }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script>
import { statuses, traditions } from "@/components/forms/data";

export default {
  name: "WitnessStatusTraditionForm",
  emit: ["manage-witness-data"],
  data() {
    return {
      selectedStatus: null,
      selectedTradition: null,
      statuses,
      traditions,
    };
  },
  watch: {
    selectedStatus() {
      if (this.selectedStatus.length > 1) {
        this.selectedStatus = [this.selectedStatus[0]];
      }
      const s = this.statuses.find((s) => s.id === this.selectedStatus[0]);
      this.manageWitnessData({
        action: { name: "set-status" },
        data: { id: s.id, label: s.label },
      });
    },
    selectedTradition() {
      if (this.selectedTradition.length > 1) {
        this.selectedTradition = [this.selectedTradition[0]];
      }
      const s = this.traditions.find((s) => s.id === this.selectedTradition[0]);
      this.manageWitnessData({
        action: { name: "set-tradition" },
        data: { id: s.id, label: s.label },
      });
    },
  },
  created() {
    this.selectedStatus = this.$attrs.witness.status;
    this.selectedTradition = this.$attrs.witness.tradition;
  },
  methods: {
    manageWitnessData(evt) {
      this.$emit("manage-witness-data", evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: inherit !important;
}
</style>
