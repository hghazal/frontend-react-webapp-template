import { combineReducers } from 'redux'
import {  routeReducer } from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import counter from './counter'


const rootReducer = combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  counter,
});



export default rootReducer
