<template>
<div class="list-group" id="preferenceProperties">
  <a href="#" class="list-group-item" v-for="(menuItem, index) in menuItems" :key="index" @click="callback(menuItem.method)">
    {{menuItem.label}}
  </a>
</div>
</template>
<script>
import {Table} from 'tableschema'
import {Resource, Package} from 'datapackage'
import {
  HotRegister
} from '../hot.js'
export default {
  name: 'preferences',
  data() {
    return {
      menuItems: [{
        label: 'Guess column property',
        method: 'guessProperties'
      }]
    }
  },
  methods: {
    callback(methodName) {
      console.log(`called ${methodName}`)
      this.$emit('guessProperties')
    }
  },
  created: function() {
    this.$on('guessProperties', async function() {
      console.log('guessing properties...')
      let hot = HotRegister.getActiveInstance()
      console.log(hot.getData())
      // table
      let data = hot.getData()
      const table = await Table.load(data)
      console.log(table)
      await table.infer()
      console.log('headers...')
      console.log(table.headers)
      console.log('descriptor...')
      let tableDescriptor = table.schema.descriptor
      console.log(tableDescriptor)
      // datapackage
      console.log('datapackage....')
      console.log(`data is: ${data}`)
      console.dir(data)
      const resource = await Resource.load({table: data})
      console.dir(resource)
      // let datapackage = await Package.load()

      // let dummy = await datapackage.infer(data)
      // console.dir(datapackage)
      // let packageDescriptor = datapackage.descriptor
      // console.dir(packageDescriptor)
    })
  }
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style scoped>
@import '~static/css/panels'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
