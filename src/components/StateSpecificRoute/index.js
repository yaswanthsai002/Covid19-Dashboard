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
    const fetchApiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const fetchOptions = {
      method: 'GET',
    }
    try {
      const response = await fetch(fetchApiUrl, fetchOptions)
      if (response.ok) {
        const jsonResponse = await response.json()
        const {statesList} = this.context
        const {districts, meta, total: stateTotal} = jsonResponse[stateCode]
        const districtsList = Object.keys(districts).map(eachDistrict => {
          const {total: districtTotal} = districts[eachDistrict]
          return {
            districtName: eachDistrict,
            confirmed: districtTotal.confirmed || 0,
            active:
              districtTotal.confirmed -
                (districtTotal.recovered + districtTotal.deceased) || 0,
            recovered: districtTotal.recovered || 0,
            deceased: districtTotal.deceased || 0,
          }
        })
        const {last_updated: lastUpdated} = meta
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
        const lastUpdatedDate = new Date(lastUpdated)
        const formattedDate = lastUpdatedDate.getDate()
        const formattedMonth = monthsList[lastUpdatedDate.getMonth()]
        const formattedYear = lastUpdatedDate.getFullYear()

        const stateObject = statesList.find(
          eachState => eachState.state_code === stateCode,
        )

        const stateDetails = {
          stateName: stateObject.state_name,
          stateImageUrl: stateObject.state_image_url,
          stateCode,
          districtsList,
          confirmedCasesCount: stateTotal.confirmed || 0,
          activeCasesCount:
            stateTotal.confirmed -
              (stateTotal.recovered + stateTotal.deceased) || 0,
          recoveredCasesCount: stateTotal.recovered || 0,
          deceasedCasesCount: stateTotal.deceased || 0,
          tested: stateTotal.tested || 0,
          lastUpdated: `${formattedMonth} ${formattedDate}, ${formattedYear}`,
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
    <div className="loader-container" data-testid="stateDetailsLoader">
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
              <p className="tested-value">{tested}</p>
            </div>
          </div>
          <div className="state-stats-container">
            {buttonsList.map(button => {
              const isSelected = filterType === button.type
              return (
                <button
                  type="button"
                  key={button.type}
                  className="state-stat-container"
                  onClick={() => this.setFilter(button.type)}
                >
                  <div
                    className={`state-stat-container state-${button.type} ${
                      isSelected ? `state-${button.type}-active` : ''
                    }`}
                    data-testid={button.data - button.testid}
                  >
                    <p className={`${button.type} stat-name`}>{button.label}</p>
                    <img
                      className={`${button.type}-img stat-img`}
                      src={button.imgUrl}
                      alt={`state specific ${button.type} cases pic`}
                    />
                    <p className={`${button.type} cases-count`}>
                      {button.count}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="top-districts-container">
            <h1 className={`${filterType} top-districts-heading`}>
              Top Districts
            </h1>
            <ul
              className="top-districts-list"
              data-testid="topDistrictsUnorderedList"
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
