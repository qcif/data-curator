<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'column',
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
        label: 'type',
        type: 'dropdown'
      },
      {
        label: 'format',
        type: 'dropdown'
      },
      {
        label: 'rdfType',
        type: 'url'
      },
      {
        label: 'contraints',
        type: 'json'
      }
      ]
    }
  }
}
</script>
