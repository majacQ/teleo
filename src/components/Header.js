import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { ui } from '../constants';
import { setFilterOpen, setAgeRangeOpen, setReviewRefsOpen } from '../actions';

const Header = ({
  windowSize, ageRangeOpen, filterOpen, reviewRefsOpen,
  toggleFilterOpen, toggleAgeRangeOpen
}) => (
  <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
    <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
      <div className="header-text">
        Seminal Events Timeline
      </div>
      <div className="header-icons">
        <span className="header-icon icon-search2" />
        {/* <span className="header-icon icon-link" /> */}
        {/* <span className="header-icon icon-download" /> */}
      </div>
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
    </div>
  </div>
);

Header.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  ageRangeOpen: PropTypes.bool.isRequired,
  reviewRefsOpen: PropTypes.bool.isRequired,
  toggleFilterOpen: PropTypes.func.isRequired,
  toggleAgeRangeOpen: PropTypes.func.isRequired
  // toggleReviewRefsOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  ageRangeOpen: state.ageRangeOpen,
  filterOpen: state.filterOpen,
  reviewRefsOpen: state.reviewRefsOpen
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
