<template>
  <div>
    <!-- <router-link :to="{ name: 'PSR', params: { id: this.id } }">PSR</router-link> -->
    <!-- <md-table v-model="leaves" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }" v-on:click="routerLinkToDetails(item)" >
        <md-table-cell md-label="Employee ID" click="routerLinkToDetails">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Date Start">{{ item.date_from }}</md-table-cell>
        <md-table-cell md-label="Date End">{{ item.date_to }}</md-table-cell>
        <md-table-cell md-label="Reason">{{ item.reason }}</md-table-cell>
        <md-table-cell md-label="Status">{{ item.status }}</md-table-cell>
      </md-table-row>
    </md-table> -->

    <!-- <b-table :data="leaves" :columns="columns" :hoverable="true" :striped="true" selectable @select="routerLinkToDetails"></b-table> -->
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="true"
    ></b-loading>
    <b-table :data="isEmpty ? [] : leaves" :striped="true" :hoverable="true">
      <template slot-scope="props">
        <b-table-column field="id" label="Applicant" width="300">
          <a @click="detail(props.row)">
            {{ props.row.user_leave.firstname }}
          </a>
        </b-table-column>
        <b-table-column field="date_from" label="Start">
          {{ props.row.date_from | moment("Do MMMM YYYY") }}
        </b-table-column>
        <b-table-column field="date_to" label="End">
          {{ props.row.date_to | moment("Do MMMM YYYY") }}
        </b-table-column>
        <b-table-column field="reason" label="Reason">
          {{ props.row.reason }}
        </b-table-column>
        <b-table-column field="status" label="Status">
          {{ props.row.status }}
        </b-table-column>
      </template>
    </b-table>
    <br /><br /><br />
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
    <!-- {{leaves}} -->
  </div>
  <!-- <div v-else>
      <b-message title="No Data" type="is-danger" has-icon aria-close-label="Close message">
          {{leaves}}
        </b-message>
  </div> -->
</template>

<script>
import leave from "@/js/leave.js"; //directory to leave.js
import leaveClass from "@/js/class/leave_class.js"; //directory to leave_class.js
export default {
  name: "notify-leave",
  data() {
    return {
      dataBackgroundColor: "blue",
      isEmpty: false,
      leaveObj: new leaveClass(),
      leaves: [], //do for leave in leaves
      error: "",
      isLoading: false,
      id: localStorage.id,
      page: 1,
      total_page: 0
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
        path: `/displayLeave/${this.id}/${value.id}/approval`
      });
    },
    async getLeave() {
      try {
        this.isLoading = true;
        const data = await leave.show_pending_page(this.leaveObj);
        this.leaves = data[0].map(leave => ({
          ...leave
        }));
        this.total_page = data[1];
        console.log("Leave Dta");
        console.log(this.leaves);
        this.isLoading = false;
      } catch (err) {
        this.error = err.message;
      }
    },
    openLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);
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
