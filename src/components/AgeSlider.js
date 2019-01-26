import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { arc } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select, event as curEvent } from 'd3-selection';
import { throttle } from 'throttle-debounce';
import { setAgeRange, setTimelineFocusScale } from '../actions';
import { ui } from '../constants';

// ~52.18 weeks in a year
// add 40 weeks for to account for gestation
const y2w = x => x * (365.25 / 7) + 40;
const w2y = x => (x - 40) / (365.25 / 7);
// ~4.35 weeks in a month
const m2w = x => x * (365.25 / 12 / 7) + 40;
const w2m = x => (x - 40) / (365.25 / 12 / 7);

class AgeSlider extends Component {
  constructor(props) {
    super(props);
    this.createAgeSlider = this.createAgeSlider.bind(this);
  }

  componentDidMount() {
    this.createAgeSlider();
  }

  componentDidUpdate() {
    // this.createAgeSlider();
  }

  createAgeSlider() {
    const { node } = this;
    const { setRange, setScale } = this.props;

    const brushHeight = 18;

    const setRange2 = throttle(100, (curDom) => {
      setRange(curDom);
    });

    const setScale2 = throttle(100, (focDomain, focRange) => {
      setScale(focDomain, focRange);
    });

    // Conception to prenatal: 40 weeks
    // Infant to toddler: 0 to 36 months (40 to 196 weeks)
    // Childhood to adolescence: 3 to 13 years (196 to 716)
    const xLengths = [10, 6, 5]; // number of ticks in each interval
    const xProps = xLengths.map(x => x / 21);

    const xTicks = [
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36,
      m2w(0), m2w(6), m2w(12), m2w(18), m2w(24), m2w(30),
      y2w(3), y2w(5), y2w(7), y2w(9), y2w(11)
    ];

    // minor ticks
    const xTicks2 = [
      2, 6, 10, 14, 18, 22, 26, 30, 34, 38,
      m2w(3), m2w(9), m2w(15), m2w(21), m2w(27), m2w(33),
      y2w(4), y2w(6), y2w(8), y2w(10), y2w(12)
    ];

    // major ticks
    const xTicks3 = [
      0, m2w(0), y2w(3), y2w(13)
    ];

    const svg = select(node);
    const marginFoc = {
      top: 40, right: 0, bottom: 0, left: 0
    };
    const marginCtx = {
      top: 0,
      right: 0,
      bottom: this.props.windowSize.height - ui.header.height - ui.slider.height,
      left: 0
    }; // bottom should be svg height
    const width = +svg.attr('width') - marginFoc.left - marginFoc.right;
    const heightFoc = +svg.attr('height') - marginFoc.top - marginFoc.bottom;
    const heightCtx = +svg.attr('height') - marginCtx.top - marginCtx.bottom;

    // const xDomain = [0, 40, 196, 716];
    const xDomain = [-4, 40, 196, 850]; // this adds some padding to left and right of timeline
    const xRange = [0, width * xProps[0], width * (xProps[0] + xProps[1]), width];

    const xScaleFoc = scaleLinear()
      .range(xRange)
      .domain(xDomain);

    const xScaleCtx = scaleLinear()
      .range(xRange)
      .domain(xDomain);

    const xFocTicks = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      m2w(0), m2w(1), m2w(2), m2w(3), m2w(4), m2w(5), m2w(6), m2w(7), m2w(8), m2w(9),
      m2w(10), m2w(11), m2w(12), m2w(13), m2w(14), m2w(15), m2w(16), m2w(17), m2w(18),
      m2w(19), m2w(20), m2w(21), m2w(22), m2w(23), m2w(24), m2w(25), m2w(26), m2w(27),
      m2w(28), m2w(29), m2w(30), m2w(31), m2w(32), m2w(33), m2w(34), m2w(35),
      y2w(3), y2w(4), y2w(5), y2w(6), y2w(7), y2w(8), y2w(9), y2w(10), y2w(11), y2w(12)
    ];

    // focus view ticks
    const xAxisFoc2 = axisBottom(xScaleFoc)
      .tickValues(xTicks)
      .tickSize(this.props.windowSize.height - ui.header.height - ui.slider.height)
      .tickFormat(() => null);

    // focus view tick labels
    const xAxisFoc = axisBottom(xScaleFoc)
      .tickValues(xFocTicks)
      .tickSize(0)
      .tickFormat((d) => {
        if (d <= 39 && (Math.round(d) % 4) === 0) {
          return `${d}WK`;
        }
        if (d === 40) {
          return 'BIRTH';
        }
        if (d > 39 && d < 196 && (Math.round(w2m(d)) % 6) === 0) {
          return `${Math.round(w2m(d))}MO`;
        }
        if (d > 196 && ((Math.round(w2y(d)) + 1) % 2) === 0) {
          return `${Math.round(w2y(d))}YR`;
        }
        return null;
      });

    // context (full) timeline view major ticks
    const xAxisCtx = axisBottom(xScaleCtx)
      .tickValues(xTicks)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickFormat((d) => {
        if (d <= 36) {
          return d;
        }
        if (d > 38 && d < 196) {
          return Math.round(w2m(d));
        }
        // if (d > 196) {
        return Math.round(w2y(d));
        // }
      });

    // context (full) timeline view minor ticks
    const xAxisCtx2 = axisBottom(xScaleCtx)
      .tickValues(xTicks2)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickFormat(() => null);

    // context (full) timeline view tick labels
    const xAxisCtx3 = axisBottom(xScaleCtx)
      .tickValues(xTicks3)
      .tickSize(18)
      .tickSizeOuter(0)
      .tickFormat((d) => {
        if (d <= 36) {
          return 'CONCEPTION TO PRENATAL (weeks)';
        }
        if (d > 38 && d < 196) {
          return 'INFANT TO TODDLER (months)';
        }
        if (d > 196 && d < 300) {
          return 'CHILDHOOD TO ADOLESCENCE (years)';
        }
        return null;
      });

    const brush = brushX()
      .extent([[0, heightCtx], [width, heightCtx + brushHeight]])
      .on('brush end', updateView);

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', heightFoc);

    const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${marginCtx.left},${marginCtx.top})`);

    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${marginFoc.left},${marginFoc.top})`);

    focus.append('rect')
      .attr('class', 'focus-area')
      .attr('width', width)
      .attr('height', heightFoc);

    const gAxisFoc = focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${5})`)
      .call(xAxisFoc);

    gAxisFoc.selectAll('text')
      .attr('y', 2)
      .attr('x', 2)
      .style('text-anchor', 'start');
    gAxisFoc.selectAll('path')
      .attr('stroke', null);
    gAxisFoc.selectAll('line')
      .attr('stroke', null);

    const gAxisFoc2 = focus.append('g')
      .attr('class', 'axis axis--x2')
      .attr('transform', `translate(0,${5})`);

    gAxisFoc2.call(xAxisFoc2)
      .selectAll('path')
      .attr('stroke', null);
    gAxisFoc2.call(xAxisFoc2)
      .selectAll('line')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-dasharray', '1, 4')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx)
      .selectAll('text')
      .attr('y', 7) // how far the tick labels are below the axis line
      .attr('x', 3) // how far the tick labels are to the right of the tick lines
      .attr('fill', ui.slider.unselectColor)
      .style('text-anchor', 'start');

    context.append('g')
      .attr('class', 'axis axis--x2')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx2)
      .selectAll('text')
      .attr('fill', ui.slider.unselectColor);

    context.append('g')
      .attr('class', 'axis axis--x3')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx3)
      .selectAll('text')
      .attr('y', 23) // how far the tick labels are below the axis line
      .attr('fill', ui.slider.unselectColor)
      .style('text-anchor', 'start');

    svg.selectAll('.context .domain')
      .attr('stroke', ui.slider.unselectColor);

    const gBrush = context.append('g')
      .attr('class', 'brush')
      .call(brush);

    const handle = gBrush.selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter().append('path')
      .attr('class', 'handle--custom')
      .attr('fill', ui.slider.selectColor)
      .attr('cursor', 'ew-resize')
      .attr('d', arc()
        .innerRadius(0)
        .outerRadius(brushHeight / 2)
        .startAngle(0)
        .endAngle((d, i) => (i ? Math.PI : -Math.PI)));

    const brushLine = gBrush
      .append('rect')
      .attr('class', 'handle-line')
      .attr('width', 0)
      .attr('height', 1)
      .attr('stroke', ui.slider.selectColor);

    function findIndex(x, arr) {
      for (let ii = 0; ii < arr.length; ii += 1) {
        if (x === arr[ii] && ii > 0) {
          return ii - 1;
        }
        if (x <= arr[ii]) {
          return Math.max(0, ii - 1);
        }
      }
      return 0;
    }

    function updateXDomainRange(curDom) {
      // const xd = [];
      // const xr = [];
      const idx1 = findIndex(curDom[0], xDomain);
      const idx2 = findIndex(curDom[1], xDomain);
      const newDomain = [];
      const newRange = [];

      if (idx1 === idx2) {
        newDomain.push(curDom[0], curDom[1]);
        newRange.push(0, width);
      } else if ((idx2 - idx1) === 1) {
        const newLengths = [
          xLengths[idx1] * (xDomain[idx1 + 1] - curDom[0]) / (xDomain[idx1 + 1] - xDomain[idx1]),
          xLengths[idx2] * (curDom[1] - xDomain[idx2]) / (xDomain[idx2 + 1] - xDomain[idx2])
        ];
        const denom = newLengths[0] + newLengths[1];
        const newProps = newLengths.map(d => d / denom);
        newDomain.push(
          curDom[0],
          xDomain[idx1 + 1],
          curDom[1]
        );
        newRange.push(
          0,
          newProps[0] * width,
          width
        );
      } else if ((idx2 - idx1) === 2) {
        const newLengths = [
          xLengths[idx1] * (xDomain[idx1 + 1] - curDom[0]) / (xDomain[idx1 + 1] - xDomain[idx1]),
          xLengths[idx1 + 1],
          xLengths[idx2] * (curDom[1] - xDomain[idx2]) / (xDomain[idx2 + 1] - xDomain[idx2])
        ];
        const denom = newLengths[0] + newLengths[1] + newLengths[2];
        const newProps = newLengths.map(d => d / denom);
        newDomain.push(
          curDom[0],
          xDomain[idx1 + 1],
          xDomain[idx1 + 2],
          curDom[1]
        );
        newRange.push(
          0,
          newProps[0] * width,
          (newProps[0] + newProps[1]) * width,
          width
        );
      }
      return { domain: newDomain, range: newRange };
    }

    function updateView() {
      if (curEvent.sourceEvent && curEvent.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
      // const s = curEvent.selection || xScaleCtx.range();
      const s = curEvent.selection;
      let curDom;
      let focDomain;
      let focRange;
      if (s) { // if there is a selection
        curDom = s.map(xScaleCtx.invert);
        const newDR = updateXDomainRange(curDom);
        focDomain = newDR.domain;
        focRange = newDR.range;
        handle.attr('display', null)
          .attr('transform', (d, i) => `translate(${s[i]},${brushHeight / 2})`);
        brushLine
          .attr('width', s[1] - s[0])
          .attr('transform', `translate(${s[0]},${0})`);
      } else {
        // curDom = [Infinity, Infinity];
        curDom = [xDomain[0], xDomain[xDomain.length - 1]];
        focDomain = xDomain;
        focRange = xRange;
        handle.attr('display', 'none');
        brushLine.attr('width', 0);
      }

      xScaleFoc.domain(focDomain);
      xScaleFoc.range(focRange);

      // trigger a change to ageRange
      setRange2(curDom);
      setScale2(focDomain, focRange);
 
      // update the ticks in the focused timeline view
      focus.select('.axis--x')
        .call(xAxisFoc)
        .selectAll('text')
        .attr('y', 2)
        .attr('x', 2)
        .style('text-anchor', 'start');

      focus.select('.axis--x2').call(xAxisFoc2);

      // highlight selected axis ticks
      svg.selectAll('.context .axis--x text')
        .attr('fill', d => (
          (d >= curDom[0] && d <= curDom[1]) ? ui.slider.selectColor : ui.slider.unselectColor
        ));

      // highlight selected axis range labels (conception, infant, toddler)
      svg.selectAll('.context .axis--x3 text')
        .attr('fill', (d) => {
          if (d === xTicks3[0]) {
            return (curDom[0] <= xTicks3[1]) ? ui.slider.selectColor : ui.slider.unselectColor;
          }
          if (d === xTicks3[1]) {
            const inRange = curDom[0] <= xTicks3[2] && curDom[1] >= xTicks3[1];
            return inRange ? ui.slider.selectColor : ui.slider.unselectColor;
          }
          if (d === xTicks3[2]) {
            return (curDom[1] >= xTicks3[2]) ? ui.slider.selectColor : ui.slider.unselectColor;
          }
          return ui.slider.unselectColor;
        });

      // highlight selected major axis tick lines
      svg.selectAll('.context .axis line')
        .attr('stroke', d => (
          (d >= curDom[0] && d <= curDom[1]) ? ui.slider.selectColor : ui.slider.unselectColor
        ));
    }

    gBrush.call(brush.move, [xScaleCtx(this.props.ageRange[0]), xScaleCtx(this.props.ageRange[1])]);
  }

  render() {
    return (
      <svg
        ref={(node) => { this.node = node; }}
        width={Math.min(ui.maxWidth, this.props.windowSize.width)}
        height={this.props.windowSize.height - ui.header.height - ui.slider.height}
      />
    );
  }
}

const mapStateToProps = state => ({
  ageRange: state.ageRange,
  windowSize: state.windowSize
});

const mapDispatchToProps = dispatch => ({
  setRange: (range) => {
    dispatch(setAgeRange(range));
  },
  setScale: (domain, range) => {
    const scl = scaleLinear()
      .range(range)
      .domain(domain);
    dispatch(setTimelineFocusScale(scl));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgeSlider);
