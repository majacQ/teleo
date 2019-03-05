import { combineReducers } from 'redux';

import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA, SET_COLLAPSED_GROUP,
  REQUEST_NETWORK_DATA, RECEIVE_NETWORK_DATA, SET_SELECTED_ORFI, SET_PATHWAY_OPEN,
  SET_FILTERS, SET_FILTER_OPEN, WINDOW_RESIZE, SET_EXPANDED, SET_PINNED,
  SET_AGERANGE_OPEN, REQUEST_REFS_DATA, RECEIVE_REFS_DATA, SET_REVIEWREFS_OPEN, ui
} from '../constants';

const ageRange = (state = [279.9 / 7, 1010 / 7], action) => {
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

const filters = (state = { ogm: ['Gastrointestinal', 'Genitourinary'], nd: [] }, action) => {
  switch (action.type) {
    case SET_FILTERS: {
      let newState = Object.assign({}, state);
      const { val, group, type } = action.data;
      if (type === 'toggle') {
        const idx = newState[group].indexOf(val);
        if (idx < 0) {
          newState[group].push(val);
        } else {
          newState[group].splice(idx, 1);
        }
      } else if (type === 'clear-all') {
        newState = { ogm: [], nd: [] };
      } else if (type === 'unset') {
        const idx = newState[group].indexOf(val);
        if (idx > -1) {
          newState[group].splice(idx, 1);
        }
      }
      return newState;
    }
    default:
  }
  return state;
};

const selectedORFI = (state = {
  ho: [], rf: [], int: []
}, action) => {
  switch (action.type) {
    case SET_SELECTED_ORFI: {
      let newState = Object.assign({}, state);
      const { val, group, type } = action.data;
      if (type === 'add') {
        const idx = newState[group].indexOf(val);
        if (idx < 0) {
          newState[group].push(val);
        } else {
          newState[group].splice(idx, 1);
        }
      } else if (type === 'remove') {
        const idx = newState[group].indexOf(val);
        if (idx > -1) {
          newState[group].splice(idx, 1);
        }
      } else if (type === 'clear-all') {
        newState = { ho: [], rf: [], int: [] };
      }
      return newState;
    }
    default:
  }
  return state;
};

const ageRangeOpen = (state = false, action) => {
  switch (action.type) {
    case SET_AGERANGE_OPEN:
      return action.val;
    default:
  }
  return state;
};

const filterOpen = (state = false, action) => {
  switch (action.type) {
    case SET_FILTER_OPEN:
      return action.val;
    default:
  }
  return state;
};

const pathwayOpen = (state = false, action) => {
  switch (action.type) {
    case SET_PATHWAY_OPEN:
      return action.val;
    default:
  }
  return state;
};

const reviewRefsOpen = (state = false, action) => {
  switch (action.type) {
    case SET_REVIEWREFS_OPEN:
      return action.val;
    default:
  }
  return state;
};

const collapsedGroups = (state = [], action) => {
  switch (action.type) {
    case SET_COLLAPSED_GROUP: {
      let newState = Object.assign([], state);
      const { val, type } = action.data;
      if (type === 'toggle') {
        const idx = newState.indexOf(val);
        if (idx < 0) {
          newState.push(val);
        } else {
          newState.splice(idx, 1);
        }
      } else if (type === 'clear-all') {
        newState = [];
      } else if (type === 'unset') {
        const idx = newState.indexOf(val);
        if (idx > -1) {
          newState.splice(idx, 1);
        }
      } else if (type === 'set-all') {
        newState = val;
      }
      return newState;
    }
    default:
  }
  return state;
};

// array of unique IDs
const expanded = (state = [], action) => {
  switch (action.type) {
    case SET_EXPANDED: {
      let newState = Object.assign([], state);
      if (action.data.what === 'add') {
        const ids = newState.map(d => d.uid);
        const rows = newState.map(d => d.row);
        if (ids.indexOf(action.data.val.uid) < 0) {
          newState.push(action.data.val);
        }
        // if one in that row already exists, need to remove it
        const idx = rows.indexOf(action.data.val.row);
        if (idx > -1 && newState[idx].row === action.data.val.row) {
          newState.splice(idx, 1);
        }
      } else if (action.data.what === 'clear') {
        newState = [];
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
        const ids = newState.map(d => d.uid);
        if (ids.indexOf(action.data.val.uid) < 0) {
          // action.data.val.row = action.data.val.row.replace(/[a-zA-z]+-/, 'pinned-');
          newState.push(action.data.val);
        }
      }
      if (action.data.what === 'remove') {
        const ids = newState.map(d => d.uid);
        const idx = ids.indexOf(action.data.val.uid);
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
  appWidth: Math.min(ui.maxWidth, window.innerWidth),
  appLeft: (window.innerWidth - Math.min(ui.maxWidth, window.innerWidth)) / 2
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

const refsData = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_REFS_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_REFS_DATA:
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

const networkData = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_NETWORK_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_NETWORK_DATA:
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
  selectedORFI,
  ageRangeOpen,
  filterOpen,
  pathwayOpen,
  reviewRefsOpen,
  expanded,
  pinned,
  collapsedGroups,
  timelineData,
  refsData,
  networkData,
  windowSize
});

export default reducers;
