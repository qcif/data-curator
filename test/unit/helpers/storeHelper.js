import store from '@/store/modules/hots'

export function resetHotStore() {
  store.state = {
    hotTabs: {},
    packageProperties: {},
    provenanceProperties: { markdown: '' }
  }
}
