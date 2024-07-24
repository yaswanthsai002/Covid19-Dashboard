import './index.css'
import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'

const Footer = () => (
  <footer className="footer">
    <h1 className="website-heading covid19-heading">
      COVID19<span className="website-heading india-heading">INDIA</span>
    </h1>
    <p className="website-description">
      we stand with everyone fighting on the front lines
    </p>
    <div className="social-icons-container">
      <VscGithubAlt className="social-icon github-icon" />
      <FiInstagram className="social-icon instagram-icon" />
      <FaTwitter className="social-icon twitter-icon" />
    </div>
  </footer>
)

export default Footer
