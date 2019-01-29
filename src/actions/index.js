import { json } from 'd3-request';
import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  SET_FILTERS, WINDOW_RESIZE, SET_EXPANDED, SET_PINNED
} from '../constants';

export const setAgeRange = val => ({
  type: SET_AGE_RANGE,
  val
});

export const setTimelineFocusScale = val => ({
  type: SET_FOCUS_SCALE,
  val
});

export const setFilters = val => ({
  type: SET_FILTERS,
  val
});

export const addExpanded = val => ({
  type: SET_EXPANDED,
  data: { val, what: 'add' }
});

export const removeExpanded = val => ({
  type: SET_EXPANDED,
  data: { val, what: 'remove' }
});

export const clearExpanded = val => ({
  type: SET_EXPANDED,
  data: { val, what: 'clear' }
});

export const addPinned = val => ({
  type: SET_PINNED,
  data: { val, what: 'add' }
});

export const removePinned = val => ({
  type: SET_PINNED,
  data: { val, what: 'remove' }
});

export const clearPinned = val => ({
  type: SET_PINNED,
  data: { val, what: 'clear' }
});

export const windowResize = dims => ({
  type: WINDOW_RESIZE,
  dims
});

export const requestData = () => ({
  type: REQUEST_DATA
});

export const receiveData = dat => ({
  type: RECEIVE_DATA,
  data: dat,
  receivedAt: Date.now()
});

export const fetchData = url => (dispatch) => {
  dispatch(requestData());
  json(url, (dat) => {
    // compute the text width so we can compute layout when displaying events
    const tmpEl = document.createElement('canvas');
    const ctx = tmpEl.getContext('2d');
    ctx.font = '14px "Roboto Condensed"';

    const keys = Object.keys(dat);
    keys.forEach((ky) => {
      const dt = dat[ky].data;
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].textWidth = ctx.measureText(dt[i].gmdd_short_description).width;
      }
      dat[ky].data = dt; // eslint-disable-line no-param-reassign
    });

    dispatch(receiveData(dat));
  });
};
