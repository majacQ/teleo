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
      select(this.node).html('');
      this.createNetworkGraph();
    }
  }

  createNetworkGraph() {
    const { node } = this;
    const { data, networkData } = this.props;

    const div = select(node);
    makeGraph(div, data.uid, data.class, false, networkData.data);
  }

  render() {
    const { windowSize } = this.props;
    return (
      <div id="nw-bounding" ref={(node) => { this.node = node; }}>
        <div id="nw-bounding-inner" style={{ width: 960, height: 500 }}>
          <svg width={windowSize.appWidth} height="500" />
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
