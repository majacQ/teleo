import { combineReducers } from 'redux';

import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  SET_FILTERS, WINDOW_RESIZE, SET_EXPANDED, SET_PINNED, ui
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

const filters = (state = { ogm: ['Gastrointestinal', 'Genitourinary'] }, action) => {
  switch (action.type) {
    case SET_FILTERS:
      return Object.assign({}, state, action.val);
    default:
  }
  return state;
};

// array of unique IDs
const expanded = (state = [], action) => {
  switch (action.type) {
    case SET_EXPANDED: {
      const newState = Object.assign([], state);
      if (action.data.what === 'add') {
        const ids = newState.map(d => d.gmdd_unique);
        const rows = newState.map(d => d.row);
        if (ids.indexOf(action.data.val.gmdd_unique) < 0) {
          newState.push(action.data.val);
        }
        // if one in that row already exists, need to remove it
        const idx = rows.indexOf(action.data.val.row);
        if (idx > -1 && newState[idx].row === action.data.val.row) {
          newState.splice(idx, 1);
        }
      }
      return newState;
    }
    default:
  }
  return state;
};

const pinned = (state = [], action) => {
  switch (action.type) {
    case SET_PINNED: {
      const newState = Object.assign([], state);
      if (action.data.what === 'add') {
        const ids = newState.map(d => d.gmdd_unique);
        if (ids.indexOf(action.data.val.gmdd_unique) < 0) {
          // action.data.val.row = action.data.val.row.replace(/[a-zA-z]+-/, 'pinned-');
          newState.push(action.data.val);
        }
      }
      if (action.data.what === 'remove') {
        const ids = newState.map(d => d.gmdd_unique);
        const idx = ids.indexOf(action.data.val.gmdd_unique);
        if (idx > -1) {
          newState.splice(idx, 1);
        }
      }
      newState.sort((a, b) => ((a.xStart > b.xStart) ? 1 : -1));
      return newState;
    }
    default:
  }
  return state;
};

const windowSize = (state = {
  height: window.innerHeight,
  width: window.innerWidth,
  appWidth: Math.min(ui.maxWidth, window.innerWidth)
}, action) => {
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
  filters,
  expanded,
  pinned,
  timelineData,
  windowSize
});

export default reducers;
