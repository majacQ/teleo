import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { createSelector } from 'reselect';
import history from '../history';
import SearchBox from './SearchBox';
import { ui } from '../constants';
import {
  setFilterOpen, setAgeRangeOpen, setReviewRefsOpen, addPinned, setLinkDialogOpen
} from '../actions';
import { escapeRegexCharacters } from '../utils/regex';
import { classLookup } from '../utils/pinnedText';

const Header = ({
  windowSize, ageRangeOpen, filterOpen, reviewRefsOpen, pinned, allItems,
  toggleFilterOpen, toggleAgeRangeOpen, addToPinned, openLinkDialog
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // class: "ho"
  // id: "ho_1"
  // name: "Accidental injury or trauma"
  // type: "Health Outcome"

  const pinnedIds = pinned.map(d => d.uid);

  return (
    <div>
      { searchOpen && (
        <div className="header-search-box" style={{ right: windowSize.appLeft + 65 }}>
          <SearchBox
            items={allItems}
            handler={addToPinned}
            initialText={`Search all ${Number(allItems.length).toLocaleString()} events and select to pin.`}
            checkSuggestion={(item, value) => {
              const escapedValue = escapeRegexCharacters(value.trim());
              const regex = new RegExp(`${escapedValue}`, 'i');
              const isSelected = pinnedIds.indexOf(item.uid) > -1;
              return regex.test(item.name) && !isSelected;
            }}
            menuWidth={windowSize.appLeft + 365 - 50}
            autofocus
            handleEscape={() => setSearchOpen(false)}
          />
        </div>
      )}
      <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
        <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
          <div
            className="header-text"
            onClick={() => history.replace('')
          }
            role="presentation"
          >
            Seminal Events Timeline
          </div>
          <div className="header-icons">
            <span
              className="header-icon icon-search2"
              onClick={() => setSearchOpen(!searchOpen)}
              role="presentation"
            />
            <span
              className="header-icon icon-link"
              onClick={() => openLinkDialog()}
              role="presentation"
            />
            {/* <span className="header-icon icon-download" /> */}
          </div>
          { !searchOpen && (
            <div className="header-filters">
              <Button
                className={`header-filter-button ${ageRangeOpen ? 'white-text' : ''}`}
                onClick={() => toggleAgeRangeOpen(!ageRangeOpen, filterOpen, reviewRefsOpen)}
              >
                AGE RANGE
                { ageRangeOpen && (
                  <span className="icon-chevron-up header-filter-icon" />
                )}
                { !ageRangeOpen && (
                  <span className="icon-chevron-down header-filter-icon" />
                )}
              </Button>
              <Button
                className={`header-filter-button ${filterOpen ? 'white-text' : ''}`}
                onClick={() => toggleFilterOpen(!filterOpen, ageRangeOpen, reviewRefsOpen)}
              >
                VARIABLES
                { filterOpen && (
                  <span className="icon-chevron-up header-filter-icon" />
                )}
                { !filterOpen && (
                  <span className="icon-chevron-down header-filter-icon" />
                )}
              </Button>
              {/* <Button
                className={`header-filter-button ${reviewRefsOpen ? 'white-text' : ''}`}
                onClick={() => toggleReviewRefsOpen(!reviewRefsOpen, filterOpen, ageRangeOpen)}
              >
                REVIEW REFERENCES
                { reviewRefsOpen && (
                  <span className="icon-chevron-up header-filter-icon" />
                )}
                { !reviewRefsOpen && (
                  <span className="icon-chevron-down header-filter-icon" />
                )}
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  ageRangeOpen: PropTypes.bool.isRequired,
  reviewRefsOpen: PropTypes.bool.isRequired,
  pinned: PropTypes.array.isRequired,
  allItems: PropTypes.array.isRequired,
  toggleFilterOpen: PropTypes.func.isRequired,
  toggleAgeRangeOpen: PropTypes.func.isRequired,
  openLinkDialog: PropTypes.func.isRequired,
  addToPinned: PropTypes.func.isRequired
  // toggleReviewRefsOpen: PropTypes.func.isRequired
};

const timelineDataSelector = state => state.timelineData;
const networkDataSelector = state => state.networkData;

const allItemsSelector = createSelector(
  timelineDataSelector,
  networkDataSelector,
  (timelineData, networkData) => {
    const items = [];
    if (timelineData.isLoaded && networkData.isLoaded) {
      ['ogm', 'nd'].forEach((cat) => {
        const keys = Object.keys(timelineData.data[cat].data);
        keys.forEach((ky) => {
          timelineData.data[cat].data[ky].forEach((d) => {
            items.push({
              name: d.desc_short,
              uid: d.uid,
              type: d.subcat,
              class: d.class,
              subcat: d.subcat,
              i: d.i
            });
          });
        });
      });
      ['ho', 'int', 'rf'].forEach((cat) => {
        networkData.data.nodes[cat].data.forEach((d) => {
          items.push({
            name: d.desc_short,
            uid: d.uid,
            type: classLookup[d.class],
            class: d.class,
            subcat: undefined,
            i: d.i
          });
        });
      });
    }
    return items;
  }
);

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  ageRangeOpen: state.ageRangeOpen,
  filterOpen: state.filterOpen,
  reviewRefsOpen: state.reviewRefsOpen,
  pinned: state.pinned,
  allItems: allItemsSelector(state)
});

const mapDispatchToProps = dispatch => ({
  toggleFilterOpen: (val, ageRangeOpen, reviewRefsOpen) => {
    dispatch(setFilterOpen(val));
    if (ageRangeOpen) {
      dispatch(setAgeRangeOpen(false));
    }
    if (reviewRefsOpen) {
      dispatch(setReviewRefsOpen(false));
    }
  },
  toggleAgeRangeOpen: (val, filterOpen, reviewRefsOpen) => {
    dispatch(setAgeRangeOpen(val));
    if (filterOpen) {
      dispatch(setFilterOpen(false));
    }
    if (reviewRefsOpen) {
      dispatch(setReviewRefsOpen(false));
    }
  },
  addToPinned: (dat) => {
    const newDat = {
      uid: dat.uid,
      class: dat.class,
      subcat: dat.subcat === undefined ? '' : dat.subcat,
      i: dat.i
    };
    dispatch(addPinned(newDat));
  },
  openLinkDialog: () => {
    dispatch(setLinkDialogOpen(true));
  }
  // toggleReviewRefsOpen: (val, filterOpen, ageRangeOpen) => {
  //   dispatch(setReviewRefsOpen(val));
  //   if (filterOpen) {
  //     dispatch(setFilterOpen(false));
  //   }
  //   if (ageRangeOpen) {
  //     dispatch(setAgeRangeOpen(false));
  //   }
  // }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
