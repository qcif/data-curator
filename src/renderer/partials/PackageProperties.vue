<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'package',
  data() {
    return {
      formprops: [{
        label: 'name',
        type: 'input'
      },
      {
        label: 'id',
        type: 'input'
      },
      {
        label: 'licenses',
        type: 'json'
      },
      {
        label: 'profile'
      },
      {
        label: 'title',
        type: 'input'
      },
      {
        label: 'description',
        type: 'markdown'
      },
      {
        label: 'version',
        type: 'input'
      },
      {
        label: 'sources',
        type: 'json'
      }
      ]
    }
  }
}
</script>
