import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CounterActions from 'src/actions'
import { Link } from 'react-router';


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
        <h1 className="extra-large"><strong>Roller</strong> <span className="cursive italics txt-clr-yellow-600"><em>Coming Soon</em></span></h1>
        <h4>Made with <span className="bt-icon fa fa-heart txt-clr-red-600"></span> by Hecham Ghazal</h4>
        <Link to="demo">Components Demo</Link>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Root)
