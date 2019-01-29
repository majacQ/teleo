import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ui } from '../constants';
import { setFilterOpen } from '../actions';

const Header = ({ windowSize, filterOpen, toggleFilterOpen }) => (
  <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth }}>
    <div className="header-text">
      Seminal Events Timeline
    </div>
    <div className="header-icons">
      <span className="header-icon icon-search" />
      <span className="header-icon icon-link" />
      <span className="header-icon icon-download" />
    </div>
    <div className="header-filters">
      <span className="header-filter">
        AGE RANGE
        <span className="icon-chevron-down header-filter-icon" />
      </span>
      <span
        className={`header-filter ${filterOpen ? 'white-text' : ''}`}
        onClick={() => toggleFilterOpen(!filterOpen)}
        onKeyPress={() => toggleFilterOpen(!filterOpen)}
        role="button"
        tabIndex="-1"
      >
        VARIABLES
        { filterOpen && (
          <span className="icon-chevron-up header-filter-icon" />
        )}
        { !filterOpen && (
          <span className="icon-chevron-down header-filter-icon" />
        )}
      </span>
      <span className="header-filter">
        REVIEW REFERENCES
      </span>
    </div>
  </div>
);

Header.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  toggleFilterOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  filterOpen: state.filterOpen
});

const mapDispatchToProps = dispatch => ({
  toggleFilterOpen: (val) => {
    dispatch(setFilterOpen(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
