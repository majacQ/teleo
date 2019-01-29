import { json } from 'd3-request';
import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  SET_FILTERS, SET_FILTER_OPEN, WINDOW_RESIZE, SET_EXPANDED, SET_PINNED
} from '../constants';

export const setAgeRange = val => ({
  type: SET_AGE_RANGE,
  val
});

export const setTimelineFocusScale = val => ({
  type: SET_FOCUS_SCALE,
  val
});

export const setFilters = data => ({
  type: SET_FILTERS,
  data
});

export const setFilterOpen = val => ({
  type: SET_FILTER_OPEN,
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

    // const keys = Object.keys(dat.ogm.data);
    // keys.forEach((ky) => {
    //   const dt1 = dat.ogm.data[ky]['Growth & Maturation'];
    //   for (let i = 0; i < dt1.length; i += 1) {
    //     dt1[i].textWidth = ctx.measureText(dt1[i].desc_short).width;
    //   }
    //   dat.ogm.data[ky].Organogenesis = dt1; // eslint-disable-line no-param-reassign
    //   const dt2 = dat.ogm.data[ky].Organogenesis;
    //   for (let i = 0; i < dt2.length; i += 1) {
    //     dt2[i].textWidth = ctx.measureText(dt2[i].desc_short).width;
    //   }
    //   dat.ogm.data[ky].Organogenesis = dt2; // eslint-disable-line no-param-reassign
    // });

    const keys1 = Object.keys(dat.ogm.data);
    keys1.forEach((ky) => {
      const dt = dat.ogm.data[ky];
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].textWidth = ctx.measureText(dt[i].desc_short).width;
      }
      dat.ogm.data[ky] = dt; // eslint-disable-line no-param-reassign
    });

    const keys2 = Object.keys(dat.nd.data);
    keys2.forEach((ky) => {
      const dt = dat.nd.data[ky];
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].textWidth = ctx.measureText(dt[i].desc_short).width;
      }
      dat.nd.data[ky] = dt; // eslint-disable-line no-param-reassign
    });

    dispatch(receiveData(dat));
  });
};
