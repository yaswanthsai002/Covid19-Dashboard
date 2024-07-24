import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import StateSpecificTimelines from '../StateSpecificTimelines'
import AppContext from '../../context/AppContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class StateSpecificRoute extends Component {
  state = {
    stateDetails: {},
    apiStatus: apiStatusConstants.initial,
    filterType: 'confirmed',
  }

  componentDidMount() {
    this.fetchStateSpecificDetails()
  }

  setFilter = filterType => this.setState({filterType})

  fetchStateSpecificDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    try {
      const response = await fetch(
        `https://apis.ccbp.in/covid19-state-wise-data`,
      )
      if (response.ok) {
        const jsonResponse = await response.json()
        const {statesList} = this.context
        const {districts, meta, total} = jsonResponse[stateCode]
        const districtsList = Object.keys(districts).map(eachDistrict => {
          const {total} = districts[eachDistrict]
          return {
            districtName: eachDistrict,
            confirmed: total.confirmed || 0,
            active: total.confirmed - (total.recovered + total.deceased) || 0,
            recovered: total.recovered || 0,
            deceased: total.deceased || 0,
          }
        })
        const {last_updated, tested} = meta
        const {date} = tested
        const monthsList = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
        const lastUpdated = new Date(last_updated)
        const formattedDate = lastUpdated.getDate()
        const formattedMonth = monthsList[lastUpdated.getMonth()]
        const formattedYear = lastUpdated.getFullYear()

        const testedDate = new Date(date)
        const formattedTestedDate = testedDate.getDate()
        const formattedTestedMonth = monthsList[testedDate.getMonth()]
        const formattedTestedYear = testedDate.getFullYear()

        const stateObject = statesList.find(
          eachState => eachState.state_code === stateCode,
        )

        const stateDetails = {
          stateName: stateObject.state_name,
          stateImageUrl: stateObject.state_image_url,
          stateCode,
          districtsList,
          confirmedCasesCount: total.confirmed || 0,
          activeCasesCount:
            total.confirmed - (total.recovered + total.deceased) || 0,
          recoveredCasesCount: total.recovered || 0,
          deceasedCasesCount: total.deceased || 0,
          tested: total.tested || 0,
          population: meta.population || 0,
          lastUpdated: `${formattedMonth} ${formattedDate}, ${formattedYear}`,
          testedDate: `${formattedTestedMonth} ${formattedTestedDate} ${formattedTestedYear}`,
        }
        this.setState({
          stateDetails,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error in fetching state specific details', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  sortDistricts = () => {
    const {filterType, stateDetails} = this.state
    const {districtsList} = stateDetails
    const sortedDistricts = districtsList
      .map(district => ({
        districtName: district.districtName,
        casesCount: district[filterType],
      }))
      .sort((a, b) => b.casesCount - a.casesCount)
    return sortedDistricts
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="stateDetailsLoader">
      <Loader type="TailSpin" color="#007BFF" height="50px" width="50px" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <p>Something went wrong. Please try again later.</p>
    </div>
  )

  renderSuccessView = () => {
    const {stateDetails, filterType} = this.state
    const {
      stateName,
      confirmedCasesCount,
      activeCasesCount,
      recoveredCasesCount,
      deceasedCasesCount,
      lastUpdated,
      tested,
    } = stateDetails

    const sortedDistrictsList = this.sortDistricts()

    const buttonsList = [
      {
        label: 'Confirmed',
        type: 'confirmed',
        count: confirmedCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/check-mark_1_atutdi.png',
        testid: 'stateSpecificConfirmedCasesContainer',
      },
      {
        label: 'Active',
        type: 'active',
        count: activeCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/protection_1_swla7g.png',
        testid: 'stateSpecificActiveCasesContainer',
      },
      {
        label: 'Recovered',
        type: 'recovered',
        count: recoveredCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/recovered_1_itiybf.png',
        testid: 'stateSpecificRecoveredCasesContainer',
      },
      {
        label: 'Deceased',
        type: 'deceased',
        count: deceasedCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/breathing_1_o43ee0.png',
        testid: 'stateSpecificDeceasedCasesContainer',
      },
    ]

    return (
      <div className="success-view-container">
        <div className="state-specific-details-container">
          <div className="state-name-and-tested-details-container">
            <div className="state-name-and-last-updated-container">
              <h1 className="state-name-heading">{stateName}</h1>
              <p className="last-updated">Last updated on {lastUpdated}.</p>
            </div>
            <div className="tested-details-container">
              <p className="tested-text">Tested</p>
              <h1 className="tested-value">{confirmedCasesCount}</h1>
            </div>
          </div>
          <div className="state-stats-container">
            {buttonsList.map(button => {
              const isSelected = filterType === button.type
              return (
                <button
                  key={button.type}
                  className="state-stat-container-btn"
                  onClick={() => this.setFilter(button.type)}
                >
                  <div
                    className={`state-stat-container state-${button.type} ${
                      isSelected ? `state-${button.type}-active` : ''
                    }`}
                    testid={button.testid}
                  >
                    <p className={`${button.type} stat-name`}>{button.label}</p>
                    <img
                      className={`${button.type}-img stat-img`}
                      src={button.imgUrl}
                      alt={`state specific ${button.type} cases pic`}
                    />
                    <h1 className={`${button.type} cases-count`}>
                      {button.count}
                    </h1>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="state-img-and-tested-stats-container">
            <div className="state-img-container">
              <img
                className="state-img"
                src={stateDetails.stateImageUrl}
                alt={`${stateDetails.stateName}`}
              />
            </div>
            <div className="population-and-tested-stats-container">
              <p className="state-ncp-report">NCP report</p>
              <div className="state-population-and-tested-stats-container">
                <div className="population-container">
                  <p className="state-population-text">Population</p>
                  <h1 className="state-population-value">
                    {stateDetails.population}
                  </h1>
                </div>
                <div className="tested-container">
                  <p className="state-tested-text">Tested</p>
                  <h1 className="state-tested-value">{stateDetails.tested}</h1>
                  <p className="state-tested-date">
                    (As of {stateDetails.testedDate} per source)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="top-districts-container" testid="lineChartsContainer">
            <h1 className={`${filterType} top-districts-heading`}>
              Top Districts
            </h1>
            <ul
              className="top-districts-list"
              testid="topDistrictsUnorderedList"
            >
              {sortedDistrictsList.map(district => (
                <li
                  key={district.districtName}
                  className="top-districts-list-item"
                >
                  <h1 className="district-cases-count">
                    {district.casesCount}
                  </h1>
                  <p className="district-name">{district.districtName}</p>
                </li>
              ))}
            </ul>
          </div>
          <StateSpecificTimelines
            filterType={filterType}
            stateDetails={stateDetails}
          />
        </div>
        <Footer />
      </div>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <>
          <Header />
          <div className="app-container">{this.renderContent()}</div>
        </>
      </div>
    )
  }
}

StateSpecificRoute.contextType = AppContext
