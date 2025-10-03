
// Write your code here
import './index.css'

import {Component} from 'react'

import Message from '../Message'
import Login from '../Login'
import Logout from '../Logout'

class Home extends Component {
  state = {isLoggedin: false}

  LoginLogout = () => {
    this.setState(prevState => ({isLoggedin: !prevState.isLoggedin}))
  }

  render() {
    const {isLoggedin} = this.state

    return (
      <div>
        <div>
          <Message isLoggedin={isLoggedin} />
          {isLoggedin ? (
            <Logout logout={this.LoginLogout} />
          ) : (
            <Login login={this.LoginLogout} />
          )}
        </div>
      </div>
    )
  }
}
export default Home
