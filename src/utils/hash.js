import {
  SET_AGE_RANGE,
  // SET_EXPANDED,
  // SET_PINNED,
  SET_FILTERS,
  SET_COLLAPSED_GROUP,
  SET_SELECTED_ORFI
  // SET_AGERANGE_OPEN,
  // SET_REVIEWREFS_OPEN
} from '../constants';

import { setFilters, setSelectedORFI, setCollapsedGroup } from '../actions';

// this updates the window hash whenever the state changes
// expanded: Array(1)
//   0: {uid: "GM078", section: "Growth & Maturation", subcat: "Gastrointestinal", ...
// pinned: Array(1)
//   0: {uid: "GM078", section: "Growth & Maturation", subcat: "Gastrointestinal", ...

export const hashFromState = (state) => {
  // ageRange
  const from = Math.round(state.ageRange[0] * 7);
  const to = Math.round(state.ageRange[1] * 7);
  // filters
  const nd = state.filters.nd.join(',');
  const ogm = state.filters.ogm.join(',');
  // selectedORFI
  const ho = state.selectedORFI.ho.join(',');
  const int = state.selectedORFI.int.join(',');
  const rf = state.selectedORFI.rf.join(',');
  // collapsed groups
  const cgs = state.collapsedGroups.join(',');

  const hash = `from=${from}&to=${to}&nd=${nd}&ogm=${ogm}&ho=${ho}&int=${int}&rf=${rf}&cgs=${cgs}`;
  return hash;
};

export const setStateFromHash = (store) => {
  const state = store.getState();
  const { hash } = window.location;
  const { ageRange } = state;
  const { nd, ogm } = state.filters;
  const { ho, int, rf } = state.selectedORFI;
  const cgs = state.collapsedGroups;

  const hashItems = {};
  hash.replace('#', '').split('&').forEach((d) => {
    const tuple = d.split('=');
    hashItems[tuple[0]] = tuple[[1]];
  });

  if (hashItems.from !== undefined && hashItems.to !== undefined) {
    let from = parseInt(hashItems.from, 10);
    let to = parseInt(hashItems.to, 10);
    if (from === 40 * 7) {
      from = 40 * 7 - 1;
    }
    if (to === 40 * 7) {
      to = 40 * 7 - 1;
    }
    const newAgeRange = [from / 7, to / 7];
    if (newAgeRange[0] !== ageRange[0] || newAgeRange[1] !== ageRange[1]) {
      store.dispatch({
        type: SET_AGE_RANGE,
        val: newAgeRange
      });
    }
  }

  if (hashItems.nd !== undefined && hashItems.ogm !== undefined) {
    if (hashItems.nd !== nd.join(',') || hashItems.ogm !== ogm.join(',')) {
      let newNd = [];
      let newOgm = [];
      if (hashItems.nd.length > 0) {
        newNd = hashItems.nd.split(',');
      }
      if (hashItems.ogm.length > 0) {
        newOgm = hashItems.ogm.split(',');
      }
      store.dispatch(setFilters({ type: 'replace-all', val: { nd: newNd, ogm: newOgm } }));
    }
  }

  if (hashItems.ho !== undefined && hashItems.int !== undefined && hashItems.rf !== undefined) {
    if (hashItems.ho !== ho.join(',') || hashItems.int !== int.join(',') || hashItems.rf !== rf.join(',')) {
      let newHo = [];
      let newInt = [];
      let newRf = [];
      if (hashItems.ho.length > 0) {
        newHo = hashItems.ho.split(',');
      }
      if (hashItems.int.length > 0) {
        newInt = hashItems.int.split(',');
      }
      if (hashItems.rf.length > 0) {
        newRf = hashItems.rf.split(',');
      }
      store.dispatch(setSelectedORFI({ type: 'replace-all', val: { ho: newHo, int: newInt, rf: newRf } }));
    }
  }

  if (hashItems.cgs !== undefined && hashItems.cgs !== cgs.join(',') && hashItems.cgs.length > 0) {
    store.dispatch(setCollapsedGroup({ type: 'set-all', val: hashItems.cgs.split(',') }));
  }
};

export const hashMiddleware = store => next => (action) => {
  const types = [SET_AGE_RANGE, SET_FILTERS, SET_SELECTED_ORFI, SET_COLLAPSED_GROUP];
  const result = next(action);
  if (types.indexOf(action.type) > -1) {
    const hash = hashFromState(store.getState());
    if (window.location.hash !== hash) {
      // alert('wha?')
      window.location.hash = hash;
    }
  }
  return result;
};
