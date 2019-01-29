import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';
import { setFilters } from '../actions';

const EventsGroup = ({
  windowSize, removeGroup, data, subcategory, category, gid, group
}) => {
  const focWidth = windowSize.appWidth;
  return (
    <div style={{ width: focWidth }}>
      <svg width={focWidth} height="25">
        <line className="eventgroup-hline" strokeDasharray="1, 5" x1="0" y1="23" x2={focWidth} y2="23" />
      </svg>
      <div className="eventgroup-header" style={{ width: focWidth }}>
        <div className="eventgroup-header-text">
          <span className="eventgroup-subcat">{subcategory}</span>
          <span className="eventgroup-cat">{category}</span>
        </div>
        <div className="eventgroup-header-icons">
          <span className="icon-menu eventgroup-header-icon" />
          <span className="icon-chevron-down eventgroup-header-icon" />
          <span
            className="icon-x eventgroup-header-icon"
            onClick={() => { removeGroup(subcategory, group); }}
            onKeyPress={() => {}}
            role="presentation"
          />
        </div>
      </div>
      <EventsList data={data} gid={gid} pinned={false} />
    </div>
  );
};

EventsGroup.propTypes = {
  windowSize: PropTypes.object.isRequired,
  removeGroup: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  subcategory: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  gid: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

const mapDispatchToProps = dispatch => ({
  // clearAllExpanded: () => {
  //   dispatch(clearExpanded());
  // },
  removeGroup: (val, group) => {
    dispatch(setFilters({ val, group, type: 'unset' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsGroup);
