// let d3;
// let data;

const svg = d3.select('svg');
const bounding = d3.select('#bounding');
const dv = d3.select('#bounding-inner');
const width = +svg.attr('width');
const height = +svg.attr('height');

const textMeasure = bounding.append('div')
  .attr('id', 'textmeasure')
  .style('visibility', 'hidden')
  .style('width', '130px')
  .style('font-size', '10px')
  .style('font-family', 'sans-serif');

const sankey = d3.sankey()
  .nodeWidth(130)
  .nodePadding(0)
  .extent([[1, 1], [width - 1, height - 6]]);

sankey(data);

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

bounding.style('height', `${maxHeight}px`);
svg.attr('height', maxHeight);

data.nodes.forEach((d) => {
  d.y0 = yLookup[d.index][0] + 0; // eslint-disable-line no-param-reassign
  d.y1 = yLookup[d.index][1] + 0; // eslint-disable-line no-param-reassign
});

data.links.forEach((d) => {
  d.y0 = yLookup[d.source.index][0] + 12; // eslint-disable-line no-param-reassign
  d.y1 = yLookup[d.target.index][0] + 12; // eslint-disable-line no-param-reassign
});

// links
const links = svg.append('g')
  .attr('class', 'links')
  .selectAll('path')
  .data(data.links)
  .enter()
  .append('path')
  .attr('class', 'link')
  .attr('d', d3.sankeyLinkHorizontal())
  .attr('id', d => `link-${d.index}`)
  .attr('stroke-width', 1);

// nodes
dv.selectAll('div')
  .data(data.nodes)
  .enter().append('div')
  .attr('class', 'node-div')
  .attr('id', d => `node-${d.index}`)
  .style('left', d => `${d.x0}px`)
  .style('top', d => `${d.y0}px`)
  .style('height', d => `${d.y1 - d.y0}px`)
  .style('width', d => `${d.x1 - d.x0}px`)
  .html(d => d.name)
  .on('mouseover', (d) => { highlight(d); })
  .on('mouseout', () => {
    d3.selectAll('.node-div').classed('node-div-hl', false);
    d3.selectAll('.link-hl').classed('link-hl', false);
  })
  .on('click', (d) => { hideOthers(d); });

svg.append('g')
  .attr('class', 'dots')
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
  .attr('class', 'dots')
  .selectAll('dot')
  .data(data.links)
  .enter()
  .append('circle')
  .attr('class', 'dot2')
  .attr('id', d => `dot2-${d.index}`)
  .attr('r', 1)
  .attr('cx', d => d.target.x0)
  .attr('cy', d => d.target.y0 + 12);

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

const highlight = (d) => {
  const [idxs, lidxs] = getPathway(d);
  idxs.forEach(id => d3.select(`#node-${id}`).classed('node-div-hl', true));
  lidxs.forEach(id => d3.select(`#link-${id}`).classed('link-hl', true));
};

const hideOthers = (d) => {
  const [idxs, lidxs] = getPathway(d);

  // hide nodes not in pathway and move remaining ones
  const curHeights = {}
  Object.keys(yy).forEach((k) => {
    let cumHeight = 0;
    yy[k].forEach((a) => {
      if (idxs.indexOf(a.index) < 0) {
        d3.select(`#node-${a.index}`)
          .attr('class', 'node-div node-hidden')
          .transition()
          .duration(500)
          .style('opacity', 0)
          .transition()
          .style('display', 'none');
      } else {
        d3.select(`#node-${a.index}`)
          .attr('class', 'node-div node-showing')
          .transition()
          .delay(500)
          .duration(600)
          .style('top', `${cumHeight}px`);
        curHeights[a.index] = cumHeight;
        cumHeight = cumHeight + a.height + 5;
      }
    });
  });

  data.links.forEach((ll) => {
    if (lidxs.indexOf(ll.index) < 0) {
      // hide links not in pathway
      d3.select(`#link-${ll.index}`)
        .attr('class', 'link link-hidden')
        .transition()
        .duration(500)
        .style('opacity', 0);
      d3.select(`#dot1-${ll.index}`)
        .attr('class', 'dot1 dot1-hidden')
        .transition()
        .duration(500)
        .style('opacity', 0);
      d3.select(`#dot2-${ll.index}`)
        .attr('class', 'dot2 dot2-hidden')
        .transition()
        .duration(500)
        .style('opacity', 0);
    } else {
      // reposition links in pathway
      d3.select(`#link-${ll.index}`)
        .attr('class', 'link link-showing')
        .transition()
        .delay(500)
        .duration(600)
        .attr('d', d3.sankeyLinkHorizontal()
          .source(a => [a.source.x1, curHeights[a.source.index] + 12])
          .target(a => [a.target.x0, curHeights[a.target.index] + 12]));
      d3.select(`#dot1-${ll.index}`)
        .attr('class', 'dot1 dot1-showing')
        .transition()
        .delay(500)
        .duration(600)
        .attr('cy', a => curHeights[a.source.index] + 12);
      d3.select(`#dot2-${ll.index}`)
        .attr('class', 'dot2 dot2-showing')
        .transition()
        .delay(500)
        .duration(600)
        .attr('cy', a => curHeights[a.target.index] + 12);
    }
  });

  d3.selectAll('.node-div')
    .on('click', () => {});

  d3.select(`#node-${d.index}`)
    .classed('active-node', true)
    .on('click', a => showAll(a));
};

const showAll = (d) => {
  // restore height of visible nodes
  d3.selectAll('.node-showing')
    .transition()
    .duration(600)
    .attr('class', 'node-div')
    .style('top', a => `${a.y0}px`);

  // restore visibility of hidden nodes
  d3.selectAll('.node-hidden')
    .style('display', '')
    .transition()
    .delay(600)
    .duration(500)
    .attr('class', 'node-div')
    .style('opacity', 1)
    .transition();

  // restore position of visible links
  d3.selectAll('.link-showing')
    .transition()
    .duration(600)
    .attr('class', 'link')
    .attr('d', d3.sankeyLinkHorizontal());

  // restore visibility of hidden links
  d3.selectAll('.link-hidden')
    .attr('class', 'link')
    .transition()
    .delay(600)
    .duration(500)
    .style('opacity', 1);

  // restore position of visible dots
  d3.selectAll('.dot1-showing')
    .transition()
    .duration(600)
    .attr('class', 'dot1')
    .attr('cy', a => a.y0);
  d3.selectAll('.dot2-showing')
    .transition()
    .duration(600)
    .attr('class', 'dot2')
    .attr('cy', a => a.target.y0 + 12);

  // restore visibility of hidden dots
  d3.selectAll('.dot1-hidden')
    .transition()
    .delay(600)
    .duration(500)
    .attr('class', 'dot1')
    .style('opacity', 1);
  d3.selectAll('.dot2-hidden')
    .transition()
    .delay(600)
    .duration(500)
    .attr('class', 'dot2')
    .style('opacity', 1);

  // remove rectangle around clicked div
  d3.select(`#node-${d.index}`)
    .classed('active-node', false);

  // restore clickability of all divs
  d3.selectAll('.node-div')
    .on('click', (a) => { hideOthers(a); });
};
