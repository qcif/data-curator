<template>
  <div
    id="container"
    class="container-fluid">
    <form>
      <p>
        <select
          id="worksheets"
          v-model="selected"
          class="form-control">
          <option
            v-for="option in options"
            :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </p>
      <div class="submit-container">
        <button
          id="submit"
          class="btn btn-default"
          @click.prevent="submit">Open Sheet</button> <button
            id="cancel"
            class="btn btn-default"
            @click.prevent="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>
<script>
const ipc = require('electron').ipcRenderer

export default {
  name: 'Selectworksheet',
  data() {
    return {
      selected: '',
      options: [
      ]
    }
  },
  mounted: function() {
    const vueOptions = this.options
    const vueUpdateSelected = this.updateSelected
    ipc.on('loadSheets', function(e, sheets) {
      sheets.forEach(function(sheet, index) {
        vueOptions.push({ text: sheet, value: sheet })
        vueUpdateSelected(sheet)
      })
    })
  },
  methods: {
    submit: function() {
      ipc.send('worksheetSelected', this.selected)
    },
    cancel: function() {
      ipc.send('worksheetCanceled')
    },
    updateSelected: function(selected) {
      this.selected = selected
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/select-worksheet'
</style>
