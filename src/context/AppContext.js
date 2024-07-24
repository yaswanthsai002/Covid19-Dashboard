import React from 'react'

const AppContext = React.createContext({
  statesList: [],
  navTabsList: [],
  activeTab: '',
  handleSetTab: () => {},
})

export default AppContext
