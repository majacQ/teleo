import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';

const PinnedGroup = ({
  data, windowSize
}) => {
  const [rangeStats, setRangeStats] = useState({ before: 0, in: 0, after: 0 });

  return (
    <div className="pinned-container" style={{ width: windowSize.width }}>
      <div className="pinned-header" style={{ width: windowSize.appWidth, marginLeft: windowSize.appLeft, marginRight: windowSize.appLeft }}>
        <div className="pinned-text">
          Pinned Events
          <span className="icon-bookmark pinned-icon" />
        </div>
        {/* <div className="pinned-button">
          Compare Details
        </div> */}
      </div>
      { data.length > 0 && (
        <EventsList data={data} gid="pinned" pinned collapsed={false} setRangeStats={setRangeStats} />
      )}
      {data.length === 0 && (
        <div className="pinned-instructions" style={{ marginLeft: windowSize.appLeft }}>
          Pin items to top for direct comparison
          {/* or drag */}
        </div>
      )}
    </div>
  );
}

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
