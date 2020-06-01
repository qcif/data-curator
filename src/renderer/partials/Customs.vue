<template>
  <div id="customs">
    <div
      v-for="(custom,gindex) in getCustoms"
      :key="gindex"
      class="custom col-sm-12"
    >
      <div class="inputs-container">
        <div
          v-for="prop in Object.keys(custom)"
          :id="prop + gindex"
          :key="prop + gindex"
          class="input-group"
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
          <div
            v-show="errors.has(prop + gindex)"
            class="row help validate-danger"
          >
            {{ errors.first(prop + gindex) }}
          </div>
        </div>
      </div>
      <select
              v-model="selectedCustomTypes"
              class="form-control custom-types input-sm"
              multiple
      >
        <option
                v-for="customType of customTypes"
                :key="customType + gindex"
                :value="prop + gindex"
        >
          {{ customType }}
        </option>
      </select>
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
      customs: [],
      selectedCustomTypes: [],
      customTypes: ['column', 'table', 'package']
    }
  },
  computed: {
    ...mapGetters(['getActiveTab']),
    selectedKeys: {
      get () {
        return this.getCustomType
      },
      set: function (value) {
        this.pushCustomType(value)
      }
    }
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
  watch: {
    selectedCustomTypes: function (selected) {
      this.setProperty('customTableProperties', this.licensesObject(selected))
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
      return { 'name': '' }
    },
    initCustoms: function () {
      this.customs = this.getProperty('customs')
      this.selectedCustomTypes = this.getCustomTypes()
    },
    getCustomTypes: function () {
      console.log('in get custom types')
    },
    setCustomProp: function (index, prop, value) {
      if (typeof this.defaultSetter !== 'undefined') {
        this.defaultSetter(index, prop, value, 'customs')
      } else {
        this.setProperty(`customs[${index}][${prop}]`, value)
      }
      let customs = this.getProperty('customs') || []
      this.customs = customs
    },
    customsObject: function (ids) {
      return []
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
