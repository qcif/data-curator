<script>
export default {
  data() {
    return {
      tooltipStyle: 'color:#fff;padding-left:20px;'
    }
  },
  methods: {
    tooltip: function(property) {
      let object = {}
      object.html = property
      object.visible = property || false
      // object.style = this.tooltipStyle
      return object
    }
  }
}
</script>
