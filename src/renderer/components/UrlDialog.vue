<template>
  <div
    id="container"
    class="container-fluid">
    <form>
      <div class="form-block">
        <label
          class="control-label url-dialog-label"
          for="url-dialog">
          URL:
        </label>
        <input
          v-validate="'url:true'"
          id="url-dialog"
          :class="{ 'form-control': true, 'validate-danger': errors.has('url-dialog') }"
          v-model="urlText"
          autofocus
          type="text"
          name="url-dialog">
      </div>
      <div
        v-show="errors.has('url-dialog')"
        class="row help validate-danger">
        {{ errors.first('url-dialog') }}
      </div>
      <div class="submit-container">
        <button
          id="cancel"
          class="btn btn-default"
          @click.prevent="cancel">Cancel
        </button>
        <button
          id="submit"
          class="btn btn-default"
          @click.prevent="submit">{{ submitText }}
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { ipcRenderer as ipc } from 'electron'
import { getWindow } from '../index'

export default {
  name: 'Urldialog',
  data () {
    return {
      urlText: '',
      submitText: 'Open URL'
    }
  },
  mounted: function () {
    const vueUpdateSubmitText = this.updateSubmitText
    ipc.on('urlDialog', function (event, arg) {
      vueUpdateSubmitText(arg)
    })
    // web contents need focus before any input 'autofocus' attributes will work
    getWindow('urldialog').webContents.focus()
  },
  methods: {
    submit: function () {
      ipc.send('urlSubmitted', this.urlText)
    },
    cancel: function () {
      ipc.send('urlCancelled')
    },
    updateSubmitText: function (text) {
      this.submitText = text
    },
    resetUrlTextOnError: function () {
      if (this.errors.has('url-dialog')) {
        this.urlText = ''
      }
    }
  }
}
</script>
<style lang="styl" scoped>
    @import '~static/css/url-dialog'
</style>
<style lang="styl" scoped>
    @import '~static/css/validationrules'
</style>
