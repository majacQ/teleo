import React from 'react';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import { ui } from '../constants';

const Body = () => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="events-container" style={{ top: ui.slider.height + ui.header.height }}>
      {/* <PinnedEvents /> */}
      <EventsGroup
        category="Neurodevelopment"
        subcategory="Cognitive Development"
      />
    </div>
  </div>
);

export default Body;
