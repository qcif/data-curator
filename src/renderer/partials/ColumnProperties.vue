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
        type: 'dropdown',
        default: 'string'
      },
      {
        label: 'format',
        type: 'dropdown',
        default: 'default'
      },
      {
        label: 'rdfType',
        type: 'url'
      },
      {
        label: 'contraints',
        type: 'json'
      }
      ],
      types: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
      formats: {
        'string': ['email', 'uri', 'binary', 'uuid'],
        'date': ['any', 'pattern'],
        'time': ['any', 'pattern'],
        'datetime': ['any', 'pattern'],
        'geopoint': ['array', 'object'],
        'geojson': ['topojson']
      },
      constraints: ['required', 'unique', 'minLength', 'maxLength', 'minimum', 'maximum', 'pattern', 'enum'],
      otherProperties: ['missingValues', 'primaryKey', 'foreignKey']
    }
  },
  methods: {
  }
}
</script>
