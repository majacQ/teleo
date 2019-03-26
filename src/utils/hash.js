import {
  SET_AGE_RANGE,
  // SET_EXPANDED,
  SET_PINNED,
  SET_FILTERS,
  SET_COLLAPSED_GROUP,
  SET_SELECTED_ORFI
  // SET_AGERANGE_OPEN,
  // SET_REVIEWREFS_OPEN
} from '../constants';

import {
  setFilters, setSelectedORFI, setCollapsedGroup, setAllPinned
} from '../actions';

// this updates the window hash whenever the state changes
// expanded: Array(1)
//   0: {uid: "GM078", section: "Growth & Maturation", subcat: "Gastrointestinal", ...
// pinned: Array(1)
//   0: {uid: "GM078", section: "Growth & Maturation", subcat: "Gastrointestinal", ...

const subcatLookup = {
  Cognitive: 'co',
  Emotional: 'em',
  Motor: 'mo',
  Language: 'la',
  'Blood/Immune': 'bi',
  Cardiovascular: 'ca',
  CNS: 'cn',
  Endocrine: 'en',
  Gastrointestinal: 'gi',
  Genitourinary: 'ge',
  Integument: 'in',
  Musculoskeletal: 'mu',
  PNS: 'pn',
  Respiratory: 'rs'
};

const codeLookup = {
  co: 'Cognitive',
  em: 'Emotional',
  mo: 'Motor',
  la: 'Language',
  bi: 'Blood/Immune',
  ca: 'Cardiovascular',
  cn: 'CNS',
  en: 'Endocrine',
  gi: 'Gastrointestinal',
  ge: 'Genitourinary',
  in: 'Integument',
  mu: 'Musculoskeletal',
  pn: 'PNS',
  rs: 'Respiratory'
};

const subcat2code = (subcat) => {
  if (subcat === undefined) {
    return '';
  }
  return subcatLookup[subcat];
};

const code2subcat = (code) => {
  if (code === '') {
    return '';
  }
  return codeLookup[code];
};

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
  // pinned
  const pnd = state.pinned.map(d => `${d.uid};${d.class};${subcat2code(d.subcat)};${d.i}`).join(',');

  const hash = `from=${from}&to=${to}&nd=${nd}&ogm=${ogm}&ho=${ho}&int=${int}&rf=${rf}&cgs=${cgs}&pnd=${pnd}`;
  return hash;
};

export const setStateFromHash = (store, hash) => {
  const state = store.getState();
  const { ageRange } = state;
  const { nd, ogm } = state.filters;
  const { ho, int, rf } = state.selectedORFI;
  const cgs = state.collapsedGroups;
  const pnd = state.pinned.map(d => `${d.class};${subcat2code(d.subcat)};${d.i}`).join(',');

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

  if (hashItems.pnd !== undefined && hashItems.pnd !== pnd && hashItems.pnd.length > 0) {
    const pndItems = hashItems.pnd.split(',');
    const pinned = pndItems.map((d) => {
      const els = d.split(';');
      return {
        uid: els[0],
        class: els[1],
        subcat: code2subcat(els[2]),
        i: els[3]
      };
    });
    store.dispatch(setAllPinned(pinned));
  }
};

export const hashMiddleware = store => next => (action) => {
  const types = [SET_AGE_RANGE, SET_FILTERS, SET_SELECTED_ORFI, SET_COLLAPSED_GROUP, SET_PINNED];
  const result = next(action);
  if (types.indexOf(action.type) > -1) {
    const hash = hashFromState(store.getState());
    if (window.location.hash !== hash) {
      window.history.pushState(hash, undefined, `#${hash}`);
      // window.history.pushState(hash, undefined, '');
    }
  }
  return result;
};
