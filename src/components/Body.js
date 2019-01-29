import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import PinnedGroup from './PinnedGroup';
import { ui } from '../constants';

const Body = ({ filters, data, windowSize }) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="actions-header" style={{ top: ui.slider.height + ui.header.height, width: windowSize.appWidth, height: 20 }}>
      <span className="action-item">Collapse All</span>
      <span className="action-item">Expand All</span>
      <span className="action-item">Clear</span>
    </div>
    <div
      className="events-container"
      style={{
        top: ui.slider.height + ui.header.height + 20,
        height: windowSize.height - ui.header.height - ui.slider.height
      }}
    >
      <PinnedGroup />
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
      {/* {data.nd && filters.nd.length > 0 (
        <EventsGroup
          data={data['Developmental Domains']}
          gid="dd"
        />
      )} */}
    </div>
  </div>
);

Body.propTypes = {
  filters: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  filters: state.filters,
  data: state.timelineData.data,
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(Body);
