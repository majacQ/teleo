import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
// import history from '../history';
// import { ui } from '../constants';

const Footer = () => (
  <Box
    display="flex"
    flexWrap="wrap"
    className="footer"
  >
    <Box flexGrow={1}>
      &copy; 2019&nbsp;
      <a href="https://www.gatesfoundation.org/">Bill & Melinda Gates Foundation.</a>
      &nbsp;All Rights Reserved.
    </Box>
    <Box className="footer-text">
      <a href="https://www.gatesfoundation.org/Terms-of-Use">Terms of Use</a>
    </Box>
    <Box className="footer-text">
      <a href="https://www.gatesfoundation.org/Privacy-and-Cookies-Notice">Privacy Policy</a>
    </Box>
    <Box className="footer-text">
      <a href="methodology">Methodology</a>
    </Box>
    <Box className="footer-text">
      <a href="contact">Contact Us</a>
    </Box>
  </Box>
);

Footer.propTypes = {
  // windowSize: PropTypes.object.isRequired
};

export default Footer;

// export default connect(
//   mapStateToProps
//   // mapDispatchToProps,
// )(Footer);
