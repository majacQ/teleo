import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Event from './Event';

const EventsGroup = ({
  data, xScaleFoc, windowSize
}) => {
  // get positions of elements that should be visible
  const rows = [[]];
  const rowEnds = [0];
  const rowPad = 8;
  const focWidth = windowSize.appWidth;
  // compute data structure containing layout information

  data.data.forEach((d) => {
    const xStart = xScaleFoc(d.gmdd_start_age / 7);
    const eventWidth = Math.max(xScaleFoc(d.gmdd_end_age / 7) - xStart, 25);
    const outOfRange = xStart + eventWidth < 0 || xStart > focWidth;
    if (!outOfRange) {
      let curWidth = Math.max(d.textWidth, eventWidth) + rowPad;
      let xStart2 = xStart;
      // we still want the full text to show if the event is on the left edge of the timeline
      let paddingLeft = 5;
      if (xStart < 0) {
        paddingLeft = -xStart + 5;
        curWidth = Math.max(d.textWidth, -xStart);
        xStart2 = 0;
      }
      // see if any existing row is narrow enough to fit a new element
      let foundSpot = false;
      const newDat = Object.assign({
        xStart,
        eventWidth,
        paddingLeft
      }, d);
      for (let ii = 0; ii < rowEnds.length; ii += 1) {
        const rw = rowEnds[ii];
        // if we are on an empty row or the element fits on this row, we add the element
        // and the end of the row becomes the starting point plus the width of the element
        if (rw === 0 || (rw < xStart2 && rw + curWidth < focWidth)) {
          rows[ii].push(newDat);
          rowEnds[ii] = xStart2 + curWidth;
          foundSpot = true;
          break;
        }
      }
      if (!foundSpot) {
        rows.push([newDat]);
        rowEnds.push(xStart2 + curWidth);
      }
    }
  });

  return (
    <div style={{ width: focWidth }}>
      <div className="eventgroup-header">
        <span className="eventgroup-subcat">{data.subcategory}</span>
        <span className="eventgroup-cat">{data.category}</span>
      </div>
      <div>
        {
          rows.map((rowdat, i) => (
            <div className="event-row" key={`row-${i}`}>
              <div className="event-row-abs">
                {
                  rowdat.map(d => (
                    <Event data={d} />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

EventsGroup.propTypes = {
  data: PropTypes.object.isRequired,
  xScaleFoc: PropTypes.func.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  xScaleFoc: state.timelineFocusScale,
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(EventsGroup);

// d3.select('#content')
// .append('div')
// .attr('class', 'row')
// .append('div')
// .attr('class', 'row-abs')
// .attr('id', `row${i}`)
//   .datum(rowdat)
//   .selectAll('.element')
//   .data(d => d)
//   .enter()
//   .append('div')
//     .attr('class', 'rl')
//     .style('left', d => `${d.xStart}px`)
//     .style('width', d => `${Math.max(d.eventWidth, 5)}px`);
