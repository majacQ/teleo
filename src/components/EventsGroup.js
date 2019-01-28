import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';

const EventsGroup = ({
  data, gid, windowSize
}) => {
  const focWidth = windowSize.appWidth;
  return (
    <div style={{ width: focWidth }}>
      <div className="eventgroup-header">
        <span className="eventgroup-subcat">{data.subcategory}</span>
        <span className="eventgroup-cat">{data.category}</span>
      </div>
      <EventsList data={data} gid={gid} pinned={false} />
    </div>
  );
};

EventsGroup.propTypes = {
  data: PropTypes.object.isRequired,
  gid: PropTypes.string.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(EventsGroup);
