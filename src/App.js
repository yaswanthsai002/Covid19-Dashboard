import {Switch, Route, Redirect} from 'react-router-dom'
import {useState} from 'react'
import Home from './components/Home'
import About from './components/About'
import Vaccination from './components/Vaccination'
import StateSpecificRoute from './components/StateSpecificRoute'
import NotFound from './components/NotFound'
import AppContext from './context/AppContext'
import './App.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309375/Group_7361_cij1xh.png',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308995/Group_7354_mko8y2.png',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303463/Group_7340_olyryh.png',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303650/Group_7341_k3tiix.png',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303179/Group_7335_ghi9cx.png',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309375/Group_7361_cij1xh.png',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308955/Group_7353_tjq9kv.png',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309183/Group_7357_aszs88.png',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309227/Group_7358_rqpkss.png',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308820/Group_7349_cn8dtj.png',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303306/Group_7337_ieziyj.png',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721302848/Group_7332_a05p8g.png',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309495/Group_7364_rftzx5.png',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309678/Group_7328_hg0ddw.png',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303691/Group_7342_oyu65t.png',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303414/Group_7339_dlj02f.png',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309071/Group_7355_nw7vro.png',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309767/Group_7363_mtvb1f.png',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309272/Group_7359_dwqguy.png',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308852/Group_7350_pmbp5z.png',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303281/Group_7336_mqmel2.png',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308663/Group_7346_ms6ydx.png',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308467/Group_7344_fkcukv.png',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308721/Group_7347_qatwth.png',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308579/Group_7345_ezkada.png',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308769/Group_7348_u63jor.png',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309312/Group_7360_tnwt1c.png',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721302764/Group_7330_kj3j86.png',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721302956/Group_7333_pju3d2.png',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303381/Group_7338_eqizhl.png',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721309139/Group_7356_qlfshw.png',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308883/Group_7351_mamofz.png',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721308916/Group_7352_wap5hp.png',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303002/Group_7334_najhti.png',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721302798/Group_7331_shdbup.png',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
    state_image_url:
      'https://res.cloudinary.com/dt0d1rirt/image/upload/v1721303816/Group_7343_yidaoz.png',
  },
]

const navTabsList = [
  {
    navTabId: 'HOME',
    navTabDisplayText: 'Home',
    navTo: '/',
  },
  // {
  //   navTabId: 'VACCINATION',
  //   navTabDisplayText: 'Vaccination',
  //   navTo: '/vaccination',
  // },
  {
    navTabId: 'ABOUT',
    navTabDisplayText: 'About',
    navTo: '/about',
  },
]

const App = () => {
  const [activeTab, setActiveTab] = useState(navTabsList[0].navTabId)
  const handleSetTab = id => setActiveTab(id)
  return (
    <AppContext.Provider
      value={{
        statesList,
        navTabsList,
        activeTab,
        handleSetTab,
      }}
    >
      <Switch>
        <Route exact index path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/vaccination" component={Vaccination} />
        <Route exact path="/state/:stateCode" component={StateSpecificRoute} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </AppContext.Provider>
  )
}

export default App
