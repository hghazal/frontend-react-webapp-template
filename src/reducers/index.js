import { combineReducers } from 'redux';
import {  routeReducer } from 'react-router-redux';
import counter from 'src/reducers/counter';


const rootReducer = combineReducers({
  routing: routeReducer,
  counter,
});

export default rootReducer;
