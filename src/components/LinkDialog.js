import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import copy from 'copy-to-clipboard';
import { hashFromState } from '../utils/hash';
import { setLinkDialogOpen } from '../actions';

const LinkDialog = ({
  linkDialogOpen, state, handleClose
}) => (
  linkDialogOpen && (
    <Dialog
      open={linkDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Use the link below to share this visualization with others:
      </DialogTitle>
      <DialogContent className="link-text">
        <DialogContentText>
          {`${window.location.href}#${hashFromState(state)}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => copy(`${window.location.href}#${hashFromState(state)}`)}>
          Copy to Clipboard
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
);

LinkDialog.propTypes = {
  linkDialogOpen: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  linkDialogOpen: state.linkDialogOpen,
  state
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => {
    dispatch(setLinkDialogOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkDialog);
