// import { select, selectAll } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleLinear } from 'd3-scale';

const unique = (a) => a.filter((item, i, ar) => ar.indexOf(item) === i);

const riskColors = {
  '100,000 children': '#4798F2',
  '100,000 children years': '#AC61F7',
  '100,000 live births': '#E14DA0'
};

const riskClasses = {
  '100,000 children': 'children',
  '100,000 children years': 'children-years',
  '100,000 live births': 'live-births'
};

const makeGraph = (div, nodeId, category, direct, orfee, riskPad) => {
  const riskScales = {};
  riskScales['100,000 children'] = scaleLinear()
    .domain([Math.log10(1370), Math.log10(11000)])
    .range([0, riskPad - 5]);
  riskScales['100,000 children years'] = scaleLinear()
    .domain([Math.log10(3), Math.log10(230000)])
    .range([0, riskPad - 5]);
  riskScales['100,000 live births'] = scaleLinear()
    .domain([Math.log10(7), Math.log10(10000)])
    .range([0, riskPad - 5]);

  div.select('svg').selectAll('*').remove();
  div.select('#nw-bounding-inner').selectAll('div').remove();

  let highlight;
  let showAll;
  let hideOthers;

  // const orfi = Object.assign({}, {}, orfee);
  const orfi = JSON.parse(JSON.stringify(orfee));

  let selectedNode = {};
  orfi.nodes[category].data.forEach((d) => {
    if (d.id === nodeId) selectedNode = d;
  });

  // const direct = false;
  let dcheck = ['NA', 'Y', 'N'];
  if (direct === true) {
    dcheck = ['NA', 'Y'];
  }

  const data = { nodes: [], links: [] };

  const cls = selectedNode.class;
  const lnks = orfi.links;
  let nodeIds = [];
  lnks.forEach((d) => {
    if (d[cls] === selectedNode.id && dcheck.indexOf(d.direct) > -1) {
      // // below makes the order: int -> rf -> path -> ho
      // data.links.push({ source: d.path, target: d.ho, value: 1 });
      // data.links.push({ source: d.rf, target: d.path, value: 1 });
      // data.links.push({ source: d.int, target: d.rf, value: 1 });
      // below makes the order: ho -> path -> rf -> int
      data.links.push({ source: d.ho, target: d.path, value: 1 });
      data.links.push({ source: d.path, target: d.rf, value: 1 });
      data.links.push({ source: d.rf, target: d.int, value: 1 });
      nodeIds.push(d.ho);
      nodeIds.push(d.path);
      nodeIds.push(d.rf);
      nodeIds.push(d.int);
    }
  });

  // there will be some redundant links, so remove them
  data.links = data.links.reduce((p, c) => {
    const id = [c.source, c.target].join('-');
    if (p.temp.indexOf(id) === -1) {
      p.out.push(c);
      p.temp.push(id);
    }
    return p;
  }, { temp: [], out: [] }).out;

  nodeIds = unique(nodeIds);
  orfi.nodes.ho.data.forEach((d) => {
    if (nodeIds.indexOf(d.id) > -1) data.nodes.push(d);
  });
  orfi.nodes.path.data.forEach((d) => {
    if (nodeIds.indexOf(d.id) > -1) data.nodes.push(d);
  });
  orfi.nodes.rf.data.forEach((d) => {
    if (nodeIds.indexOf(d.id) > -1) data.nodes.push(d);
  });
  orfi.nodes.int.data.forEach((d) => {
    if (nodeIds.indexOf(d.id) > -1) data.nodes.push(d);
  });

  const svg = div.select('svg');
  // const bounding = div;
  const dv = div.select('#nw-bounding-inner');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const linkYOffset = 12; // how far down from top of node to place link
  const transVisibleDur = 200;
  const transMoveDur = 600;
  const nodeWidth = 130;

  const textMeasure = div.append('div')
    .attr('id', 'nw-textmeasure')
    .style('visibility', 'hidden')
    .style('width', '130px')
    .style('font-size', '10px')
    .style('font-family', 'Roboto');

  const sankeyObj = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(0)
    .nodeId((d) => d.id)
    .extent([[1, 1], [width - riskPad, height - 6]]);
    // width - riskPad allows space for risk indicators

  if (data.nodes.length > 0) {
    sankeyObj(data);
  }

  // create new y values to align to the top
  // and have height set to be the vertical size of the text
  const yy = {
    ho: [], path: [], rf: [], int: []
  };
  data.nodes.forEach((d) => (yy[d.class].push({
    y0: d.y0, index: d.index, name: d.name
  })));
  const yLookup = {};
  let maxHeight = 0;
  Object.keys(yy).forEach((k) => {
    yy[k].sort((a, b) => a.y0 - b.y0);
    let cumHeight = 0;
    yy[k].forEach((d, i) => {
      textMeasure.html(d.name);
      const curHeight = textMeasure.node().clientHeight;
      yy[k][i].height = curHeight;
      yLookup[d.index] = [cumHeight, cumHeight + curHeight];
      cumHeight = cumHeight + curHeight + 5;
      maxHeight = Math.max(cumHeight, maxHeight);
    });
  });

  div.style('height', `${maxHeight}px`);
  svg.attr('height', maxHeight);

  // manually set the y-axis location of nodes and links
  // and shift x-axis to make room for risk data vis
  data.nodes.forEach((d) => {
    d.x0 = d.x0 + riskPad; // eslint-disable-line no-param-reassign,operator-assignment
    d.x1 = d.x1 + riskPad; // eslint-disable-line no-param-reassign,operator-assignment
    d.y0 = yLookup[d.index][0] + 0; // eslint-disable-line no-param-reassign
    d.y1 = yLookup[d.index][1] + 0; // eslint-disable-line no-param-reassign
  });

  data.links.forEach((d) => {
    d.x0 = d.x0 + riskPad; // eslint-disable-line no-param-reassign,operator-assignment
    d.x1 = d.x1 + riskPad; // eslint-disable-line no-param-reassign,operator-assignment
    d.y0 = yLookup[d.source.index][0] + linkYOffset; // eslint-disable-line no-param-reassign
    d.y1 = yLookup[d.target.index][0] + linkYOffset; // eslint-disable-line no-param-reassign
  });

  // links
  svg.append('g')
    .attr('class', 'nw-links')
    .selectAll('path')
    .data(data.links)
    .enter()
    .append('path')
    .attr('class', 'nw-link')
    .attr('d', sankeyLinkHorizontal())
    .attr('id', (d) => `nw-link-${d.index}`)
    .attr('stroke-width', 1);

  const tooltip = dv.append('div')
    .attr('class', 'nw-tooltip')
    .attr('class', 'nw-tooltip-hidden');

  const tooltipText = tooltip.append('div')
    .attr('class', 'nw-tooltip-text')
    .html('ABSOLUTE RISK UNIT');

  const tooltipUnits = tooltip.append('div')
    .attr('class', 'nw-tooltip-units');

  // nodes
  const labelDiv = dv.append('div');

  labelDiv.selectAll('div')
    .data(data.nodes)
    .enter()
    .append('div')
    .attr('class', 'nw-node-div')
    .attr('id', (d) => `nw-node-${d.index}`)
    .style('left', (d) => `${d.x0}px`)
    .style('top', (d) => `${d.y0}px`)
    .style('height', (d) => `${d.y1 - d.y0}px`)
    .style('width', (d) => `${d.x1 - d.x0}px`)
    .html((d) => d.name)
    .on('mouseover', (d) => { highlight(d); })
    .on('mouseout', () => {
      div.selectAll('.nw-node-div').classed('nw-node-div-hl', false);
      div.selectAll('.nw-link-hl').classed('nw-link-hl', false);
    })
    .on('click', (d) => { hideOthers(d); });

  svg.append('g')
    .attr('class', 'nw-dots')
    .selectAll('dot')
    .data(data.links)
    .enter()
    .append('circle')
    .attr('class', 'nw-dot1')
    .attr('id', (d) => `nw-dot1-${d.index}`)
    .attr('r', 1)
    .attr('cx', (d) => d.source.x1)
    .attr('cy', (d) => d.y0);

  svg.append('g')
    .attr('class', 'nw-dots')
    .selectAll('dot')
    .data(data.links)
    .enter()
    .append('circle')
    .attr('class', 'nw-dot2')
    .attr('id', (d) => `nw-dot2-${d.index}`)
    .attr('r', 1)
    .attr('cx', (d) => d.target.x0)
    .attr('cy', (d) => d.target.y0 + linkYOffset);

  const hoNodes = data.nodes.filter((d) => d.class === 'ho');

  const riskLineDiv = dv.append('div');
  riskLineDiv.selectAll('div')
    .data(hoNodes)
    .enter()
    .append('div')
    .attr('class', 'risk-div')
    .attr('id', (d) => `risk-line-${d.index}`)
    .style('background', (d) => riskColors[d.abs_risk_units])
    .style('left', (d) => `${d.x0 - riskPad}px`)
    .style('top', (d) => `${d.y0 + 10}px`)
    .style('height', '1px')
    .style('width', `${riskPad - 5}px`);

  const riskDot1Div = dv.append('div');
  riskDot1Div.selectAll('div')
    .data(hoNodes)
    .enter()
    .append('div')
    .attr('class', 'risk-div')
    .attr('id', (d) => `risk-dot1-${d.index}`)
    .style('background', (d) => riskColors[d.abs_risk_units])
    .style('left', (d) => `${d.x0 - riskPad}px`)
    .style('top', (d) => `${d.y0 + 9}px`)
    .style('border', '0px')
    .style('box-sizing', 'border-box')
    .style('border-radius', '3px')
    .style('height', '3px')
    .style('width', '3px');

  const riskDot2Div = dv.append('div');
  riskDot2Div.selectAll('div')
    .data(hoNodes)
    .enter()
    .append('div')
    .attr('class', 'risk-div')
    .attr('id', (d) => `risk-dot2-${d.index}`)
    .style('background', (d) => riskColors[d.abs_risk_units])
    .style('left', (d) => `${d.x0 - 5}px`)
    .style('top', (d) => `${d.y0 + 9}px`)
    .style('border', '0px')
    .style('border-radius', '3px')
    .style('height', '3px')
    .style('width', '3px');

  const riskMarkerDiv = dv.append('div');
  riskMarkerDiv.selectAll('div')
    .data(hoNodes)
    .enter()
    .append('div')
    .attr('class', 'risk-div')
    .attr('id', (d) => `risk-marker-${d.index}`)
    .style('background', 'black')
    .style('left', (d) => `${riskScales[d.abs_risk_units](Math.log10(d.abs_risk))}px`)
    .style('top', (d) => `${d.y0 + 6}px`)
    .style('border', (d) => `1px solid ${riskColors[d.abs_risk_units]}`)
    .style('border-radius', '6px')
    .style('height', '6px')
    .style('width', '6px');

  const riskHoverBox = dv.append('div');
  riskHoverBox.selectAll('div')
    .data(hoNodes)
    .enter()
    .append('div')
    .attr('class', 'nw-tooltip-hover-box')
    .style('left', (d) => `${d.x0 - riskPad - 3}px`)
    .style('top', (d) => `${d.y0 + 2}px`)
    // .style('background', 'rgba(255,0,0,0.5)')
    .style('width', '56px')
    .style('height', '18px')
    .on('mouseover', (d) => {
      tooltip.style('left', `${d.x0 + 10}px`)
        .style('top', `${d.y0 - 5}px`)
        .attr('class', `nw-tooltip nw-tooltip-${riskClasses[d.abs_risk_units]}`);

      tooltipText.style('color', riskColors[d.abs_risk_units]);

      tooltipUnits.style('color', riskColors[d.abs_risk_units])
        .html(d.abs_risk_units);
    })
    .on('mouseout', () => {
      tooltip.attr('class', 'nw-tooltip-hidden');
    });

  const getPathway = (d) => {
    const idxs = [d.index];
    const lidxs = [];
    const traverse = (obj, item) => {
      obj[item.a].forEach((a) => {
        lidxs.push(a.index);
        if (idxs.indexOf(a[item.b].index) < 0) {
          idxs.push(a[item.b].index);
          traverse(a[item.b], item);
        }
      });
    };
    const vals = [
      { a: 'sourceLinks', b: 'target' },
      { a: 'targetLinks', b: 'source' }
    ];
    vals.forEach((it) => traverse(d, it));
    return [idxs, lidxs];
  };

  highlight = (d) => {
    const [idxs, lidxs] = getPathway(d);
    idxs.forEach((id) => div.select(`#nw-node-${id}`).classed('nw-node-div-hl', true));
    lidxs.forEach((id) => div.select(`#nw-link-${id}`).classed('nw-link-hl', true));
  };

  hideOthers = (d) => {
    const [idxs, lidxs] = getPathway(d);
    let curMaxHeight = 0;

    // hide nodes not in pathway and move remaining ones
    const curHeights = {};
    Object.keys(yy).forEach((k) => {
      let cumHeight = 0;
      yy[k].forEach((a) => {
        if (idxs.indexOf(a.index) < 0) {
          div.select(`#nw-node-${a.index}`)
            .attr('class', 'nw-node-div nw-node-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
          div.select(`#risk-line-${a.index}`)
            .attr('class', 'risk-line-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
          div.select(`#risk-dot1-${a.index}`)
            .attr('class', 'risk-dot-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
          div.select(`#risk-dot2-${a.index}`)
            .attr('class', 'risk-dot-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
          div.select(`#risk-marker-${a.index}`)
            .attr('class', 'risk-marker-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
        } else {
          div.select(`#nw-node-${a.index}`)
            .attr('class', 'nw-node-div nw-node-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight}px`);
          div.select(`#risk-line-${a.index}`)
            .attr('class', 'risk-div risk-line-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight + 10}px`);
          div.select(`#risk-dot1-${a.index}`)
            .attr('class', 'risk-div risk-dot-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight + 9}px`);
          div.select(`#risk-dot2-${a.index}`)
            .attr('class', 'risk-div risk-dot-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight + 9}px`);
          div.select(`#risk-marker-${a.index}`)
            .attr('class', 'risk-div risk-marker-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight + 6}px`);
          curHeights[a.index] = cumHeight;
          cumHeight = cumHeight + a.height + 5;
          curMaxHeight = Math.max(cumHeight, curMaxHeight);
        }
      });
    });

    data.links.forEach((ll) => {
      if (lidxs.indexOf(ll.index) < 0) {
        // hide links not in pathway
        div.select(`#nw-link-${ll.index}`)
          .attr('class', 'nw-link nw-link-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
        div.select(`#nw-dot1-${ll.index}`)
          .attr('class', 'nw-dot1 nw-dot1-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
        div.select(`#nw-dot2-${ll.index}`)
          .attr('class', 'nw-dot2 nw-dot2-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
      } else {
        // reposition links in pathway
        div.select(`#nw-link-${ll.index}`)
          .attr('class', 'nw-link nw-link-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('d', sankeyLinkHorizontal()
            .source((a) => [a.source.x1, curHeights[a.source.index] + linkYOffset])
            .target((a) => [a.target.x0, curHeights[a.target.index] + linkYOffset]));
        div.select(`#nw-dot1-${ll.index}`)
          .attr('class', 'nw-dot1 nw-dot1-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('cy', (a) => curHeights[a.source.index] + linkYOffset);
        div.select(`#nw-dot2-${ll.index}`)
          .attr('class', 'nw-dot2 nw-dot2-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('cy', (a) => curHeights[a.target.index] + linkYOffset);
      }
    });

    div
      .transition()
      .delay(transVisibleDur)
      .duration(transMoveDur)
      .style('height', `${curMaxHeight}px`);
    svg
      .transition()
      .delay(transVisibleDur)
      .duration(transMoveDur)
      .attr('height', curMaxHeight);

    div.selectAll('.nw-node-div')
      .on('click', () => {});

    div.select(`#nw-node-${d.index}`)
      .classed('nw-active-node', true)
      .on('click', (a) => showAll(a));
  };

  showAll = (d) => {
    // restore height of visible nodes
    div.selectAll('.nw-node-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'nw-node-div')
      .style('top', (a) => `${a.y0}px`);
    div.selectAll('.risk-line-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'risk-div')
      .style('top', (a) => `${a.y0 + 10}px`);
    div.selectAll('.risk-dot-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'risk-div')
      .style('top', (a) => `${a.y0 + 9}px`);
    div.selectAll('.risk-marker-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'risk-div')
      .style('top', (a) => `${a.y0 + 6}px`);

    // restore visibility of hidden nodes
    div.selectAll('.nw-node-hidden')
      .style('display', '')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'nw-node-div')
      .style('opacity', 1)
      .transition();
    div.selectAll('.risk-line-hidden')
      .style('display', '')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'risk-div')
      .style('opacity', 1)
      .transition();
    div.selectAll('.risk-dot-hidden')
      .style('display', '')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'risk-div')
      .style('opacity', 1)
      .transition();
    div.selectAll('.risk-marker-hidden')
      .style('display', '')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'risk-div')
      .style('opacity', 1)
      .transition();

    // restore position of visible links
    div.selectAll('.nw-link-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'nw-link')
      .attr('d', sankeyLinkHorizontal());

    // restore visibility of hidden links
    div.selectAll('.nw-link-hidden')
      .attr('class', 'nw-link')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .style('opacity', 1);

    // restore position of visible dots
    div.selectAll('.nw-dot1-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'nw-dot1')
      .attr('cy', (a) => a.y0);
    div.selectAll('.nw-dot2-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'nw-dot2')
      .attr('cy', (a) => a.target.y0 + linkYOffset);

    // restore visibility of hidden dots
    div.selectAll('.nw-dot1-hidden')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'nw-dot1')
      .style('opacity', 1);
    div.selectAll('.nw-dot2-hidden')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'nw-dot2')
      .style('opacity', 1);

    // remove rectangle around clicked div
    div.select(`#nw-node-${d.index}`)
      .classed('nw-active-node', false);

    // restore clickability of all divs
    div.selectAll('.nw-node-div')
      .on('click', (a) => { hideOthers(a); });

    div
      .transition()
      .duration(transMoveDur)
      .style('height', `${maxHeight}px`);
    svg
      .transition()
      .duration(transMoveDur)
      .attr('height', maxHeight);
  };
};

export default makeGraph;
