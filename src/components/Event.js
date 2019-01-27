import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExpanded, addPinned } from '../actions';

// try using react hooks
const Event = ({ data, windowSize, addToExpanded, addToPinned }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="event"
      style={{ left: data.xStart }}
      onMouseEnter={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => addToExpanded(data)}
      onKeyPress={() => addToExpanded(data)}
      role="presentation"
    >
      <div
        className="event-peak"
        style={{ width: data.eventWidth }}
      />
      <div className="event-text" style={{ paddingLeft: data.paddingLeft }}>
        {data.gmdd_short_description}
        {hover && (
          <div className="event-hoverinfo" style={{ left: Math.min(Math.max(data.textWidth, data.eventWidth) - 20, windowSize.appWidth - data.xStart - 170) }}>
            <div
              className="hoverinfo-text"
              onClick={(e) => { e.stopPropagation(); addToPinned(data); }}
              onKeyPress={() => addToPinned(data)}
              role="presentation"
            >
              PIN TO TOP
            </div>
            <div
              className="hoverinfo-text"
              onClick={() => addToExpanded(data)}
              onKeyPress={() => addToExpanded(data)}
              role="presentation"
            >
              EXPAND
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


Event.propTypes = {
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired,
  addToExpanded: PropTypes.func.isRequired,
  addToPinned: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

const mapDispatchToProps = dispatch => ({
  addToExpanded: (dat) => {
    dispatch(addExpanded(dat));
  },
  addToPinned: (dat) => {
    dispatch(addPinned(dat));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Event);
