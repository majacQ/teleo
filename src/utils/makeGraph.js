// import { select, selectAll } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const unique = a => a.filter((item, i, ar) => ar.indexOf(item) === i);

const makeGraph = (div, nodeId, category, direct, orfee) => {
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
    .attr('id', 'textmeasure')
    .style('visibility', 'hidden')
    .style('width', '130px')
    .style('font-size', '10px')
    .style('font-family', 'sans-serif');

  const sankeyObj = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(0)
    .nodeId(d => d.id)
    .extent([[1, 1], [width - 1, height - 6]]);

  sankeyObj(data);

  // create new y values to align to the top
  // and have height set to be the vertical size of the text
  const yy = {
    ho: [], path: [], rf: [], int: []
  };
  data.nodes.forEach(d => (yy[d.class].push({
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

  data.nodes.forEach((d) => {
    d.y0 = yLookup[d.index][0] + 0; // eslint-disable-line no-param-reassign
    d.y1 = yLookup[d.index][1] + 0; // eslint-disable-line no-param-reassign
  });

  data.links.forEach((d) => {
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
    .attr('class', 'link')
    .attr('d', sankeyLinkHorizontal())
    .attr('id', d => `link-${d.index}`)
    .attr('stroke-width', 1);

  // nodes
  dv.selectAll('div')
    .data(data.nodes)
    .enter().append('div')
    .attr('class', 'nw-node-div')
    .attr('id', d => `node-${d.index}`)
    .style('left', d => `${d.x0}px`)
    .style('top', d => `${d.y0}px`)
    .style('height', d => `${d.y1 - d.y0}px`)
    .style('width', d => `${d.x1 - d.x0}px`)
    .html(d => d.name)
    .on('mouseover', (d) => { highlight(d); })
    .on('mouseout', () => {
      div.selectAll('.nw-node-div').classed('nw-node-div-hl', false);
      div.selectAll('.nw-link-hl').classed('link-hl', false);
    })
    .on('click', (d) => { hideOthers(d); });

  svg.append('g')
    .attr('class', 'nw-dots')
    .selectAll('dot')
    .data(data.links)
    .enter()
    .append('circle')
    .attr('class', 'dot1')
    .attr('id', d => `dot1-${d.index}`)
    .attr('r', 1)
    .attr('cx', d => d.source.x1)
    .attr('cy', d => d.y0);

  svg.append('g')
    .attr('class', 'nw-dots')
    .selectAll('dot')
    .data(data.links)
    .enter()
    .append('circle')
    .attr('class', 'dot2')
    .attr('id', d => `dot2-${d.index}`)
    .attr('r', 1)
    .attr('cx', d => d.target.x0)
    .attr('cy', d => d.target.y0 + linkYOffset);

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
    vals.forEach(it => traverse(d, it));
    return [idxs, lidxs];
  };

  highlight = (d) => {
    const [idxs, lidxs] = getPathway(d);
    idxs.forEach(id => div.select(`#node-${id}`).classed('nw-node-div-hl', true));
    lidxs.forEach(id => div.select(`#link-${id}`).classed('link-hl', true));
  };

  hideOthers = (d) => {
    const [idxs, lidxs] = getPathway(d);

    // hide nodes not in pathway and move remaining ones
    const curHeights = {};
    Object.keys(yy).forEach((k) => {
      let cumHeight = 0;
      yy[k].forEach((a) => {
        if (idxs.indexOf(a.index) < 0) {
          div.select(`#node-${a.index}`)
            .attr('class', 'nw-node-div node-hidden')
            .transition()
            .duration(transVisibleDur)
            .style('opacity', 0)
            .transition()
            .style('display', 'none');
        } else {
          div.select(`#node-${a.index}`)
            .attr('class', 'nw-node-div node-showing')
            .transition()
            .delay(transVisibleDur)
            .duration(transMoveDur)
            .style('top', `${cumHeight}px`);
          curHeights[a.index] = cumHeight;
          cumHeight = cumHeight + a.height + 5;
        }
      });
    });

    data.links.forEach((ll) => {
      if (lidxs.indexOf(ll.index) < 0) {
        // hide links not in pathway
        div.select(`#link-${ll.index}`)
          .attr('class', 'link link-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
        div.select(`#dot1-${ll.index}`)
          .attr('class', 'dot1 dot1-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
        div.select(`#dot2-${ll.index}`)
          .attr('class', 'dot2 dot2-hidden')
          .transition()
          .duration(transVisibleDur)
          .style('opacity', 0);
      } else {
        // reposition links in pathway
        div.select(`#link-${ll.index}`)
          .attr('class', 'link link-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('d', sankeyLinkHorizontal()
            .source(a => [a.source.x1, curHeights[a.source.index] + linkYOffset])
            .target(a => [a.target.x0, curHeights[a.target.index] + linkYOffset]));
        div.select(`#dot1-${ll.index}`)
          .attr('class', 'dot1 dot1-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('cy', a => curHeights[a.source.index] + linkYOffset);
        div.select(`#dot2-${ll.index}`)
          .attr('class', 'dot2 dot2-showing')
          .transition()
          .delay(transVisibleDur)
          .duration(transMoveDur)
          .attr('cy', a => curHeights[a.target.index] + linkYOffset);
      }
    });

    div.selectAll('.nw-node-div')
      .on('click', () => {});

    div.select(`#node-${d.index}`)
      .classed('nw-active-node', true)
      .on('click', a => showAll(a));
  };

  showAll = (d) => {
    // restore height of visible nodes
    div.selectAll('.node-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'nw-node-div')
      .style('top', a => `${a.y0}px`);

    // restore visibility of hidden nodes
    div.selectAll('.node-hidden')
      .style('display', '')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'nw-node-div')
      .style('opacity', 1)
      .transition();

    // restore position of visible links
    div.selectAll('.link-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal());

    // restore visibility of hidden links
    div.selectAll('.link-hidden')
      .attr('class', 'link')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .style('opacity', 1);

    // restore position of visible dots
    div.selectAll('.dot1-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'dot1')
      .attr('cy', a => a.y0);
    div.selectAll('.dot2-showing')
      .transition()
      .duration(transMoveDur)
      .attr('class', 'dot2')
      .attr('cy', a => a.target.y0 + linkYOffset);

    // restore visibility of hidden dots
    div.selectAll('.dot1-hidden')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'dot1')
      .style('opacity', 1);
    div.selectAll('.dot2-hidden')
      .transition()
      .delay(transMoveDur)
      .duration(transVisibleDur)
      .attr('class', 'dot2')
      .style('opacity', 1);

    // remove rectangle around clicked div
    div.select(`#node-${d.index}`)
      .classed('nw-active-node', false);

    // restore clickability of all divs
    div.selectAll('.nw-node-div')
      .on('click', (a) => { hideOthers(a); });
  };
};

export default makeGraph;
