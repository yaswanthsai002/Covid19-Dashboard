import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      className="not-found-img"
      src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1721805668/Group_7484_drskeh.png"
      alt="not-found-pic"
    />
    <h1 className="not-found-heading">PAGE NOT FOUND</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found
    </p>
    <Link to="/">
      <button type="button" className="home-btn">
        Home
      </button>
    </Link>
  </div>
)

export default NotFound
