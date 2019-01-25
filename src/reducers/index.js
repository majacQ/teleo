import { combineReducers } from 'redux';

import { SET_AGE_RANGE } from '../constants';

const ageRange = (state = [39.99, 119], action) => {
  switch (action.type) {
    case SET_AGE_RANGE:
      return Object.assign([], [], action.val);
    default:
  }
  return state;
};

const reducers = combineReducers({
  ageRange
});

export default reducers;
