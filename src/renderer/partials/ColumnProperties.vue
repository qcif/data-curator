  <template>
  <form class="navbar-form form-horizontal" id="columnProperties">
    <div class="form-group-sm row container-fluid">
      <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
        <label v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label col-sm-3" :for="formprop.label">
        <!-- <label class="control-label col-sm-3" :for="formprop.label"> -->
          {{formprop.label}}:
        </label>
        <component :is="formprop.tooltipView"/>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <!-- <select v-if="formprop.label==='type'" v-model="typeProperty" :id="formprop.label" class="form-control input-sm col-sm-9"> -->
          <select v-if="formprop.label==='type'" :value="getTypeProperty()" @input="setTypeProperty($event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-9">
            <option v-for="option1 in typeValues" :key="option1" v-bind:value="option1">
              {{ option1}}
            </option>
          </select>
          <select v-else-if="formprop.label==='format'" v-model="selectFormat" id="format" :disabled="isDropdownFormatDisabled" class="form-control input-sm col-sm-9">
            <option v-for="option2 in formatValues" :key="option2" v-bind:value="option2">
              {{ option2}}
            </option>
          </select>
        </template>
        <div v-else-if="formprop.label === 'constraints'" id="constraints" class="col-sm-9">
          <div class="input-group row" v-for="option in constraintValues" :key="option">
            <input type="checkbox" :id="option" :checked="getConstraintCheck(option)" @click="setConstraintCheck(option, $event.target)"></input>
            <label :for="option" class="form-control-static">{{option}}</label>
            <template v-if="!isBooleanConstraint(option)">
              <input type="text" :class="{ 'form-group-sm constraint-text': true,'validate-danger': errors.has(option) }" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)" v-validate="constraintValidationRules(option)" :name="option"/>
              <!-- <input type="text" :class="{ 'form-group-sm constraint-text': true }" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)" :name="option"/> -->
            </template>
            <div v-show="errors.has(option) && removeConstraint(option)" class="row help validate-danger">
              {{ errors.first(option)}}
            </div>
          </div>
        </div>
        <input v-else-if="formprop.label === 'name'" :disabled="formprop.isDisabled" :value="getNameProperty" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control label-sm col-sm-9" :id="formprop.label" />
        <input v-else :disabled="formprop.isDisabled" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control label-sm col-sm-9" :id="formprop.label" />
      </div>
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/elementAt'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounce'
import 'rxjs/add/observable/timer'
import { onNextHotIdRx, activeRxTab, propertyType } from '@/rxSubject.js'
import {getHotColumnPropertiesFromPropertyObject} from '@/store/modules/hots.js'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {
  HotRegister,
  reselectCurrentCellOrMin
} from '@/hot.js'
import ColumnTooltip from '../mixins/ColumnTooltip'
Vue.use(VueRx, {
  Subscription,
  Subject,
  Observable
})
export default {
  extends: SideNav,
  name: 'column',
  mixins: [ColumnTooltip],
  props: ['cIndex'],
  data() {
    return {
      // hotIdRxFromTab: null,
      // activeTabColumnProperties: null,
      // currentColumnType: '',
      typeValues: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
      formatValues: [],
      // formatXValues: [],
      // constraintValues: [],
      // selectConstraints: [],
      // constraintInputKeyValues: {},
      // constraintInputKeys: [],
      // activeTabColumnProperties: [],
      formprops: [
      //   {
      //   label: 'name',
      //   tooltipId: 'tooltip-column-name',
      //   tooltipView: 'tooltipColumnName',
      //   isDisabled: true
      // },
      // {
      //   label: 'title',
      //   tooltipId: 'tooltip-column-title',
      //   tooltipView: 'tooltipColumnTitle'
      // },
      // {
      //   label: 'description',
      //   tooltipId: 'tooltip-column-description',
      //   tooltipView: 'tooltipColumnDescription'
      // },
        {
          label: 'type',
          tooltipId: 'tooltip-column-type',
          tooltipView: 'tooltipColumnType',
          type: 'dropdown'
        },
        {
          label: 'format',
          tooltipId: 'tooltip-column-format',
          tooltipView: 'tooltipColumnFormat',
          type: 'dropdown'
        }
      // {
      //   label: 'constraints',
      //   tooltipId: 'tooltip-column-constraints',
      //   tooltipView: 'tooltipColumnConstraints',
      //   type: 'checkbox'
      // },
      // {
      //   label: 'rdfType',
      //   tooltipId: 'tooltip-column-rdfType',
      //   tooltipView: 'tooltipColumnRdfType',
      //   type: 'url'
      // }
      ],
      formats: {
        'string': ['email', 'uri', 'binary', 'uuid', 'default'],
        'number': ['default'],
        'integer': ['default'],
        'boolean': ['default'],
        'object': ['default'],
        'array': ['default'],
        'date': ['any', 'pattern', 'default'],
        'time': ['any', 'pattern', 'default'],
        'datetime': ['any', 'pattern', 'default'],
        'year': ['default'],
        'yearmonth': ['default'],
        'duration': ['default'],
        'geopoint': ['array', 'object', 'default'],
        'geojson': ['topojson', 'default'],
        'any': ['default']
      },
      constraints: {
        'string': ['required', 'unique', 'minLength', 'maxLength', 'pattern', 'enum'],
        'number': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'integer': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'boolean': ['required', 'enum'],
        'object': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'array': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'date': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'time': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'datetime': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'year': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'yearmonth': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'duration': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'geopoint': ['required', 'unique', 'enum'],
        'geojson': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'any': ['required', 'unique', 'enum']
      },
      constraintBooleanBindings: ['required', 'unique'],
      validationRulesByType: {
        'integer': 'numeric',
        'number': 'decimal',
        'date': 'date_format',
        'time': 'date_format',
        'datetime': 'date_format',
        'year': 'date_format',
        'yearmonth': 'date_format'
      }
    }
  },
  // subscriptions () {
  //   let vueFormats = this.formats
  //   return {
  //   }
  // },
  methods: {
    ...mapMutations([
      'pushColumnProperty'
    ]),
    isBooleanConstraint: function(option) {
      return this.constraintBooleanBindings.indexOf(option) > -1
    },
    getTypeProperty: function() {
      let property = this.getProperty('type')
      if (!property) {
        // console.log('about to set default property for selectFormat...')
        this.setProperty('type', 'any')
        property = 'any'
      }
      console.log(`got typeProperty property: ${property}`)
      return property
    },
    setTypeProperty: function(value) {
      console.log('about to set type...')
      this.setProperty('type', value)
      // this.currentColumnType = value
    },
    getProperty: function(key) {
      // console.log(`getProperty got property ${key}`)
      // console.log(`current hot id is ${this.currentHotId}`)
      // console.log(`current column index: ${this.cIndex}`)
      // this.currentHotId = HotRegister.getActiveInstance().guid
      if (!this.currentHotId) {
        this.currentHotId = HotRegister.getActiveInstance().guid
      }
      let columnProperties = this.currentHotId ? getHotColumnPropertiesFromPropertyObject({hotId: this.currentHotId, columnIndex: this.cIndex}) : {}
      let value = columnProperties[key]
      console.log(`got column property key value: ${key}: ${value}`)
      return value
    },
    setProperty: function(key, value) {
      // let object = this.storeObject
      // object.key = key
      // object.value = value
      // TODO: change to use method once tested object refs ok
      console.log(`current hot id is: ${this.currentHotId}`)
      // let hotId = HotRegister.getActiveInstance().guid
      let currentColumnIndex = this.cIndex
      // console.log(`current index is ${currentColumnIndex}`)
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      this.pushColumnProperty(object)
      console.log(`setproperty committed for ${key}`)
      // console.log(`current hot id is ${this.currentHotId}`)
      // if (this.currentHotId) {
      //   this.activeTabColumnProperties.next(this.getAllHotColumnPropertiesFromHotId(this.currentHotId))
      // }
    },
    // // must not cache to ensure view always updates on selection
    // setPropertyType: function(value) {
    //   console.log('setting property type...')
    //   this.setProperty('type', value)
    //   // this.updateTypeDependentProperties(value)
    // },
    // updateTypeDependentProperties: function(value) {
    //   console.log(`value is ${value}`)
    //   // this.formatXValues = this.formats[value]
    //   let formatValues = this.formats[value]
    //   this.formatValues = formatValues
    //   console.log(`format values is`)
    //   console.log(formatValues)
    //   // this.constraintValues = this.constraints[value]
    // },
    // getConstraintCheck: function(key) {
    //   // let object = this.storeObject
    //   const hotId = HotRegister.getActiveInstance().guid
    //   const currentColumnIndex = this.cIndex
    //   let object = {
    //     'hotId': hotId,
    //     'columnIndex': currentColumnIndex
    //   }
    //   let constraints = this.getHotColumnConstraints(object)
    //   this.constraintInputKeyValues = constraints || {}
    //   return _.has(constraints, key)
    // },
    // toggleTextNode: function(checkedInput) {
    //   let textNode = checkedInput.parentNode.querySelector('.constraint-text')
    //   if (textNode) {
    //     textNode.style.display = checkedInput.checked ? 'inline-block' : 'none'
    //   }
    // },
    // setConstraintCheck: function(key, target) {
    //   let isChecked = target.checked
    //   this.toggleTextNode(target)
    //   if (!isChecked) {
    //     _.unset(this.constraintInputKeyValues, key)
    //   } else if (this.constraintBooleanBindings.indexOf(key) > -1) {
    //     this.constraintInputKeyValues[key] = isChecked
    //   } else {
    //     // let object = this.storeObject()
    //     // object.key = key
    //     const hotId = HotRegister.getActiveInstance().guid
    //     const currentColumnIndex = this.cIndex
    //     let object = {
    //       'hotId': hotId,
    //       'columnIndex': currentColumnIndex,
    //       'key': key
    //     }
    //     let currentValue = this.getConstraint(object) || ''
    //     this.constraintInputKeyValues[key] = currentValue
    //   }
    //   this.setProperty('constraints', this.constraintInputKeyValues)
    //   this.$forceUpdate()
    // },
    // getConstraintValue: function(key) {
    //   let property = this.getProperty('constraints')
    //   if (!property) {
    //     property = {}
    //   }
    //   return property[key]
    // },
    // removeConstraint: function(key) {
    //   this.constraintInputKeyValues[key] = ''
    //   this.setProperty('constraints', this.constraintInputKeyValues)
    //   return true
    // },
    // setConstraintValue: function(key, value) {
    //   this.constraintInputKeyValues[key] = value
    //   this.setProperty('constraints', this.constraintInputKeyValues)
    // },
    // constraintValidationRules: function(option) {
    //   if (_.indexOf(['minLength', 'maxLength'], option) > -1) {
    //     return 'numeric'
    //   } else if (_.indexOf(['minimum', 'maximum'], option) > -1) {
    //     let type = this.getProperty('type')
    //     if (type === 'integer') {
    //       return 'numeric'
    //     } else if (type === 'number') {
    //       return 'decimal'
    //     } else {
    //       // console.log('No validation rules to apply this type for constraints: min/max')
    //     }
    //   } else {
    //     // console.log('No validation rules to apply this constraint')
    //   }
    //   return ''
    // },
    // updateActiveTabColumnProperties: function(columnProperties) {
    //   this.activeTabColumnProperties = columnProperties
    // },
    updateDepdendencies: function(nextHotId) {
      console.log(`next hot id for update depens is ${nextHotId}`)
      this.currentHotId = nextHotId
      this.activeTabColumnProperties.next(this.getAllHotColumnPropertiesFromHotId(nextHotId))
    },
    updateFormatValues: function(columnProperties) {
      console.log('updated columnProperties for format values:')
      // console.log(columnProperties)
      if (columnProperties) {
        let typeValue = columnProperties.type
        // console.log(`type value is: ${typeValue}`)
        let updatedFormatValues = this.formats[typeValue]
        // console.log(`format values updated is: ${updatedFormatValues}`)
        if (updatedFormatValues) {
          this.formatValues = updatedFormatValues
        }
      }
    }
  },
  watch: {
    setTypeProperty: function(updateType) {
      console.log('updated type...')
      console.log(updateType)
    }
  },
  computed: {
    ...mapGetters([
      'getActiveTab', 'getHotColumnProperty', 'getConstraint', 'getHotColumnConstraints', 'getTableProperty', 'getAllHotColumnPropertiesFromHotId'
    ]),
    // formatValues() {
    //   let seed = this.currentColumnType
    //   console.log(`seed is ${seed}`)
    //   let value = this.formats[seed]
    //   return value
    // },
    // storeObject() {
    //   const hotId = HotRegister.getActiveInstance().guid
    //   const currentColumnIndex = this.cIndex
    //   let object = {
    //     'hotId': hotId,
    //     'columnIndex': currentColumnIndex
    //   }
    //   return object
    // },
    // getNameProperty() {
    //   // console.log('entered get name property...')
    //   // let value = ''
    //   const headers = HotRegister.getActiveInstance().getColHeader()
    //   // console.log(headers)
    //   let value = ''
    //   if (headers) {
    //     // each column header may be set to false
    //     value = headers[this.cIndex] ? headers[this.cIndex] : ''
    //     this.setProperty('name', value)
    //   }
    //   // console.log(`got column property key value: ${key}: ${value}`)
    //   return value
    // },
    isDropdownFormatDisabled() {
      return false
      // return this.formatValues.length < 2
    },
    selectFormat: {
      get: function() {
        // console.log('about to get select format...')
        let property = this.getProperty('format')
        if (!property) {
          // console.log('about to set default property for selectFormat...')
          this.setProperty('format', 'default')
          property = 'default'
        }
        console.log('got selectFormat property')
        return property
      },
      set: function(value) {
        console.log('about to set format...')
        this.setProperty('format', value)
      }
    }
  },
  created: function() {
    console.log('created...')
  },
  mounted: function() {
    // let vueUpdateDepdendencies = this.updateDepdendencies
    // let vueUpdateFormatValues = this.updateFormatValues
    // if (!this.activeTabColumnProperties) {
    //   this.activeTabColumnProperties = new Subject()
    //   this.$subscribeTo(this.activeTabColumnProperties, function(columnProperties) {
    //     console.log('received subscription to active tab column properties.')
    //     console.log(columnProperties)
    //     vueUpdateFormatValues(columnProperties[0])
    //   })
    // }
    // if (!this.hotIdRxFromTab) {
    //   this.hotIdRxFromTab = new Subject()
    //   this.$subscribeTo(this.hotIdRxFromTab, function(nextHotId) {
    //     console.log('received subscription')
    //     vueUpdateDepdendencies(nextHotId)
    //   })
    // }

    //  new Observable.create(observer => {
    //   // Yield a single value and complete
    //   observer.onNext(42)
    //   observer.onCompleted()
    //
    //   // Any cleanup logic might go here
    //   return () => console.log('disposed')
    // })

    console.log('triggered mount')

    onNextHotIdRx(this.hotIdRxFromTab, this.getHotIdFromTabId)
    // // set initial property
    activeRxTab.next(this.getActiveTab)
  },
  destroyed: function() {
    console.log('panel destroyed')
    // this.activeTabColumnProperties.unsubscribe()
    // this.hotIdRxFromTab.unsubscribe()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/columnprops'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
