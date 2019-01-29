import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import PinnedGroup from './PinnedGroup';
import { ui } from '../constants';
import { clearExpanded, setFilters } from '../actions';

const Body = ({
  filters, data, windowSize, clearAllExpanded, clearFilters
}) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="actions-header" style={{ top: ui.slider.height + ui.header.height, width: windowSize.appWidth, height: 20 }}>
      <span
        className="action-item"
        onClick={() => { clearAllExpanded(); }}
        onKeyPress={() => {}}
        role="button"
        tabIndex="-9"
      >
        Collapse All
      </span>
      <span className="action-item">Expand All</span>
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
        <div key={d}>
          <EventsGroup
            data={data.ogm.data[d]['Growth & Maturation']}
            gid={`gm_${d}`}
            category="Growth & Maturation"
            subcategory={d}
          />
          <EventsGroup
            data={data.ogm.data[d].Organogenesis}
            gid={`o_${d}`}
            category="Organogenesis"
            subcategory={d}
          />
        </div>
      ))}
      {data.nd && filters.nd.length > 0 && filters.nd.map(d => (
        <EventsGroup
          data={data.nd.data[d]}
          gid={`nd_${d}`}
          category="Neurodevelopment"
          subcategory={d}
        />
      ))}
    </div>
  </div>
);

Body.propTypes = {
  filters: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired,
  clearAllExpanded: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  filters: state.filters,
  data: state.timelineData.data,
  windowSize: state.windowSize
});

const mapDispatchToProps = dispatch => ({
  clearAllExpanded: () => {
    dispatch(clearExpanded());
  },
  clearFilters: () => {
    dispatch(setFilters({ type: 'clear' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Body);
