const navPanelType = {}

const rightSideNavStyle = '#sidenav.right.open .navbar-brand'
const leftSideNavStyle = '#sidenav.left.open .navbar-brand'
const footerMsgStyle = '#main-bottom-panel .message-title'
navPanelType[rightSideNavStyle] = ['Column', 'Table', 'Provenance', 'Package']
navPanelType[leftSideNavStyle] = ['Find and Replace']
navPanelType[footerMsgStyle] = ['Guess', 'Validate', 'Export']

export {
  rightSideNavStyle,
  leftSideNavStyle,
  footerMsgStyle,
  navPanelType
}
