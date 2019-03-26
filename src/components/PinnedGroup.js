import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';

const PinnedGroup = ({
  data, windowSize, timelineData, networkData
}) => {
  // const [rangeStats, setRangeStats] = useState({ before: 0, in: 0, after: 0 });

  if (!timelineData.isLoaded || !networkData.isLoaded) {
    return '';
  }

  const eventData = data.map((d) => {
    if (d.subcat === '' || d.subcat === undefined) {
      return networkData.data.nodes[d.class].data[d.i];
    }
    return timelineData.data[d.class].data[d.subcat][d.i];
  });
  eventData.sort((a, b) => a.age_start - b.age_start);

  return (
    <div className="pinned-container" style={{ width: windowSize.width }}>
      <div className="pinned-header" style={{ width: windowSize.appWidth, marginLeft: windowSize.appLeft, marginRight: windowSize.appLeft }}>
        <div className="pinned-text">
          Pinned Events
          <span className="icon-bookmark pinned-icon" />
        </div>
        {/* <div className="hidden">
          {`${rangeStats.in + rangeStats.before + rangeStats.after} events pinned.`}
        </div> */}
        {/* <div className="pinned-button">
          Compare Details
        </div> */}
      </div>
      { eventData.length > 0 && (
        <EventsList data={eventData} gid="pinned" pinned collapsed={false} setRangeStats={() => {}} />
      )}
      {eventData.length === 0 && (
        <div className="pinned-instructions" style={{ marginLeft: windowSize.appLeft }}>
          Pin items to top for direct comparison
          {/* or drag */}
        </div>
      )}
    </div>
  );
};

PinnedGroup.propTypes = {
  data: PropTypes.array.isRequired,
  windowSize: PropTypes.object.isRequired,
  timelineData: PropTypes.object.isRequired,
  networkData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.pinned,
  windowSize: state.windowSize,
  timelineData: state.timelineData,
  networkData: state.networkData
});

export default connect(
  mapStateToProps,
)(PinnedGroup);
