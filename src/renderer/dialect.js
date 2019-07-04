import store from '@/store'

export function pushCsvDialect (guid, dialect) {
  pushCsvFormat(guid, { dialect: dialect })
}

export function pushCsvFormat (guid, formatOriginal = {}) {
  let format = {}
  _.assign(format, formatOriginal)
  // TODO : neaten up to merge existing values and then push all up
  if (format.dialect) {
    _.unset(format.dialect, 'objectMode')
    _.forEach(format.dialect, function (value, key) {
      store.commit('pushTableProperty', { hotId: guid, key: `dialect.${key}`, value: value })
    })
  }
  if (format.mediatype) {
    store.commit('pushTableProperty', { hotId: guid, key: 'mediatype', value: format.mediatype })
  }
  if (format.format) {
    store.commit('pushTableProperty', { hotId: guid, key: 'format', value: format.format })
  }
}
