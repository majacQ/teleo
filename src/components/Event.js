import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExpanded, addPinned, removePinned } from '../actions';

// try using react hooks
const Event = ({
  data, expanded, pinned, windowSize, addToExpanded, addToPinned, removeFromPinned
}) => {
  const [hover, setHover] = useState(false);

  const eventColor = pinned ? '#d2e6e7' : '#ffffff';

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
      {hover && !expanded && (
        <div className="event-hoverinfo" style={{ left: Math.min(Math.max(data.textWidth, data.eventWidth) - 10, windowSize.appWidth - data.xStart - 170) }}>
          <div
            className="hoverinfo-text"
            onClick={(e) => {
              e.stopPropagation();
              if (pinned === true) {
                removeFromPinned(data);
              } else {
                addToPinned(data);
              }
            }}
            onKeyPress={() => (pinned ? removeFromPinned(data) : addToPinned(data))}
            role="presentation"
          >
            {pinned ? 'REMOVE PIN' : 'PIN TO TOP'}
          </div>
          <div
            className="hoverinfo-text"
            onClick={(e) => { e.stopPropagation(); addToExpanded(data); }}
            onKeyPress={() => addToExpanded(data)}
            role="presentation"
          >
            EXPAND
          </div>
        </div>
      )}
      <div
        className="event-peak"
        style={{ width: data.eventWidth, background: expanded ? '#4eb8c1' : eventColor }}
      >
        <div className="event-peak-st">
          <svg width="19px" height="26px" className="event-peak-shadow">
            <path
              d="M19,26V0C12,0,10.94,5,7.56,7.88a16.62,16.62,0,0,1-7,3.38C-.09,11.56,0,12,0,13s-.09,1.44.53,1.75a16.62,16.62,0,0,1,7,3.38C10.94,21,12,26,19,26Z"
              fill={expanded ? '#4eb8c1' : eventColor}
            />
          </svg>
        </div>
        <div className="event-peak-nd" style={{ left: data.eventWidth - 3 }}>
          <svg width="19px" height="26px" className="event-peak-shadow">
            <path
              d="M0,26L0,0c7,0,8.1,5,11.4,7.9c3.2,2.8,6.5,3.1,7,3.4C19.1,11.6,19,12,19,13s0.1,1.4-0.5,1.8c-0.5,0.3-3.8,0.6-7,3.4C8.1,21,7,26,0,26z"
              fill={expanded ? '#4eb8c1' : eventColor}
            />
          </svg>
        </div>
      </div>
      <div className="event-text" style={{ paddingLeft: data.paddingLeft }}>
        {data.desc_short}
      </div>
    </div>
  );
};

Event.propTypes = {
  data: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  pinned: PropTypes.bool.isRequired,
  windowSize: PropTypes.object.isRequired,
  addToExpanded: PropTypes.func.isRequired,
  addToPinned: PropTypes.func.isRequired,
  removeFromPinned: PropTypes.func.isRequired
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
  },
  removeFromPinned: (dat) => {
    dispatch(removePinned(dat));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Event);
