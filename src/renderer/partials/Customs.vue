<template>
  <div id="customs">
    <div
      v-for="(custom,gindex) in getCustoms"
      :key="gindex"
      class="custom col-sm-12"
    >
      <template v-if="isChildOfPreferences">
        <div
          v-for="prop in Object.keys(custom)"
          :id="'custom' + prop + gindex"
          :key="'custom' + prop + gindex"
          class="inputs-container"
        >
          <div
            v-if="prop !== 'types'"
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
            class="input-group types"
          >
            <span class="input-group-addon input-sm">types</span>
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
      </template>
      <template v-else-if="isChildOfCustomType(custom['types'])">
        <div
          class="input-group text"
        >
          <span class="input-group-addon input-sm">{{ custom['name'] }}</span>
          <input
            :id="'value' + gindex"
            :class="{ 'form-control input-sm': true }"
            :value="custom['value']"
            :name="'value' + gindex"
            type="text"
            @input="setCustomProp(gindex, value, $event.target.value)"
          >
        </div>
      </template>
    </div>
    <div
      v-if="isChildOfPreferences"
      class="button-container"
    >
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
      customTypes: ['column', 'table', 'package'],
      typesMappings: {
        tabular: 'table',
        packager: 'package',
        column: 'column'
      }
    }
  },
  computed: {
    ...mapGetters(['getActiveTab']),
    isChildOfPreferences () {
      return this.parentName === 'preferences'
    },
    isChildOfCustomType () {
      const parent = this.parentAsCustomType
      return (types) => {
        console.log('checking types')
        console.log(types)
        return _.find(types, function (t) { return parent === t })
      }
    },
    parentAsCustomType () {
      return _.get(this.typesMappings, this.parentName)
    },
    parentName () {
      return _.toLower(this.$parent.$options.name)
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
  mounted: function () {
    console.dir(this.$parent)
    console.dir(this.$parent.$options.name === 'Preferences')
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
      return { 'name': '', types: [] }
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
      this.customs = this.getProperty('customs') || []
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
