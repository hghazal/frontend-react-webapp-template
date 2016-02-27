import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CounterActions from 'src/actions'

require('../../assets/styles/main.scss');

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
      <div className="container">
        <h1>Roller</h1>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Root)
