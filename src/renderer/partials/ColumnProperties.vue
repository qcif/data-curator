  <template>
  <form class="navbar-form form-horizontal" id="columnProperties">
    <div class="form-group-sm row container-fluid">
      <div v-for="(formprop, index) in formprops" :key="index">
        <label v-tooltip.left.click="tooltip(formprop.tooltipId)" :style="{paddingLeft: '0'}" class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
        <component :is="formprop.tooltipView"/>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label==='type'" :value="getPropertyType()" @input="setPropertyType($event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-9">
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
              <!-- <input type="text" :class="{ 'form-group-sm constraint-text': true,'validate-danger': errors.has(option) }" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)" v-validate="constraintValidationRules(option)" :name="option"/> -->
              <input type="text" :class="{ 'form-group-sm constraint-text': true }" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)" :name="option"/>
            </template>
            <!-- <div v-show="errors.has(option) && removeConstraint(option)" class="row help validate-danger">
              {{ errors.first(option)}}
            </div> -->
          </div>
        </div>
        <input v-else :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control label-sm col-sm-9" :id="formprop.label" />
      </div>
    </div>
  </div>
</form>
</template>
<script>
import {
  remote
} from 'electron'
import SideNav from './SideNav'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import {
  HotRegister,
  reselectCurrentCellOrMin
} from '../hot.js'
const Dialog = remote.dialog
export default {
  extends: SideNav,
  name: 'column',
  props: ['getAllColumnsProperties', 'cIndex'],
  data() {
    return {
      typeValues: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
      formatValues: [],
      constraintValues: [],
      selectConstraints: [],
      constraintInputKeyValues: {},
      constraintInputKeys: [],
      formprops: [{
        label: 'name',
        tooltipId: 'tooltip-column-name',
        tooltipView: 'tooltipColumnName'

      },
      {
        label: 'title',
        tooltipId: 'tooltip-column-title',
        tooltipView: 'tooltipColumnTitle'
      },
      {
        label: 'description',
        tooltipId: 'tooltip-column-description',
        tooltipView: 'tooltipColumnDescription'
      },
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
      },
      {
        label: 'constraints',
        tooltipId: 'tooltip-column-constraints',
        tooltipView: 'tooltipColumnConstraints',
        type: 'checkbox'
      },
      {
        label: 'rdfType',
        tooltipId: 'tooltip-column-rdfType',
        tooltipView: 'tooltipColumnRdfType',
        type: 'url'
      }
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
  methods: {
    ...mapMutations([
      'pushColumnProperty'
    ]),
    isBooleanConstraint: function(option) {
      return this.constraintBooleanBindings.indexOf(option) > -1
    },
    setProperty: function(key, value) {
      // let object = this.storeObject
      // object.key = key
      // object.value = value
      // TODO: change to use method once tested object refs ok
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      this.pushColumnProperty(object)
    },
    getProperty: function(key) {
      // let object = this.storeObject
      // object.key = key
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key
      }
      return this.getHotColumnProperty(object)
    },
    // must not cache to ensure view always updates on selection
    getPropertyType() {
      let type = this.getProperty('type')
      if (!type) {
        type = 'any'
        this.setPropertyType(type)
      }
      this.updateTypeDependentProperties(type)
      return type
    },
    setPropertyType: function(value) {
      this.setProperty('type', value)
      this.updateTypeDependentProperties(value)
    },
    updateTypeDependentProperties: function(value) {
      this.formatValues = this.formats[value]
      this.constraintValues = this.constraints[value]
    },
    getConstraintCheck: function(key) {
      // let object = this.storeObject
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex
      }
      let constraints = this.getHotColumnConstraints(object)
      this.constraintInputKeyValues = constraints || {}
      return _.has(constraints, key)
    },
    toggleTextNode: function(checkedInput) {
      let textNode = checkedInput.parentNode.querySelector('.constraint-text')
      if (textNode) {
        textNode.style.display = checkedInput.checked ? 'inline-block' : 'none'
      }
    },
    setConstraintCheck: function(key, target) {
      let isChecked = target.checked
      this.toggleTextNode(target)
      if (!isChecked) {
        _.unset(this.constraintInputKeyValues, key)
      } else if (this.constraintBooleanBindings.indexOf(key) > -1) {
        this.constraintInputKeyValues[key] = isChecked
      } else {
        // let object = this.storeObject()
        // object.key = key
        const hotId = HotRegister.getActiveInstance().guid
        const currentColumnIndex = this.cIndex
        let object = {
          'hotId': hotId,
          'columnIndex': currentColumnIndex,
          'key': key
        }
        let currentValue = this.getConstraint(object) || ''
        this.constraintInputKeyValues[key] = currentValue
      }
      this.setProperty('constraints', this.constraintInputKeyValues)
      this.$forceUpdate()
    },
    getConstraintValue: function(key) {
      let property = this.getProperty('constraints')
      if (!property) {
        this.setProperty('constraints', {})
        property = {}
      }
      return property[key]
    },
    removeConstraint: function(key) {
      this.constraintInputKeyValues[key] = ''
      this.setProperty('constraints', this.constraintInputKeyValues)
      return true
    },
    setConstraintValue: function(key, value) {
      this.constraintInputKeyValues[key] = value
      this.setProperty('constraints', this.constraintInputKeyValues)
    },
    constraintValidationRules: function(option) {
      // if (_.indexOf(['minLength', 'maxLength'], option) > -1) {
      //   return 'numeric'
      // } else if (_.indexOf(['minimum', 'maximum'], option) > -1) {
      //   let type = this.getProperty('type')
      //   if (type === 'integer') {
      //     return 'numeric'
      //   } else if (type === 'number') {
      //     return 'decimal'
      //   }
      // } else {
      //   // console.log('No validation rules to apply this constraint')
      // }
      // }
      return ''
    }
  },
  computed: {
    ...mapGetters([
      'getHotColumnProperty', 'getConstraint', 'getHotColumnConstraints'
    ]),
    storeObject() {
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex
      }
      return object
    },
    isDropdownFormatDisabled() {
      return this.formatValues.length < 2
    },
    selectFormat: {
      get: function() {
        let property = this.getProperty('format')
        if (!property) {
          this.setProperty('format', 'default')
          property = 'default'
        }
        // if (property === 'pattern') {
        //   this.selectConstraints.push(property)
        // }
        return property
      },
      set: function(value) {
        this.setProperty('format', value)
      }
    }
  },
  watch: {
  },
  mounted: function() {
    this.$nextTick(function() {
      reselectCurrentCellOrMin()
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/columnprops'
</style>
