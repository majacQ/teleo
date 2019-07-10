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
      &copy; 2019 Bill & Melinda Gates Foundation. All Rights Reserved.
    </Box>
    <Box className="footer-text">
      Terms of Service
    </Box>
    <Box className="footer-text">
      Privacy Policy
    </Box>
    <Box className="footer-text">
      Methodology
    </Box>
    <Box className="footer-text">
      Contact Us
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
