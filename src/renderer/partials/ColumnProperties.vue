  <template>
  <form class="navbar-form form-horizontal" id="columnProperties">
    <div class="form-group-sm row container-fluid">
      <div v-for="(formprop, index) in formprops" :key="index">
        <label v-tooltip.left.click="tooltip(formprop.tooltipId)" :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
        <component :is="formprop.tooltipView"/>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label==='type'" :value="getPropertyType()" @input="setPropertyType($event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-8">
            <option v-for="option in typeValues" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <select v-else-if="formprop.label==='format'" v-model="selectFormat" id="format" :disabled="isDropdownFormatDisabled" class="form-control input-sm col-sm-8">
            <option v-for="option in formatValues" v-bind:value="option">
              {{ option}}
            </option>
          </select>
        </template>
        <div v-else-if="formprop.label === 'constraints'" id="constraints" class="col-sm-8">
          <template v-for="option in constraintValues">
            <div class="input-group row">
              <input type="checkbox" :id="option" :value="option" v-model="selectConstraints"></input>
              <label for="option" class="form-control-static">{{option}}</label>
              <input v-show="showConstraint(option)" v-validate="constraintValidationRules(option)" :name="option" type="text" :class="{ 'form-group-sm constraint-text': true, 'validate-danger': errors.has(option) }" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)"/>
            </div>
            <div v-show="errors.has(option) && selectConstraints.indexOf(option) > -1" class="row help validate-danger">
              {{ errors.first(option)}}
            </div>
          </template>
        </div>
        <!-- <input v-else :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control label-sm col-sm-8" :id="formprop.label" /> -->
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
        'date': ['required', 'unique', 'minimum', 'maximum', 'enum', 'pattern'],
        'time': ['required', 'unique', 'minimum', 'maximum', 'enum', 'pattern'],
        'datetime': ['required', 'unique', 'minimum', 'maximum', 'enum', 'pattern'],
        'year': ['required', 'unique', 'minimum', 'maximum', 'enum', 'pattern'],
        'yearmonth': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum', 'pattern'],
        'duration': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'geopoint': ['required', 'unique', 'enum'],
        'geojson': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'any': ['required', 'unique', 'enum']
      },
      constraintBooleanBindings: {
        'required': true,
        'unique': true
      },
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
      'pushHotProperty'
    ]),
    showConstraint: function(option) {
      return Object.keys(this.constraintBooleanBindings).indexOf(option) === -1 && this.selectConstraints.indexOf(option) > -1
    },
    setProperty: function(key, value) {
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      this.pushHotProperty(object)
    },
    getProperty: function(key) {
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key
      }
      return this.getHotProperty(object)
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
      this.constraintValues = this.constraints[value]
      this.formatValues = this.formats[value]
    },
    getConstraintValue: function(key) {
      // let constraints = this.getConstraints
      // // let constraints = this.getProperty('constraints')
      // if (constraints) {
      //   return constraints[key]
      // }
    },
    setConstraintValue: function(key, value) {
      // this.constraintInputKeyValues[key] = value
      // this.updateConstraints()
    },
    constraintValidationRules: function(option) {
      // if (this.selectConstraints.indexOf(option) > -1) {
      //   if (_.indexOf(['minLength', 'maxLength'], option) > -1) {
      //     return 'numeric'
      //   } else if (_.indexOf(['minimum', 'maximum'], option) > -1) {
      //   // let type = this.getProperty('type')
      //   // if (type === 'integer') {
      //   //   return numeric
      //   // }
      //   } else {
      //   // console.log('No validation rules to apply this constraint')
      //   }
      // }
      return ''
    }
    // updateConstraints: function() {
    // console.log('got constraints update')
    // let test = this.selectConstraints
    // let merged = { ...this.constraintInputKeyValues
    // }
    // _.merge(merged, this.constraintBooleanBindings)
    // this.constraintInputKeyValues = this.selectConstraints.reduce(
    //   function(previous, current) {
    //     if (_.has(merged, current)) {
    //       return { ...previous,
    //         [current]: merged[current]
    //       }
    //     } else {
    //       return previous
    //     }
    //   }, {}
    // )
    // this.setProperty('constraints', this.constraintInputKeyValues)
    // }
  },
  computed: {
    ...mapGetters([
      'getHotProperty'
    ]),
    // updateConstraints() {
    //   console.log('got constraints update')
    //   return this.selectConstraints
    // },
    // getActiveColumnProperties() {
    //   // console.log('getting active column properties...')
    //   let allColumnsProperties = this.getAllColumnsProperties
    //   // console.log(allColumnsProperties)
    //   // console.log(`active column index: ${this.cIndex}`)
    //   if (allColumnsProperties) {
    //     // console.log('got all columns properties')
    //     // allColumnsProperties.forEach((el) => {
    //     //   console.log('counting')
    //     //   console.log(el)
    //     // })
    //     // console.log(allColumnsProperties[this.cIndex])
    //     return allColumnsProperties[this.cIndex]
    //   }
    // },
    isDropdownFormatDisabled() {
      return this.formatValues.length < 2
    },
    // getPropertyFormat() {
    //   return this.getProperty('format')
    // },
    // getPropertyConstraints() {
    //   return this.getProperty('constraints')
    // },
    getConstraints() {
      // console.log('triggered get constraints')
      // let type = this.getProperty('type')
      // if (type) {
      //   this.constraintValues = this.constraints[type]
      // }
      // let property = this.getProperty('constraints')
      // if (!property) {
      //   this.setProperty('constraints', {})
      //   property = {}
      // }
      // return property
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
    // selectConstraints: function(values) {
    //   console.log('constraint watched...')
    //   // this.getConstraints
    //   this.updateConstraints()
    // }
    // getConstraints: function(object) {
    //   this.selectConstraints = Object.keys(object)
    // },
  },
  // created: function() {
  //   if (!this.formatValues) {
  //     this.formatValues = []
  //   }
  // },
  mounted: function() {
    this.$nextTick(function() {
      reselectCurrentCellOrMin()
      console.log('next tick')
      // this.selectConstraints = Object.keys(this.getConstraints)
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/columnprops'
</style>
