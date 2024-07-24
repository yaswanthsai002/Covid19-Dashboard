import {Component} from 'react'
import {Link} from 'react-router-dom'
import AppContext from '../../context/AppContext'
import './index.css'

export default class Header extends Component {
  state = {
    showMobileNavbar: false,
  }

  handleShowMobileNavbar = () =>
    this.setState(prevState => ({
      showMobileNavbar: !prevState.showMobileNavbar,
    }))

  render() {
    const {showMobileNavbar} = this.state
    return (
      <AppContext.Consumer>
        {value => {
          const {activeTab, navTabsList, handleSetTab} = value
          return (
            <>
              <header className="header">
                <Link to="/" className="hed">
                  <h1 className="website-heading covid19-heading">
                    COVID19
                    <span className="website-heading india-heading">INDIA</span>
                  </h1>
                </Link>
                <button
                  type="button"
                  className="mobile-navbar-toggle-btn"
                  onClick={this.handleShowMobileNavbar}
                >
                  <img
                    src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720799543/add-to-queue_1_emf5rs.png"
                    className="mobile-navmenu-togglebtn"
                    alt="mobile navmenu togglebtn"
                  />
                </button>
                <div className="desktop-navbar">
                  {navTabsList.map(tab => (
                    <Link
                      key={tab.navTabId}
                      to={tab.navTo}
                      className="nav-link"
                      onClick={() => handleSetTab(tab.navTabId)}
                    >
                      <p
                        className={`nav-tab ${
                          tab.navTabId === activeTab ? 'active-tab' : ''
                        }`}
                      >
                        {tab.navTabDisplayText}
                      </p>
                    </Link>
                  ))}
                </div>
              </header>
              {showMobileNavbar && (
                <div className="mobile-navbar">
                  <div className="navlinks-container">
                    {navTabsList.map(tab => (
                      <Link
                        key={tab.navTabId}
                        to={tab.navTo}
                        className="nav-link"
                        onClick={() => handleSetTab(tab.navTabId)}
                      >
                        <p
                          className={`nav-tab mobile-nav-tab ${
                            tab.navTabId === activeTab ? 'active-tab' : ''
                          }`}
                        >
                          {tab.navTabDisplayText}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mobile-navbar-close-btn"
                    onClick={this.handleShowMobileNavbar}
                  >
                    <img
                      src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720845974/Solid_jtiob4.png"
                      className="mobile-nav-close-btn"
                      alt="mobile navbar close button"
                    />
                  </button>
                </div>
              )}
            </>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
