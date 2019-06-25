import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { select } from 'd3-selection';
// import { ui } from '../constants';
import makeGraph from '../utils/makeGraph';

class NetworkGraph extends Component {
  constructor(props) {
    super(props);
    this.createNetworkGraph = this.createNetworkGraph.bind(this);
    this.state = { direct: false };
    this.riskPad = 50;
  }

  componentDidMount() {
    const { networkData } = this.props;
    if (networkData.isLoaded) {
      this.createNetworkGraph();
    }
  }

  componentDidUpdate() {
    // prevProps
    const { networkData } = this.props;
    if (networkData.isLoaded) {
      this.createNetworkGraph();
    }
  }

  createNetworkGraph() {
    const { node } = this;
    const { data, networkData } = this.props;
    const { direct } = this.state;

    const div = select(node);
    makeGraph(div, data.uid, data.class, direct, networkData.data, this.riskPad);
  }

  render() {
    const { windowSize } = this.props;
    const nodeWidth = 130;
    const linkWidth = (windowSize.appWidth - 20 - this.riskPad - (4 * nodeWidth)) / 3;
    const { direct } = this.state;
    return (
      <div>
        <div className="nw-alldirect">
          <span
            className={`${!direct ? 'active' : ''}`}
            id="nw-all"
            onKeyPress={() => {}}
            onClick={() => this.setState({ direct: false })}
            role="presentation"
          >
            ALL
          </span>
          <span
            className={`${direct ? 'active' : ''}`}
            id="nw-direct"
            onKeyPress={() => {}}
            onClick={() => this.setState({ direct: true })}
            role="presentation"
          >
            DIRECT
          </span>
        </div>
        <div id="nw-headers">
          <div className="nw-header-text" style={{ left: 5 }}>Health Outcome</div>
          <div className="nw-header-text" style={{ left: 5 + this.riskPad + nodeWidth + linkWidth }}>Pathogenesis</div>
          <div className="nw-header-text" style={{ left: 5 + this.riskPad + 2 * (nodeWidth + linkWidth) }}>Risk Factor</div>
          <div className="nw-header-text" style={{ left: 5 + this.riskPad + 3 * (nodeWidth + linkWidth) }}>Intervention</div>
        </div>
        <div id="nw-bounding" ref={(node) => { this.node = node; }}>
          <div id="nw-bounding-inner" style={{ width: windowSize.appWidth - 20 }}>
            <svg width={windowSize.appWidth - 20} />
          </div>
        </div>
      </div>
    );
  }
}

NetworkGraph.propTypes = {
  windowSize: PropTypes.object.isRequired,
  networkData: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  networkData: state.networkData
});

export default connect(
  mapStateToProps
)(NetworkGraph);
