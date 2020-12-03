<template>
  <div>
    <!-- {{leaves}} -->
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="true"
    ></b-loading>
    <b-table :data="isEmpty ? [] : passLeave" :striped="true" :hoverable="true">
      <template slot-scope="props">
        <b-table-column field="id" label="Applicant" width="300">
          <!-- <a @click="detail(props.row)">
              {{ props.row.user_leave.firstname }}
          </a> -->
          <a @click="detail(props.row)">
            {{ props.row.user_leave.username }}
          </a>
        </b-table-column>
        <b-table-column field="date_from" label="Start">
          {{ props.row.date_from |  moment("Do MMMM YYYY") }}
        </b-table-column>
        <b-table-column field="date_to" label="End">
          {{ props.row.date_to | moment("Do MMMM YYYY") }}
        </b-table-column>
        <b-table-column
          field="date_from"
          label="Status"
          v-if="props.row.status == false && props.row.approver_id == null"
        >
          Pending
        </b-table-column>
        <b-table-column
          field="date_from"
          label="Status"
          v-else-if="props.row.status == false && props.row.approver_id != null"
        >
          Declined
        </b-table-column>
        <b-table-column field="date_from" label="Status" v-else>
          Approved
        </b-table-column>
      </template>
    </b-table>
    <br><br><br>
    <div style=" width:20%; float:right; ">
      <form v-on:submit="pagination">
        <md-input
          style="width:60px; float: left; height:28px;text-align: right; "
          type="number"
          v-model="page"
          :disabled="false"
        />
      </form>
      &nbsp;<b>/{{ total_page }}</b>
      &nbsp;&nbsp;
      <b-tooltip label="Previous" type="is-light" position="is-bottom">
        <b-button
          @click="previousPage"
          :disabled="isPrevious"
          size="is-small"
          float="right"
          type="is-light"
        >
          <md-icon>navigate_before</md-icon>
        </b-button>
      </b-tooltip>
      <b-tooltip label="Next" type="is-light" position="is-bottom">
        <b-button
          @click="nextPage"
          :disabled="isNext"
          size="is-small"
          float="right"
          type="is-light"
        >
          <md-icon>navigate_next</md-icon>
        </b-button>
        &nbsp;&nbsp;
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import leave from "@/js/leave.js"; //directory to leave.js
import leaveClass from "@/js/class/leave_class.js"; //directory to leave_class.js
export default {
  name: "my-leave",
  data() {
    return {
      leaveObj: new leaveClass(),
      leaves: "", //do for leave in leaves
      passLeave: [],
      error: "",
      isLoading: false,
      id: localStorage.id,
      page: 1,
      total_page: null,
      data: null
    };
  },
  async created() {
    this.leaveObj.in_page = this.page;
    this.getLeave();
  },
  methods: {
    detail(value) {
      console.log(value.id);
      this.$router.push({
        path: `/displayLeave/${this.id}/${value.id}/status`
      });
    },
    async getLeave() {
      try {
        this.isLoading = true;
        const data = await leave.show_own_leave(this.leaveObj);
        this.data = data;
        this.leaves = data[0].map(leave => ({
          ...leave
        }));
        this.total_page = data[1];
        this.isLoading = false;
      } catch (err) {
        this.error = err.message;
        this.isLoading = false;
        alert(err);
      }
      this.passLeave = this.leaves;
      // for (var i = 0; this.leaves[0][i] != null; i++) {
      //   this.passLeave.push(this.leaves[0][i]);
      // }
    },
    async nextPage() {
      this.isPrevious = false;
      if (this.page >= this.total_page - 1) {
        this.page = this.total_page;
      } else this.page += 1;
      if (this.page == this.total_page) this.isNext = true;
      this.leaveObj.in_page = this.page;
      this.getLeave();
    },
    async previousPage() {
      this.isNext = false;
      if (this.page <= 1) {
        this.page = 1;
        this.isPrevious = true;
      } else this.page -= 1;
      if (this.page == 1) this.isPrevious = true;

      this.leaveObj.in_page = this.page;
      this.getLeave();
    },
    async pagination() {
      if (this.page >= this.total_page) {
        this.page = this.total_page;
        this.isNext = false;
      } else if (this.page < 1) {
        this.page = 1;
        this.isPrevious = false;
      } else this.page = 1;

      this.leaveObj.in_page = this.page;
      this.getLeave();
    }
  }
};
</script>
