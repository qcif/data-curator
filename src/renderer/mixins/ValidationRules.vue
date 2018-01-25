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
            regex: /^([-a-z0-9._/])+$/
          }
        case 'integer':
          return 'numeric'
        case 'number':
          return 'decimal'
        case 'enum':
        case 'pattern':
          return {
            required: true
          }
        default:
          return ''
      }
    }
  },
  mounted: function() {
    const dict = {
      en: {
        // messages: {
        //   email: () => `The email field must be a valid email.`
        // },
        custom: {
          version: {
            regex: 'The version field must comply with semantic versioning e.g. 1.0.0'
          },
          name: {
            regex: 'The name field format is invalid. It must consist only of lowercase alphanumeric characters plus ".", "-" and "_".'
          },
          enum: {
            required: 'Separate valid values with a comma.'
          },
          pattern: {
            required: 'There must be a pattern present.'
          },
          formatValue: {
            required: 'There must be a format value pattern present.'
          },
          sourceUrl: {
            url: 'The path field must be a valid email or path.'
          },
          sourcePath: {
            regex: 'The path field must be a valid email or path.'
          }
        }
      }
    }
    VeeValidate.Validator.localize(dict)
  }
}
</script>
