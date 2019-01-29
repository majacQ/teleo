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
      <svg width={focWidth} height="25">
        <line className="eventgroup-hline" strokeDasharray="1, 5" x1="0" y1="23" x2={focWidth} y2="23" />
      </svg>
      <div className="eventgroup-header" style={{ width: focWidth }}>
        <div className="eventgroup-header-text">
          <span className="eventgroup-subcat">{data.subcategory}</span>
          <span className="eventgroup-cat">{data.category}</span>
        </div>
        <div className="eventgroup-header-icons">
          <span className="icon-menu eventgroup-header-icon" />
          <span className="icon-chevron-down eventgroup-header-icon" />
          <span className="icon-x eventgroup-header-icon" />
        </div>
      </div>
      <EventsList data={data} gid={gid} pinned={false} />
    </div>
  );
};

EventsGroup.propTypes = {
  data: PropTypes.array.isRequired,
  gid: PropTypes.string.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(EventsGroup);
