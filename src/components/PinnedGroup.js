import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';

const PinnedGroup = ({
  data, windowSize
}) => {
  const focWidth = windowSize.appWidth;
  return (
    <div className="pinned-container" style={{ width: focWidth }}>
      <div className="pinned-header">
        <div className="pinned-text">
          Pinned Events
          <span className="icon-bookmark pinned-icon" />
        </div>
        <div className="pinned-button">
          Compare Details
        </div>
      </div>
      { data.length > 0 && (
        <EventsList data={{ data }} gid="pinned" pinned />
      )}
      {data.length === 0 && (
        <div className="pinned-instructions">
          Pin or drag items to top for direct comparison
        </div>
      )}
    </div>
  );
};

PinnedGroup.propTypes = {
  data: PropTypes.array.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.pinned,
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(PinnedGroup);
