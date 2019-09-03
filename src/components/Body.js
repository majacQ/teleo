import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import PinnedGroup from './PinnedGroup';
import { ui } from '../constants';
import { setCollapsedGroup, setFilters, setSelectedORFI } from '../actions';

const Body = ({
  filters, orfi, data, ndata, windowSize, expandAll, collapseAll, clearFilters
}) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, width: windowSize.width, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div
      className="actions-header"
      style={{
        top: ui.slider.height + ui.header.height,
        width: windowSize.appWidth,
        height: 20,
        left: windowSize.appLeft - 10
      }}
    >
      <span
        className="action-item"
        onClick={() => {
          const res = [...filters.ogm.map((d) => `ogm_${d}`), ...filters.nd.map((d) => `nd_${d}`)];
          const keys = Object.keys(orfi);
          keys.forEach((d) => { if (orfi[d].length > 0) { res.push(d); } });
          collapseAll(res);
        }}
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
        <div
          className="events-empty"
          style={{ marginLeft: windowSize.appLeft + 15 }}
        >
          Open the &quot;variables&quot; filtering in the header to add events to the timeline.
        </div>
      )}
      {data.ogm && filters.ogm.length > 0 && filters.ogm.map((d) => (
        <EventsGroup
          key={d}
          data={data.ogm.data[d]}
          gid={`ogm_${d}`}
          category="Organogenesis, Growth, & Maturation"
          subcategory={d}
          group="ogm"
        />
      ))}
      {data.nd && filters.nd.length > 0 && filters.nd.map((d) => (
        <EventsGroup
          key={d}
          data={data.nd.data[d]}
          gid={`nd_${d}`}
          category="Neurodevelopment"
          subcategory={d}
          group="nd"
        />
      ))}
      {ndata.isLoaded && Object.keys(orfi).map((k) => {
        if (orfi[k].length > 0) {
          const curDat = ndata.data.nodes[k];
          curDat.data.filter((d) => orfi[k].indexOf(d.uid) > -1);
          return (
            <EventsGroup
              key={k}
              data={curDat.data.filter((d) => orfi[k].indexOf(d.uid) > -1)}
              gid={k}
              category=""
              subcategory={curDat.name}
              group="orfi"
            />
          );
        }
        return '';
      })}
    </div>
    <div
      className="cover1"
      style={{
        top: ui.header.height + ui.slider.ctxHeight,
        bottom: 0,
        width: windowSize.appLeft,
        left: 0
      }}
    />
    <div
      className="cover1"
      style={{
        top: ui.header.height + ui.slider.ctxHeight,
        bottom: 0,
        width: windowSize.appLeft,
        right: 0
      }}
    />
    <div
      className="cover2"
      style={{
        height: ui.header.height + ui.slider.ctxHeight,
        top: 0,
        width: windowSize.appLeft,
        left: 0
      }}
    />
    <div
      className="cover2"
      style={{
        height: ui.header.height + ui.slider.ctxHeight,
        top: 0,
        width: windowSize.appLeft,
        right: 0
      }}
    />
  </div>
);

Body.propTypes = {
  filters: PropTypes.object.isRequired,
  orfi: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  ndata: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired,
  expandAll: PropTypes.func.isRequired,
  collapseAll: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  filters: state.filters,
  orfi: state.selectedORFI,
  data: state.timelineData.data,
  ndata: state.networkData,
  windowSize: state.windowSize
});

const mapDispatchToProps = (dispatch) => ({
  expandAll: () => {
    dispatch(setCollapsedGroup({ type: 'clear-all' }));
  },
  collapseAll: (val) => {
    dispatch(setCollapsedGroup({ val, type: 'set-all' }));
  },
  clearFilters: () => {
    dispatch(setFilters({ type: 'clear-all' }));
    dispatch(setSelectedORFI({ type: 'clear-all' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Body);
