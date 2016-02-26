import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CounterActions from '../actions'

require('../../assets/styles/onboarding_spa.scss');

const logoImage = require('../../assets/images/logo.png');

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World ;-)</h1>
        <img src={logoImage}/>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Root)
