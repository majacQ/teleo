// const d3 = d3;

// get the size of text for each item in the data
// https://stackoverflow.com/questions/6117553/external-font-on-html5-canvas
// https://html.spec.whatwg.org/multipage/canvas.html#text-0
// TODO: make sure dt is sorted by gmdd_start_age
const dt = data['Developmental Domains'].data;
const tmpEl = document.createElement('canvas');
const ctx = tmpEl.getContext('2d');
ctx.font = '12px "Times New Roman"';
for (let i = 0; i < dt.length; i += 1) {
  dt[i].width = ctx.measureText(dt[i].gmdd_short_description).width;
}

// const unselectColor = '#565658';
const unselectColor = '#666';
// const selectColor = '#BCDCDE';
const selectColor = '#70B6BC';

const brushHeight = 15;

// Conception to prenatal: 40 weeks
// Infant to toddler: 0 to 36 months (40 to 196 weeks)
// Childhood to adolescence: 3 to 13 years (196 to 716)
const xLengths = [10, 6, 5]; // number of ticks in each interval
const xProps = xLengths.map(x => x / 21);
// ~52.18 weeks in a year
// add 40 weeks for to account for gestation
const y2w = x => x * (365.25 / 7) + 40;
const w2y = x => (x - 40) / (365.25 / 7);
// ~4.35 weeks in a month
const m2w = x => x * (365.25 / 12 / 7) + 40;
const w2m = x => (x - 40) / (365.25 / 12 / 7);

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

const svg = d3.select('svg');
const marginFoc = {
  top: 40, right: 20, bottom: 0, left: 40
};
const marginCtx = {
  top: 0,
  right: 20,
  bottom: parseInt(d3.select('svg').attr('height'), 10),
  left: 40
}; // bottom should be svg height
const width = +svg.attr('width') - marginFoc.left - marginFoc.right;
const heightFoc = +svg.attr('height') - marginFoc.top - marginFoc.bottom;
const heightCtx = +svg.attr('height') - marginCtx.top - marginCtx.bottom;

// const focAxisPad = 25;

const xDomain = [0, 40, 196, 716];
const xRange = [0, width * xProps[0], width * (xProps[0] + xProps[1]), width];

const xScaleFoc = d3.scaleLinear()
  .range(xRange)
  .domain(xDomain);

const xScaleCtx = d3.scaleLinear()
  .range(xRange)
  .domain(xDomain);

// const yScaleFoc = d3.scaleLinear()
//   .range([heightFoc, 0])
//   .domain([0.5, 25.5]);

const xFocTicks = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  m2w(0), m2w(1), m2w(2), m2w(3), m2w(4), m2w(5), m2w(6), m2w(7), m2w(8), m2w(9),
  m2w(10), m2w(11), m2w(12), m2w(13), m2w(14), m2w(15), m2w(16), m2w(17), m2w(18),
  m2w(19), m2w(20), m2w(21), m2w(22), m2w(23), m2w(24), m2w(25), m2w(26), m2w(27),
  m2w(28), m2w(29), m2w(30), m2w(31), m2w(32), m2w(33), m2w(34), m2w(35),
  y2w(3), y2w(4), y2w(5), y2w(6), y2w(7), y2w(8), y2w(9), y2w(10), y2w(11), y2w(12)
];

const xAxisFoc2 = d3.axisBottom(xScaleFoc)
  .tickValues(xTicks)
  .tickSize(500)
  .tickFormat(() => null);

const xAxisFoc = d3.axisBottom(xScaleFoc)
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

const xAxisCtx = d3.axisBottom(xScaleCtx)
  .tickValues(xTicks)
  .tickSize(6)
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

const xAxisCtx2 = d3.axisBottom(xScaleCtx)
  .tickValues(xTicks2)
  .tickSize(4)
  .tickFormat(() => null);

const xAxisCtx3 = d3.axisBottom(xScaleCtx)
  .tickValues(xTicks3)
  .tickSize(14)
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

const brush = d3.brushX()
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
  .attr('stroke-width', 1)
  .attr('stroke-linecap', 'round');

context.append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', `translate(0,${heightCtx})`)
  .call(xAxisCtx)
  .selectAll('text')
    .attr('y', 4)
    .attr('x', 2)
    .attr('fill', unselectColor)
    .style('text-anchor', 'start');

context.append('g')
  .attr('class', 'axis axis--x2')
  .attr('transform', `translate(0,${heightCtx})`)
  .call(xAxisCtx2)
  .selectAll('text')
    .attr('fill', unselectColor);

context.append('g')
  .attr('class', 'axis axis--x3')
  .attr('transform', `translate(0,${heightCtx})`)
  .call(xAxisCtx3)
  .selectAll('text')
    .attr('fill', unselectColor)
    .style('text-anchor', 'start');

d3.selectAll('.context .domain')
  .attr('stroke', unselectColor);

const gBrush = context.append('g')
  .attr('class', 'brush')
  .call(brush);

const handle = gBrush.selectAll('.handle--custom')
  .data([{ type: 'w' }, { type: 'e' }])
  .enter().append('path')
    .attr('class', 'handle--custom')
    .attr('fill', selectColor)
    .attr('cursor', 'ew-resize')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(brushHeight / 2)
      .startAngle(0)
      .endAngle((d, i) => (i ? Math.PI : -Math.PI)));

const brushLine = gBrush
  .append('rect')
  .attr('class', 'handle-line')
  .attr('width', 0)
  .attr('height', 1)
  .attr('stroke', selectColor);

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
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
  // const s = d3.event.selection || xScaleCtx.range();
  const s = d3.event.selection;
  let curDom;
  if (s) { // if there is a selection
    curDom = s.map(xScaleCtx.invert);
    const newDR = updateXDomainRange(curDom);
    xScaleFoc.domain(newDR.domain);
    xScaleFoc.range(newDR.range);
    handle.attr('display', null)
      .attr('transform', (d, i) => `translate(${s[i]},${brushHeight / 2})`);
    brushLine
      .attr('width', s[1] - s[0])
      .attr('transform', `translate(${s[0]},${0})`);
  } else {
    // curDom = [Infinity, Infinity];
    curDom = [xDomain[0], xDomain[xDomain.length - 1]];
    xScaleFoc.domain(xDomain);
    xScaleFoc.range(xRange);
    handle.attr('display', 'none');
    brushLine.attr('width', 0);
  }

  // update the ticks in the focused timeline view
  focus.select('.axis--x')
    .call(xAxisFoc)
    .selectAll('text')
    .attr('y', 2)
    .attr('x', 2)
    .style('text-anchor', 'start');

  // get positions of elements that should be visible
  const rows = [[]];
  const rowEnds = [0];
  const rowPad = 8;
  dt.forEach((d) => {
    const xStart = xScaleFoc(d.gmdd_start_age / 7);
    const eventWidth = xScaleFoc(d.gmdd_end_age / 7) - xStart;
    const outOfRange = xStart + eventWidth < 0 || xStart > 940;
    if (!outOfRange) {
      let curWidth = Math.max(d.width, eventWidth) + rowPad;
      let xStart2 = xStart;
      // we still want the full text to show if the event is on the left edge of the timeline
      let paddingLeft = 5;
      if (xStart < 0) {
        paddingLeft = xRange[0] - xStart + 5;
        curWidth = Math.max(d.width, xRange[0] - xStart);
        xStart2 = 0;
        console.log(curWidth);
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
        if (rw === 0 || (rw < xStart2 && rw + curWidth < 940)) {
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
  window.rows = rows;

  d3.select('#content').html('');

  rows.forEach((rowdat, i) => {
    d3.select('#content')
      .append('div')
      .attr('class', 'row')
      .append('div')
      .attr('class', 'row-abs')
      .attr('id', `row${i}`)
        .datum(rowdat)
        .selectAll('.element')
        .data(d => d)
        .enter()
        .append('div')
          .attr('class', 'rl')
          .style('left', d => `${d.xStart}px`)
          .style('width', d => `${Math.max(d.eventWidth, 5)}px`);
        });

    d3.selectAll('.rl')
      .append('div')
      .attr('class', 'rl-text')
      .style('padding-left', d => `${d.paddingLeft}px`)
      .text(d => d.gmdd_short_description);
    d3.selectAll('.rl')
    .append('div')
    .attr('class', 'stuff');

  focus.select('.axis--x2').call(xAxisFoc2);

  // highlight selected axis ticks
  d3.selectAll('.context .axis--x text')
    .attr('fill', d => (
      (d >= curDom[0] && d <= curDom[1]) ? selectColor : unselectColor
    ));

  // highlight selected axis range labels (conception, infant, toddler)
  d3.selectAll('.context .axis--x3 text')
    .attr('fill', (d) => {
      if (d === xTicks3[0]) {
        return (curDom[0] <= xTicks3[1]) ? selectColor : unselectColor;
      }
      if (d === xTicks3[1]) {
        const inRange = curDom[0] <= xTicks3[2] && curDom[1] >= xTicks3[1];
        return inRange ? selectColor : unselectColor;
      }
      if (d === xTicks3[2]) {
        return (curDom[1] >= xTicks3[2]) ? selectColor : unselectColor;
      }
      return unselectColor;
    });

  // highlight selected major axis tick lines
  d3.selectAll('.context .axis line')
    .attr('stroke', d => (
      (d >= curDom[0] && d <= curDom[1]) ? selectColor : unselectColor
    ));
}
