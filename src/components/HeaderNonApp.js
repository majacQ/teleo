import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import history from '../history';
import { ui } from '../constants';

const HeaderNonApp = ({
  windowSize
}) => (
  <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
    <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
      <div
        className="header-text"
        onClick={() => history.replace('home')}
        role="presentation"
      >
        Seminal Events Timeline
      </div>
      <div className="header-icons">
        <Button
          variant="outlined"
          className="home-header-button"
          classes={{ label: 'home-header-button', root: 'home-header-button-outline' }}
          onClick={() => history.replace('app')}
        >
          Build a Visualization
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
