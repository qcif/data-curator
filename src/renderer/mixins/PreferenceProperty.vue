<script>
import { ipcRenderer as ipc } from 'electron'
export default {
  name: 'PreferenceProperty',
  data () {
    return {
      hasPreferences: ['contributors', 'licenses', 'customs']
    }
  },
  methods: {
    setPreferencesAsDefault: function (key, setterFunction) {
      if (_.indexOf(this.hasPreferences, key) > -1) {
        const preferenceProperty = ipc.sendSync('getPreference', key)
        setterFunction(key, preferenceProperty)
        return preferenceProperty
      }
    }
  }
}
</script>
