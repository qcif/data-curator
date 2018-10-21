<template>
<div id="container" class="container-fluid errors-window">
  <h1>{{title}}</h1>
  <div>
  <template v-if="messages">
    <i class="navbar-text">{{messages.length}} Error(s)</i>
    <ul class="nav navbar-nav navbar-left" >
      <li>
        <a href="#" v-tooltip.top="tooltip('tooltip-write-errors-provenance')" @click.prevent="writeErrorsToProvenance()">
          <object data="static/img/validation-results.svg" type="image/svg+xml" />
          <!-- <span class="btn-default fas fa-file-alt"  /> -->
        </a>
      </li>
      <component is="tooltipWriteErrorsProvenance" />
    </ul>
   </template>
   <vue-good-table
     :columns="columns"
     :rows="rows"
     :paginate="true"
     :defaultSortBy="{field: 'row', type: 'asc'}"
     :onClick="goToCell"
    styleClass="table condensed table-bordered table-striped">
      <template slot="table-row" slot-scope="props">
        <rowLink gClass="center-align" :row="props.row" :value="props.row.rowNumber"/>
        <rowLink gClass="center-align" :row="props.row" :value="props.row.columnNumber"/>
        <rowLink gClass="left-align"  :row="props.row" :value="props.row.message"/>
      </template>
</vue-good-table>
 </div>

</div>
</template>
<script>
import Vue from 'vue'
import VueGoodTable from 'vue-good-table'
import { ipcRenderer as ipc } from 'electron'
import { getWindow } from '../index.js'
import rowLink from '../partials/RowLink'
import ErrorsTooltip from '../mixins/ErrorsTooltip'
import { provenanceErrors$ } from '@/rxSubject.js'
import {
  mapMutations
} from 'vuex'
Vue.use(VueGoodTable)
export default {
  name: 'errors',
  components: {
    rowLink
  },
  mixins: [ErrorsTooltip],
  data() {
    return {
      title: '',
      messages: false,
      columns: [
        {
          label: 'Row number',
          field: 'rowNumber',
          filterable: true,
          type: 'number'
        },
        {
          label: 'Column number',
          field: 'columnNumber',
          filterable: true,
          type: 'number'
        },
        {
          label: 'Error message',
          field: 'message',
          filterable: true
        }
      ],
      rows: [
      ]
    }
  },
  computed: {
    // cache main window
    homeWindow() {
      return getWindow('home')
    }
  },
  methods: {
    ...mapMutations([
      'pushProvenanceErrors'
    ]),
    goToCell: function(error) {
      this.homeWindow.webContents.send('showErrorCell', { row: error.rowNumber, column: error.columnNumber })
    },
    setErrorMessages: function(errorMessages) {
      this.messages = errorMessages.messages
      this.title = errorMessages.title
    },
    resetErrorMessages: function() {
      this.messages = false
      this.title = ''
    },
    writeErrorsToProvenance: function() {
      this.homeWindow.webContents.send('pushErrorMessages', this.messages)
      this.showProvenanceErrors()
      provenanceErrors$.next()
    },
    showProvenanceErrors: function() {
      this.homeWindow.webContents.send('showProvenanceErrors')
    }
  },
  mounted: function() {
    let self = this
    ipc.on('errorMessages', function(event, arg) {
      if (!arg) {
        self.resetErrorMessages()
      } else {
        self.setErrorMessages(arg)
      }
    })
  },
  watch: {
    messages: function(messages) {
      this.rows = []
      if (messages) {
        for (let next of messages) {
          this.rows.push({ rowNumber: next.rowNumber, columnNumber: next.columnNumber, message: next.message })
        }
      }
    }
  }
}
</script>
<style scoped>
@import '~components-font-awesome/css/fontawesome-all.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/keyboard-help'
</style>
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
<style lang="styl" scoped>
@import '~static/css/icons'
</style>
