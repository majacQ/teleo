import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import { ui } from '../constants';

const Body = ({ data, windowSize }) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="events-container" style={{ top: ui.slider.height + ui.header.height, height: windowSize.height - ui.header.height - ui.slider.height }}>
      {/* <PinnedEvents /> */}
      {data['Growth and Maturation'] !== undefined && (
        <EventsGroup
          data={data['Growth and Maturation']}
          gid="gm"
        />
      )}
      {data['Developmental Domains'] !== undefined && (
        <EventsGroup
          data={data['Developmental Domains']}
          gid="dd"
        />
      )}
      {data.Organogenesis !== undefined && (
        <EventsGroup
          data={data.Organogenesis}
          gid="or"
        />
      )}
    </div>
  </div>
);

Body.propTypes = {
  windowSize: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.timelineData.data,
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(Body);
