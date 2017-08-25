<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'tabular',
  data() {
    return {
      formprops: [{
        label: 'title'
      },
      {
        label: 'name'
      },
      {
        label: 'profile'
      },
      {
        label: 'description'
      },
      {
        label: 'sources',
        type: 'dropdown'
      },
      {
        label: 'licences',
        type: 'dropdown'
      },
      {
        label: 'format'
      },
      {
        label: 'mediatype'
      },
      {
        label: 'encoding'
      }
      ]
    }
  }
}
</script>
