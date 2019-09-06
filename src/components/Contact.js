import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HeaderNonApp from './HeaderNonApp';
import Footer from './Footer';
import { ui } from '../constants';
import ContactCorrection from './ContactCorrection';

const contactItems = [
  {
    title: 'Correction request',
    subtitle: 'Report an informational error',
    id: 'correction'
  },
  {
    title: 'Something isn\'t working',
    subtitle: 'Let us know about a broken feature',
    id: 'broken'
  },
  {
    title: 'General inquiry/feedback',
    subtitle: 'Ask a question or let us know what you think',
    id: 'feedback'
  }
];

const Contact = ({
  windowSize
}) => {
  const [contactBox, setContactBox] = useState('');

  return (
    <div>
      <div className="contact-header-shadow" />
      <HeaderNonApp />
      <div className="contact-outer">
        <div
          className="contact-container"
          style={{
            minHeight: windowSize.height - ui.header.height - 100
          }}
        >
          <div className="content-title">
            Contact us
          </div>
          <div className="contact-content">
            {
              contactItems.map((d) => (
                <div className="contact-entry">
                  <div style={{ float: 'left', paddingRight: 15 }}>
                    <div className="contact-entry-title">
                      {d.title}
                    </div>
                    <div className="content-entry-subtitle">
                      {d.subtitle}
                    </div>
                  </div>
                  <IconButton
                    classes={{ root: 'contact-button-root' }}
                    className="contact-button"
                    aria-label="build"
                    onClick={() => setContactBox(d.id)}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </div>
              ))
            }
            <ContactCorrection />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

Contact.propTypes = {
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
)(Contact);
