import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventsList from './EventsList';
import { setFilters, setSelectedORFI, setCollapsedGroup } from '../actions';

const EventsGroup = ({
  windowSize, collapsedGroups, filters, selectedORFI, removeGroup,
  toggleCollapse, data, subcategory, category, gid, group
}) => {
  const focWidth = windowSize.appWidth;
  const isCollapsed = collapsedGroups.indexOf(gid) > -1;

  const nGroups = filters.ogm.length + filters.nd.length
    + (selectedORFI.ho.length > 0 ? 1 : 0)
    + (selectedORFI.rf.length > 0 ? 1 : 0)
    + (selectedORFI.int.length > 0 ? 1 : 0);
  const draggable = nGroups === collapsedGroups.length;

  return (
    <div style={{ width: windowSize.width }}>
      <svg width={windowSize.width} height="25">
        <line className="eventgroup-hline" strokeDasharray="1, 5" x1="0" y1="23" x2={windowSize.width} y2="23" />
      </svg>
      <div className="eventgroup-header" style={{ width: focWidth, left: windowSize.appLeft }}>
        <div className="eventgroup-header-text">
          <span className="eventgroup-subcat">{subcategory}</span>
          <span className="eventgroup-cat">{category}</span>
        </div>
        <div className="eventgroup-header-icons">
          {draggable && (<span className="icon-drag_handle eventgroup-header-icon" style={{ color: 'lightgray' }} />) }
          <span
            className={`icon-chevron-${isCollapsed ? 'up' : 'down'} eventgroup-header-icon`}
            onClick={() => { toggleCollapse(gid); }}
            onKeyPress={() => {}}
            role="presentation"
          />
          <span
            className="icon-x eventgroup-header-icon"
            onClick={() => { removeGroup(subcategory, group, gid); }}
            onKeyPress={() => {}}
            role="presentation"
          />
        </div>
      </div>
      {!isCollapsed && (
        <EventsList data={data} gid={gid} pinned={false} />
      )}
    </div>
  );
};

EventsGroup.propTypes = {
  windowSize: PropTypes.object.isRequired,
  collapsedGroups: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  selectedORFI: PropTypes.object.isRequired,
  removeGroup: PropTypes.func.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  subcategory: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  gid: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  collapsedGroups: state.collapsedGroups,
  filters: state.filters,
  selectedORFI: state.selectedORFI
});

const mapDispatchToProps = dispatch => ({
  toggleCollapse: (val) => {
    dispatch(setCollapsedGroup({ val, type: 'toggle' }));
  },
  removeGroup: (val, group, gid) => {
    if (group === 'orfi') {
      dispatch(setSelectedORFI({ val, group: gid, type: 'remove-all-in-group' }));
      // if it is collapsed, make it so it won't be collapsed next time it is selected
      // it's arguable whether we should do this, but it will help ensure the user doesn't
      // just think there are no events when selecting the category the next time
      dispatch(setCollapsedGroup({ val: gid, type: 'unset' }));
    } else {
      dispatch(setFilters({ val, group, type: 'unset' }));
      // if it is collapsed, make it so it won't be collapsed next time it is selected
      // it's arguable whether we should do this, but it will help ensure the user doesn't
      // just think there are no events when selecting the category the next time
      dispatch(setCollapsedGroup({ val: gid, type: 'unset' }));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsGroup);
