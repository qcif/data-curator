import store from '@/store'

export function pushCsvDialect(guid, formatOriginal = {}) {
  let format = {}
  _.assign(format, formatOriginal)
  // TODO : neaten up to merge existing values and then push all up
  if (format.dialect) {
    _.unset(format.dialect, 'objectMode')
    _.merge(format.dialect, {header: true})
    _.forEach(format.dialect, function(value, key) {
      store.commit('pushTableProperty', {hotId: guid, key: `dialect.${key}`, value: value})
    })
  }
  if (format.mediatype) {
    store.commit('pushTableProperty', {hotId: guid, key: 'mediatype', value: format.mediatype})
  }
  if (format.format) {
    store.commit('pushTableProperty', {hotId: guid, key: 'format', value: format.format})
  }
  console.log(store)
}
