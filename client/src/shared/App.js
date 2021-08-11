import React from 'react';
import { setCookie, getCookie, deleteCookie } from '../jslib/cookieIO';
import axios from 'axios';
import './App.css';
import Top from './../components/Top.js';
import MainSection from './../components/mainSection.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };

    this.setLoginState = this.setLoginState.bind(this);
    this.getLoginState = this.getLoginState.bind(this);
  }

  setLoginState(login_succeed = false) {
    this.setState({isLogin: login_succeed});
  }

  getLoginState() {
    return this.state.isLogin;
  }

  componentDidMount() {
    var seToken = getCookie('sessionToken');
    axios.get('/isOnline_process',
      {
	header: {
	  'Authorization': seToken
	}
      })
    .then((res)=>{
      if(res.status===200) {
	this.setLoginState(true);
      } else {
	deleteCookie('sessionToken');
	this.setLoginState(false);
      }
    })
    .catch((e)=> {
      deleteCookie('sessionToken');
      this.setLoginState(false);
    });
  }

  render() {
    return (
      <>
      <header>
        <Top setLoginState={this.setLoginState} getLoginState={this.getLoginState}/>
      </header>
      <section>
        <MainSection />
      </section>
      </>
    );
  }
}

export default App;
