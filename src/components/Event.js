import React from 'react';
import PropTypes from 'prop-types';

const Event = ({ data }) => (
  <div
    className="event"
    style={{ left: data.xStart }}
    key={data.gmdd_unique}
  >
    <div
      className="event-peak"
      style={{ width: data.eventWidth }}
    />
    <div className="event-text" style={{ paddingLeft: data.paddingLeft }}>
      {data.gmdd_short_description}
    </div>
  </div>
);

Event.propTypes = {
  data: PropTypes.object.isRequired
};

export default Event;

// const mapStateToProps = state => ({
//   windowSize: state.windowSize
// });

// export default connect(
//   mapStateToProps,
// )(Event);
