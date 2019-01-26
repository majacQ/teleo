import React from 'react';
import { connect } from 'react-redux';
import { ui } from '../constants';

const Header = ({ windowSize }) => (
  <div className="header" style={{ height: ui.header.height, width: Math.min(windowSize.width, ui.maxWidth) }}>
    <div className="header-text">
      Seminal Events Timeline
    </div>
  </div>
);

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(Header);
