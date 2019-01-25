import { combineReducers } from 'redux';

import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  WINDOW_RESIZE
} from '../constants';

const ageRange = (state = [39.99, 120], action) => {
  switch (action.type) {
    case SET_AGE_RANGE:
      return Object.assign([], [], action.val);
    default:
  }
  return state;
};

const timelineFocusScale = (state = () => {}, action) => {
  switch (action.type) {
    case SET_FOCUS_SCALE:
      return action.val;
    default:
  }
  return state;
};

const windowSize = (state = { height: window.innerHeight, width: window.innerWidth }, action) => {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, action.dims);
    default:
  }
  return state;
};

const timelineData = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

const reducers = combineReducers({
  ageRange,
  timelineFocusScale,
  timelineData,
  windowSize
});

export default reducers;
