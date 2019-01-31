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
  yy[k].forEach((d) => {
    textMeasure.html(d.name);
    const curHeight = textMeasure.node().clientHeight;
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
svg.append('g')
  .attr('class', 'links')
  .selectAll('path')
  .data(data.links)
  .enter()
  .append('path')
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
    d3.selectAll('.node-div').attr('class', 'node-div');
    d3.selectAll('.link-hl').attr('class', '');
  });

svg.append('g')
  .attr('class', 'dots')
  .selectAll('dot')
  .data(data.links)
  .enter()
  .append('circle')
  .attr('r', 1)
  .attr('cx', d => d.source.x1)
  .attr('cy', d => d.y0);

svg.append('g')
  .attr('class', 'dots')
  .selectAll('dot')
  .data(data.links)
  .enter()
  .append('circle')
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
  idxs.forEach(id => d3.select(`#node-${id}`).attr('class', 'node-div node-div-hl'));
  lidxs.forEach(id => d3.select(`#link-${id}`).attr('class', 'link-hl'));
};
