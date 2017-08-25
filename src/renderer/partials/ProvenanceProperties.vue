<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'provenance',
  data() {
    return {
      formprops: [{
        label: 'description',
        type: 'markdown'
      }]
    }
  }
}
</script>
