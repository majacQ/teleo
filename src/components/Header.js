import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ui } from '../constants';

const Header = ({ windowSize }) => (
  <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth }}>
    <div className="header-text">
      Seminal Events Timeline
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
