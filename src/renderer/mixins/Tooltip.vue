<script>
export default {
  methods: {
    tooltip: function(property) {
      let object = {}
      object.html = property
      object.visible = property || false
      return object
    }
  }
}
</script>
