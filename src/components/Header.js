import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ui } from '../constants';

const Header = ({ windowSize }) => (
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
        <span className="icon-chevron-down" />
      </span>
      <span className="header-filter">
        VARIABLES
        <span className="icon-chevron-down" />
      </span>
      <span className="header-filter">
        REVIEW REFERENCES
      </span>
    </div>
  </div>
);

Header.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(Header);
