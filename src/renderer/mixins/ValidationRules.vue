<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
export default {
  methods: {
    validationRules: function(validator) {
      switch (validator) {
        case 'version':
          return {
            rules: {
              regex: /[\d]+\.[\d+]+\.[\d]/
            }
          }
        case 'name':
          return {
            required: true,
            regex: /^([-a-z0-9._/])+$/,
            unique_name: true
          }
        case 'integer':
          return 'numeric'
        case 'number':
          return 'decimal'
        // case 'date':
        //   return 'date_format:YYYY-MM-DD'
        // case 'time':
        //   return 'date_format:HH:mm:ss'
        // case 'datetime':
        //   return 'date_format:YYYY-MM-DD HH:mm:ssZ'
        // case 'year':
        //   return 'date_format:YYYY'
        // case 'yearmonth':
        //   return 'date_format:YYYY-MM'
        default:
          return ''
      }
    }
  },
  mounted: function() {
    const dict = {
      en: {
        custom: {
          version: {
            regex: 'The version field must comply with semantic versioning e.g. 1.0.0'
          },
          name: {
            regex: 'The name field format is invalid. It must consist only of lowercase alphanumeric characters plus ".", "-" and "_".'
          }
        }
      }
    }
    this.$validator.localize('en', dict)
  }
}
</script>
