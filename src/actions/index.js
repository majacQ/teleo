import { json } from 'd3-request';
import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  WINDOW_RESIZE
} from '../constants';

export const setAgeRange = val => ({
  type: SET_AGE_RANGE,
  val
});

export const setTimelineFocusScale = val => ({
  type: SET_FOCUS_SCALE,
  val
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

export const fetchData = url =>
  (dispatch) => {
    dispatch(requestData());

    json(url, (dat) => {
      dispatch(receiveData(dat));
    });
  };
