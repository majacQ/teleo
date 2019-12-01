import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { ui } from '../constants';

const HeaderNonApp = ({
  windowSize
}) => (
  <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
    <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
      <div
        role="presentation"
      >
        <Link className="header-text" to="home">Timeline of Early Life Events and Outcomes</Link>
      </div>
      <div className="header-icons">
        <Button
          variant="outlined"
          classes={{ label: 'home-header-button', root: 'home-header-button-outline' }}
        >
          <Link className="home-header-button-link" to="app">Build a Visualization</Link>
        </Button>
        {/* <span
          className="header-icon icon-search2"
          onClick={() => setSearchOpen(!searchOpen)}
          role="presentation"
        /> */}
      </div>
    </div>
  </div>
);

HeaderNonApp.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps
)(HeaderNonApp);
