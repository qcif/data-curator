import { fileFormats } from './file-formats'

const sharedMenus = {
  insertRowAbove: {
    label: 'Insert Row Above',
    accelerator: 'CmdOrCtrl+I'
  },
  insertRowBelow: {
    label: 'Insert Row Below',
    accelerator: 'CmdOrCtrl+K'
  },
  insertColumnBefore: {
    label: 'Insert Column Before',
    accelerator: 'CmdOrCtrl+J',
    lockable: true
  },
  insertColumnAfter: {
    label: 'Insert Column After',
    accelerator: 'CmdOrCtrl+L',
    lockable: true
  },
  removeRows: {
    label: 'Remove Row(s)'
  },
  removeColumns: {
    label: 'Remove Column(s)',
    lockable: true
  }
}

export {
  sharedMenus, fileFormats
}
