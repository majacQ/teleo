import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
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
      {` v${process.env.REACT_APP_VERSION}`}
    </Box>
    <Box className="footer-text">
      <a href="https://www.gatesfoundation.org/Terms-of-Use">Terms of Use</a>
    </Box>
    <Box className="footer-text">
      <a href="https://www.gatesfoundation.org/Privacy-and-Cookies-Notice">Privacy Policy</a>
    </Box>
    <Box className="footer-text">
      <Link to="methodology">Methodology</Link>
    </Box>
    <Box className="footer-text">
      <Link to="contact">Contact Us</Link>
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
