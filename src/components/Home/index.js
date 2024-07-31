import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import {BiChevronRightSquare} from 'react-icons/bi'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import Loader from 'react-loader-spinner'
import AppContext from '../../context/AppContext'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class Home extends Component {
  state = {
    searchValue: '',
    resultsList: [],
    apiStatus: apiStatusConstants.initial,
    isAscending: true,
  }

  componentDidMount() {
    this.fetchData()
  }

  onSearchValueChange = event =>
    this.setState({searchValue: event.target.value})

  fetchData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    try {
      const response = await fetch(
        'https://apis.ccbp.in/covid19-state-wise-data',
      )
      if (response.ok) {
        const jsonResponse = await response.json()
        this.processData(jsonResponse)
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.log('Error in fetching data', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  processData = data => {
    const {statesList} = this.context
    const resultsList = []
    Object.keys(data).forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        const stateObject = statesList.find(
          state => state.state_code === keyName,
        )
        if (stateObject) {
          resultsList.push({
            stateCode: keyName,
            stateName: stateObject.state_name,
            confirmed,
            deceased,
            recovered,
            tested,
            population,
            active: confirmed - (deceased + recovered),
          })
        }
      }
    })
    console.log('Statewise Covid Data Table Results', resultsList)
    this.setState({
      resultsList,
      apiStatus: apiStatusConstants.success,
    })
  }

  onSortAscending = () => this.setState({isAscending: true})

  onSortDescending = () => this.setState({isAscending: false})

  renderLoadingView = () => (
    <div className="loader-container" testid="homeRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="50px" width="50px" />
    </div>
  )

  renderSuccessView = () => {
    const {resultsList, searchValue, isAscending} = this.state

    const filteredStatesList = searchValue
      ? resultsList.filter(state =>
          state.stateName.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : []

    const sortedStatesList = [...resultsList].sort((a, b) =>
      isAscending
        ? a.stateName.localeCompare(b.stateName)
        : b.stateName.localeCompare(a.stateName),
    )

    const confirmedCasesCount = resultsList.reduce(
      (acc, eachState) => acc + eachState.confirmed,
      0,
    )
    const activeCasesCount = resultsList.reduce(
      (acc, eachState) => acc + eachState.active,
      0,
    )
    const recoveredCasesCount = resultsList.reduce(
      (acc, eachState) => acc + eachState.recovered,
      0,
    )
    const deceasedCasesCount = resultsList.reduce(
      (acc, eachState) => acc + eachState.deceased,
      0,
    )

    return (
      <div className="success-view-container">
        <div className="search-input-container">
          <BsSearch className="search-icon" />
          <input
            type="search"
            name="search input"
            id="searchInput"
            placeholder="Enter the State"
            onChange={this.onSearchValueChange}
            className="search-input"
          />
        </div>
        {filteredStatesList.length > 0 && (
          <ul
            className="search-results-container"
            testid="searchResultsUnorderedList"
          >
            {filteredStatesList.map(eachState => (
              <Link
                to={`/state/${eachState.stateCode}`}
                className="state-link"
                key={eachState.stateCode}
              >
                <li className="search-item">
                  <p className="search-item-state-name">
                    {eachState.stateName}
                  </p>
                  <button type="button" className="search-item-state-code">
                    {eachState.stateCode}
                    <BiChevronRightSquare className="right-square-icon" />
                  </button>
                </li>
              </Link>
            ))}
          </ul>
        )}
        <div className="country-stats-container">
          <div
            className="confirmed-cases country-stat-container"
            testid="countryWideConfirmedCases"
          >
            <p className="confirmed stat-name">Confirmed</p>
            <img
              className="confirmed-img stat-img"
              src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/check-mark_1_atutdi.png"
              alt="country wide confirmed cases pic"
            />
            <p className="confirmed cases-count">{confirmedCasesCount}</p>
          </div>
          <div
            className="active-cases country-stat-container"
            testid="countryWideActiveCases"
          >
            <p className="active stat-name">Active</p>
            <img
              className="active-img stat-img"
              src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/protection_1_swla7g.png"
              alt="country wide active cases pic"
            />
            <p className="active cases-count">{activeCasesCount}</p>
          </div>
          <div
            className="recovered-cases country-stat-container"
            testid="countryWideRecoveredCases"
          >
            <p className="recovered stat-name">Recovered</p>
            <img
              className="recovered-img stat-img"
              src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/recovered_1_itiybf.png"
              alt="country wide recovered cases pic"
            />
            <p className="recovered cases-count">{recoveredCasesCount}</p>
          </div>
          <div
            className="deceased-cases country-stat-container"
            testid="countryWideDeceasedCases"
          >
            <p className="deceased stat-name">Deceased</p>
            <img
              className="deceased-img stat-img"
              src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/breathing_1_o43ee0.png"
              alt="country wide deceased cases pic"
            />
            <p className="deceased cases-count">{deceasedCasesCount}</p>
          </div>
        </div>
        <div
          className="state-stats-table-container"
          testid="stateWiseCovidDataTable"
        >
          <ul className="state-stats-table">
            <div className="table-header">
              <div className="state-name-heading-and-sort-icons-container">
                <p className="header-item heade-item-state-name-heading">
                  States/UT
                </p>
                <div className="sorting-btns-container">
                  <button
                    type="button"
                    testid="ascendingSort"
                    onClick={this.onSortAscending}
                    className="sorting-btn"
                  >
                    <FcGenericSortingAsc className="sort-icon" />
                  </button>
                  <button
                    type="button"
                    testid="descendingSort"
                    onClick={this.onSortDescending}
                    className="sorting-btn"
                  >
                    <FcGenericSortingDesc className="sort-icon" />
                  </button>
                </div>
              </div>
              <p className="header-item">Confirmed</p>
              <p className="header-item">Active</p>
              <p className="header-item">Recovered</p>
              <p className="header-item">Deceased</p>
              <p className="header-item">Population</p>
            </div>
            <div className="table-body">
              {sortedStatesList.map(eachState => (
                <li key={eachState.stateCode} className="table-row">
                  <Link
                    to={`/state/${eachState.stateCode}`}
                    className="state-name-link"
                  >
                    <p className="row-item state-name">{eachState.stateName}</p>
                  </Link>
                  <p className="row-item confirmed row-item-confirmed">
                    {eachState.confirmed}
                  </p>
                  <p className="row-item active row-item-active">
                    {eachState.active}
                  </p>
                  <p className="row-item recovered row-item-recovered">
                    {eachState.recovered}
                  </p>
                  <p className="row-item deceased row-item-deceased">
                    {eachState.deceased}
                  </p>
                  <p className="row-item population row-item population">
                    {eachState.population}
                  </p>
                </li>
              ))}
            </div>
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <h1 className="error-message">Something went wrong</h1>
    </div>
  )

  render() {
    return (
      <div className="main-container">
        <Header />
        <AppContext.Consumer>
          {value => {
            const {statesList} = value
            return (
              <div className="app-container">
                {this.renderContent(statesList)}
              </div>
            )
          }}
        </AppContext.Consumer>
      </div>
    )
  }
}

Home.contextType = AppContext
