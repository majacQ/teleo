import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import HeaderNonApp from './HeaderNonApp';
import Footer from './Footer';
import history from '../history';
import { ui } from '../constants';

const NotFound = ({
  windowSize
}) => (
  <div>
    <HeaderNonApp />
    <div
      className="notfound-container"
      style={{
        width: windowSize.width,
        top: ui.header.height,
        minHeight: windowSize.height - ui.header.height - 116
      }}
    >
      <div className="notfound-inner">
        <div className="notfound-header">
          404 Page not found.
        </div>
        <div className="notfound-text">
          Oops! The page you requested can&apos;t be found.
        </div>
        <div className="notfound-text2">
          Go to
        </div>
        <div className="notfound-redirects">
          <div className="notfound-button">
            <Button
              classes={{ label: 'notfound-button-label', root: 'notfound-button-root' }}
              onClick={() => history.replace('home')}
            >
              Home Page
            </Button>
          </div>
          <div className="notfound-button">
            <Button
              classes={{ label: 'notfound-button-label', root: 'notfound-button-root' }}
              onClick={() => history.replace('app')}
            >
              Build a visualization
            </Button>
          </div>
          <div className="notfound-button">
            <Button
              classes={{ label: 'notfound-button-label', root: 'notfound-button-root' }}
              onClick={() => history.replace('methodology')}
            >
              Methodology
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

NotFound.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  windowSize: state.windowSize
});


// const mapDispatchToProps = dispatch => ({
// });

export default connect(
  mapStateToProps
  // mapDispatchToProps,
)(NotFound);
