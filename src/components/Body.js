import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import PinnedGroup from './PinnedGroup';
import { ui } from '../constants';
import { setCollapsedGroup, setFilters } from '../actions';

const Body = ({
  filters, data, windowSize, expandAll, collapseAll, clearFilters
}) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="actions-header" style={{ top: ui.slider.height + ui.header.height, width: windowSize.appWidth, height: 20 }}>
      <span
        className="action-item"
        onClick={() => { collapseAll([...filters.ogm.map(d => `ogm_${d}`), ...filters.nd.map(d => `nd_${d}`)]); }}
        onKeyPress={() => {}}
        role="button"
        tabIndex="-9"
      >
        Collapse All
      </span>
      <span
        className="action-item"
        onClick={() => { expandAll(); }}
        onKeyPress={() => {}}
        role="button"
        tabIndex="-9"
      >
        Expand All
      </span>
      <span
        className="action-item"
        onClick={() => { clearFilters(); }}
        onKeyPress={() => {}}
        role="button"
        tabIndex="-9"
      >
        Clear
      </span>
    </div>
    <div
      className="events-container"
      style={{
        top: ui.slider.height + ui.header.height + 20,
        height: windowSize.height - ui.header.height - ui.slider.height - 20
      }}
    >
      <PinnedGroup />
      {filters.ogm.length === 0 && filters.nd.length === 0 && (
        <div className="events-empty">Open the &quot;variables&quot; filtering in the header to add events to the timeline.</div>
      )}
      {data.ogm && filters.ogm.length > 0 && filters.ogm.map(d => (
        <EventsGroup
          key={d}
          data={data.ogm.data[d]}
          gid={`ogm_${d}`}
          category="Organogenesis, Growth, & Maturation"
          subcategory={d}
          group="ogm"
        />
      ))}
      {data.nd && filters.nd.length > 0 && filters.nd.map(d => (
        <EventsGroup
          key={d}
          data={data.nd.data[d]}
          gid={`nd_${d}`}
          category="Neurodevelopment"
          subcategory={d}
          group="nd"
        />
      ))}
    </div>
  </div>
);

Body.propTypes = {
  filters: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired,
  expandAll: PropTypes.func.isRequired,
  collapseAll: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  filters: state.filters,
  data: state.timelineData.data,
  windowSize: state.windowSize
});

const mapDispatchToProps = dispatch => ({
  expandAll: () => {
    dispatch(setCollapsedGroup({ type: 'clear-all' }));
  },
  collapseAll: (val) => {
    dispatch(setCollapsedGroup({ val, type: 'set-all' }));
  },
  clearFilters: () => {
    dispatch(setFilters({ type: 'clear-all' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Body);
