<script>
export default {
  methods: {
    validationRules: function(label) {
      switch (label) {
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
        default:
          return ''
      }
    }
  }
}
</script>
