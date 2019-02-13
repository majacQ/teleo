import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { ui } from '../constants';
import { setFilterOpen, setAgeRangeOpen } from '../actions';

const Header = ({
  windowSize, ageRangeOpen, filterOpen, toggleFilterOpen
  // toggleAgeRangeOpen
}) => (
  <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
    <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
      <div className="header-text">
        Seminal Events Timeline
      </div>
      <div className="header-icons">
        <span className="header-icon icon-search2" />
        <span className="header-icon icon-link" />
        <span className="header-icon icon-download" />
      </div>
      <div className="header-filters">
        {/* <Button
          className={`header-filter-button ${ageRangeOpen ? 'white-text' : ''}`}
          onClick={() => toggleAgeRangeOpen(!ageRangeOpen, filterOpen)}
        >
          AGE RANGE
          { ageRangeOpen && (
            <span className="icon-chevron-up header-filter-icon" />
          )}
          { !ageRangeOpen && (
            <span className="icon-chevron-down header-filter-icon" />
          )}
        </Button> */}
        <Button
          className={`header-filter-button ${filterOpen ? 'white-text' : ''}`}
          onClick={() => toggleFilterOpen(!filterOpen, ageRangeOpen)}
        >
          VARIABLES
          { filterOpen && (
            <span className="icon-chevron-up header-filter-icon" />
          )}
          { !filterOpen && (
            <span className="icon-chevron-down header-filter-icon" />
          )}
        </Button>
        <Button className="header-filter-button">
          REVIEW REFERENCES
        </Button>
      </div>
    </div>
  </div>
);

Header.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  ageRangeOpen: PropTypes.bool.isRequired,
  toggleFilterOpen: PropTypes.func.isRequired
  // toggleAgeRangeOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  ageRangeOpen: state.ageRangeOpen,
  filterOpen: state.filterOpen
});

const mapDispatchToProps = dispatch => ({
  toggleFilterOpen: (val, ageRangeOpen) => {
    dispatch(setFilterOpen(val));
    if (ageRangeOpen) {
      dispatch(setAgeRangeOpen(false));
    }
  },
  toggleAgeRangeOpen: (val, filterOpen) => {
    dispatch(setAgeRangeOpen(val));
    if (filterOpen) {
      dispatch(setFilterOpen(false));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
