import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CounterActions from '../actions'

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

class App extends React.Component {
  render() {
    return (
      <h1>Hello World!</h1>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
