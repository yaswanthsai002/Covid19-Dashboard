import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from 'recharts'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class StateSpecificTimelines extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    stateDatesList: [],
    districtsDatesList: [],
  }

  componentDidMount() {
    this.fetchStateSpecificTimelines()
  }

  fetchStateSpecificTimelines = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {stateDetails} = this.props
    const {stateCode} = stateDetails
    try {
      const timeLinesResponse = await fetch(
        `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`,
      )
      if (timeLinesResponse.ok) {
        const timelinesJsonResponse = await timeLinesResponse.json()
        console.log('State Timelines response \n', timelinesJsonResponse)
        const {dates, districts} = timelinesJsonResponse[stateCode]
        const monthsList = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        const stateDatesList = Object.keys(dates).map(eachDate => {
          const {total} = dates[eachDate]
          const newEachDate = new Date(eachDate)
          const formattedDate = newEachDate.getDate()
          const formattedMonth = monthsList[newEachDate.getMonth()]
          const formattedYear = newEachDate.getFullYear()
          return {
            date: `${formattedDate} ${formattedMonth} ${formattedYear}`,
            confirmed: total.confirmed || 0,
            active: total.confirmed - (total.recovered + total.deceased) || 0,
            recovered: total.recovered || 0,
            deceased: total.deceased || 0,
            tested: total.tested || 0,
          }
        })
        console.log('State Dates List', stateDatesList)
        const districtsDatesList = Object.keys(districts).map(eachDistrict => {
          const {dates} = districts[eachDistrict]
          const datesList = Object.keys(dates).map(eachDate => {
            const {total} = dates[eachDate]
            return {
              date: eachDate,
              confirmed: total.confirmed || 0,
              active: total.confirmed - (total.recovered + total.deceased) || 0,
              recovered: total.recovered || 0,
              deceased: total.deceased || 0,
              tested: total.tested || 0,
            }
          })
          return {district: eachDistrict, datesList}
        })
        this.setState({
          stateDatesList,
          districtsDatesList,
          apiStatus: apiStatusConstants.success,
        })
      }
    } catch (error) {
      console.log('Error in fetching timelines data', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="timelinesDataLoader">
      <Loader type="TailSpin" color="#007BFF" height="50px" width="50px" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <p>Something went wrong. Please try again later.</p>
    </div>
  )

  renderLineChart = (filteredTypeStateDatesList, filterType, fillColor) => (
    <div className="outer-container">
      <div className={`chart-container ${filterType}-chart-container`}>
        <LineChart
          width={1000}
          height={350}
          className="line-chart"
          data={filteredTypeStateDatesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis
            dataKey="date"
            axisLine={{stroke: fillColor, strokeWidth: 2}}
            tickLine={{stroke: fillColor, strokeWidth: 2}}
            tick={{fill: fillColor}}
            tickSize={10}
          />
          <YAxis
            dataKey={filterType}
            axisLine={{stroke: fillColor, strokeWidth: 2}}
            tickLine={{stroke: fillColor, strokeWidth: 2}}
            tick={{fill: fillColor}}
            tickSize={5}
          />
          <Tooltip />
          <Legend align="right" verticalAlign="top" />
          <Line
            type="monotone"
            dataKey={filterType}
            stroke={fillColor}
            dot={{stroke: fillColor, strokeWidth: 6}}
          />
        </LineChart>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {filterType} = this.props
    const {stateDatesList} = this.state
    const filteredStateDatesList = stateDatesList.slice(-10).map(eachDate => ({
      date: eachDate.date,
      [filterType]: eachDate[filterType],
    }))
    let fillColor = '#9A0E31'
    if (filterType === 'confirmed') {
      fillColor = '#9A0E31'
    } else if (filterType === 'active') {
      fillColor = '#0A4FA0'
    } else if (filterType === 'recovered') {
      fillColor = '#216837'
    } else if (filterType === 'deceased') {
      fillColor = '#474C57'
    }

    const CustomLabel = ({x, y, value, fill, offset}) => {
      const formattedValue =
        value < 100000
          ? `${(value / 1000).toFixed(1)}K`
          : `${(value / 100000).toFixed(1)}L`
      return (
        <text
          x={x + 25}
          y={y - offset}
          fill={fill}
          fontSize={16}
          textAnchor="middle"
        >
          {formattedValue}
        </text>
      )
    }
    return (
      <div className="timelines-container">
        <div className="outer-container">
          <BarChart
            width={1000}
            height={400}
            data={filteredStateDatesList}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} />
            <Tooltip />
            <Bar
              dataKey={filterType}
              fill={fillColor}
              barSize={50}
              label={
                <CustomLabel fill={fillColor} position={top} offset={10} />
              }
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </div>
        <div className="spread-trends-container">
          <h1 className="spreads-heading">Daily Spread Trends</h1>
          <div>
            {this.renderLineChart(
              stateDatesList.map(eachDate => ({
                date: eachDate.date,
                confirmed: eachDate.confirmed,
              })),
              'confirmed',
              '#FF073A',
            )}
            {this.renderLineChart(
              stateDatesList.map(eachDate => ({
                date: eachDate.date,
                active: eachDate.active,
              })),
              'active',
              '#007BFF',
            )}
            {this.renderLineChart(
              stateDatesList.map(eachDate => ({
                date: eachDate.date,
                recovered: eachDate.recovered,
              })),
              'recovered',
              '#27A243',
            )}
            {this.renderLineChart(
              stateDatesList.map(eachDate => ({
                date: eachDate.date,
                deceased: eachDate.deceased,
              })),
              'deceased',
              '#6C757D',
            )}
            {this.renderLineChart(
              stateDatesList.map(eachDate => ({
                date: eachDate.date,
                tested: eachDate.tested,
              })),
              'tested',
              '#9673B9',
            )}
          </div>
        </div>
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
      <div className="state-specific-timelines-container">
        {this.renderContent()}
      </div>
    )
  }
}
