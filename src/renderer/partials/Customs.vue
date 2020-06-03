<template>
  <div id="customs">
    <div
      v-for="(custom,gindex) in getCustoms"
      :key="gindex"
      class="custom col-sm-12"
    >
      <div
        v-for="prop in Object.keys(custom)"
        :id="'custom' + prop + gindex"
        :key="'custom' + prop + gindex"
        class="inputs-container"
      >
        <div
          v-if="prop !== 'type'"
          class="input-group text"
        >
          <span class="input-group-addon input-sm">{{ prop }}</span>
          <input
            :id="prop + gindex"
            v-validate="'required'"
            :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(prop + gindex) }"
            :value="custom[prop]"
            :name="prop + gindex"
            type="text"
            @input="setCustomProp(gindex, prop, $event.target.value)"
          >
        </div>
        <div
          v-else
          class="input-group type"
        >
          <span class="input-group-addon input-sm">type</span>
          <div class="custom-types">
            <label
              v-for="customType of customTypes"
              :key="customType + gindex"
              class="checkbox-inline form-control input-sm"
            ><input
              :id="prop + customType + gindex"
              type="checkbox"
              :checked="includesCustomProp(custom[prop], customType)"
              @click="setCustomPropChecked(gindex, prop, customType, $event.target.checked)"
            ><span>{{ customType }}</span></label>
          </div>
        </div>
        <div
          v-show="errors.has(prop + gindex)"
          class="row help validate-danger"
        >
          {{ errors.first(prop + gindex) }}
        </div>
      </div>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="removeCustom(gindex)"
      >
        <span class="glyphicon glyphicon-minus" />
      </button>
    </div>
    <div class="button-container">
      <button
        type="button"
        class="add-custom btn btn-primary btn-sm"
        @click="addCustom()"
      >
        <span class="glyphicon glyphicon-plus" />Add custom
      </button>
    </div>
  </div>
</template>
<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import AsyncComputed from 'vue-async-computed'
import ValidationRules from '../mixins/ValidationRules'
import Vue from 'vue'
Vue.use(AsyncComputed)
export default {
  name: 'Customs',
  extends: SideNav,
  mixins: [ValidationRules],
  props: {
    setProperty: {
      type: Function,
      default: function () {}
    },
    getProperty: {
      type: Function,
      default: function () {}
    },
    defaultSetter: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      customs: {},
      customTypes: ['column', 'table', 'package']
    }
  },
  computed: {
    ...mapGetters(['getActiveTab'])
  },
  asyncComputed: {
    getCustoms: {
      async get () {
        let customs = this.getProperty('customs') || []
        return customs
      },
      watch () {
        return this.customs
      }
    }
  },
  mounted: function () {
    this.initCustoms()
  },
  methods: {
    removeCustom: function (index) {
      let customs = this.getProperty('customs')
      customs.splice(index, 1)
      this.setProperty('customs', customs)
      this.customs = customs
    },
    addCustom: function () {
      let customs = this.getProperty('customs') || []
      customs.push(this.emptyCustom())
      this.setProperty('customs', customs)
      this.customs = customs
    },
    emptyCustom: function () {
      return { 'name': '', type: [] }
    },
    initCustoms: function () {
      this.customs = this.getProperty('customs')
    },
    includesCustomProp: function (current, customType) {
      return _.includes(current, customType)
    },
    setCustomPropChecked: function (index, prop, value, isChecked) {
      const existingCustom = _.get(this.customs, `[${index}][${prop}]`)
      const updatedCustom = isChecked ? _.union(existingCustom, [value]) : _.without(existingCustom, value)
      this.setCustomProp(index, prop, updatedCustom)
    },
    setCustomProp: function (index, prop, value) {
      if (typeof this.defaultSetter !== 'undefined') {
        this.defaultSetter(index, prop, value, 'customs')
      } else {
        this.setProperty(`customs[${index}][${prop}]`, value)
      }
      let customs = this.getProperty('customs') || []
      this.customs = customs
    }
  }
}
</script>
<style lang="styl" scoped>
  @import '~static/css/customs'
</style>
<style lang="styl" scoped>
  @import '~static/css/validationrules'
</style>
