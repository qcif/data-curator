<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'default1',
  data() {
    return {
      formprops: [{
        label: 'name'
      },
      {
        label: 'title'
      },
      {
        label: 'description'
      },
      {
        label: 'licence'
      }
      ]
    }
  }
}
</script>
