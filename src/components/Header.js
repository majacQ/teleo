import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { ui } from '../constants';
import { setFilterOpen } from '../actions';

const Header = ({ windowSize, filterOpen, toggleFilterOpen }) => (
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
        <Button className="header-filter-button">
          AGE RANGE
          <span className="icon-chevron-down header-filter-icon" />
        </Button>
        <Button
          className={`header-filter-button ${filterOpen ? 'white-text' : ''}`}
          onClick={() => toggleFilterOpen(!filterOpen)}
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
