import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class About extends Component {
  state = {
    faq: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    try {
      const response = await fetch('https://apis.ccbp.in/covid19-faqs')
      if (response.ok) {
        const jsonResponse = await response.json()
        const {faq} = jsonResponse
        this.setState({apiStatus: apiStatusConstants.success, faq})
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.log('Error in fetching data', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="aboutRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="50px" width="50px" />
    </div>
  )

  renderSuccessView = () => {
    const {faq} = this.state
    return (
      <div className="success-view-container">
        <div className="about-container">
          <h1 className="about-heading">About</h1>
          <p className="about-last-updated">Last updated on </p>
          <h1 className="about-sub-heading">
            COVID-19 vaccines be ready for distribution
          </h1>
          <ul className="faq-list-container" data-testid="faqsUnorderedList">
            {faq.map(eachFaq => (
              <li className="faq-lst-item" key={eachFaq.qno}>
                <p className="faq-question">{eachFaq.question}</p>
                <p className="faq-answer">{eachFaq.answer}</p>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <p>Something went wrong. Please try again later.</p>
    </div>
  )

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
        <Header />
        <div className="app-container">{this.renderContent()}</div>
      </div>
    )
  }
}
