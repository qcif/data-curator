<template>
  <div class="radioContainer">
    <span v-for="(radioprop, index) in radioprops">
      <input type="radio" :id="radioprop.key" :value="radioprop.value" @click="setter($event.target.value)" @blur="updateVModel" v-model="vModel">
      <label class="inline" :for="radioprop.key">{{radioprop.label}}</label>
    </span>
</div>
</template>
<script>
import VueRx from 'vue-rx'
import Vue from 'vue'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  bareNumber$
} from '@/rxSubject.js'
Vue.use(VueRx, {
  Subscription
})
export default {
  props: ['getter', 'setter', 'radioId'],
  name: 'radioTrueFalse',
  data() {
    return {
      radioprops: [{
        label: 'True',
        key: `true${this.radioId}`,
        value: true
      }, {
        label: 'False',
        key: `false${this.radioId}`,
        value: false
      }],
      vModel: null
    }
  },
  methods: {
    updateVModel: function() {
      console.log('updating vModel')
      this.vModel = this.getter()
      console.log(`v model`, this.vModel)
      this.$forceUpdate()
    }
  },
  mounted: function() {
    console.log('mounted...')
    this.updateVModel()
    console.log(this.vModel)
    let self = this
    this.$subscribeTo(bareNumber$, function(result) {
      self.updateVModel()
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/radiotruefalse'
</style>
