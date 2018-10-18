<template>
<div id="container" class="container-fluid">
  <form>
    <p>
      <input :class="{ 'form-control': true, 'validate-danger': errors.has('url-dialog') }" type="text" id="url-dialog" name="url-dialog" v-validate="'url:true'" v-model="urlText"/>
    </p>
    <div v-show="errors.has('url-dialog')" class="row help validate-danger">
      {{ errors.first('url-dialog')}}
    </div>
    <div class="submit-container">
      <button id="submit" class="btn btn-default" @click.prevent="submit">{{submitText}}</button> <button id="cancel" class="btn btn-default" @click.prevent="cancel">Cancel</button>
    </div>
  </form>
</div>
</template>
<script>
import { ipcRenderer as ipc } from 'electron'
export default {
  name: 'urldialog',
  data() {
    return {
      urlText: '',
      submitText: 'Open URL'
    }
  },
  methods: {
    submit: function() {
      ipc.send('urlSubmitted', this.urlText)
    },
    cancel: function() {
      ipc.send('urlCancelled')
    },
    updateSubmitText: function(text) {
      this.submitText = text
    },
    resetUrlTextOnError: function() {
      if (this.errors.has('url-dialog')) {
        this.urlText = ''
      }
    }
  },
  mounted: function() {
    const vueUpdateSubmitText = this.updateSubmitText
    ipc.on('urlDialog', function(event, arg) {
      vueUpdateSubmitText(arg)
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/url-dialog'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
