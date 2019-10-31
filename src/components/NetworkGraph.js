import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { select } from 'd3-selection';
import Button from '@material-ui/core/Button';
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
        <div className="nw-info">
          Select items to visually filter threads
        </div>
        <div className="nw-subheader">
          <div className="nw-alldirect">
            <Button
              classes={{
                label: `nw-button-label-${!direct ? 'active' : 'inactive'}`,
                root: `nw-button-root-${!direct ? 'active' : 'inactive'}`
              }}
              className={`${!direct ? 'active' : ''}`}
              id="nw-all"
              onClick={() => this.setState({ direct: false })}
            >
              ALL
            </Button>
            <Button
              classes={{
                label: `nw-button-label-${direct ? 'active' : 'inactive'}`,
                root: `nw-button-root-${direct ? 'active' : 'inactive'}`
              }}
              className={`${direct ? 'active' : ''}`}
              id="nw-direct"
              onClick={() => this.setState({ direct: true })}
            >
              DIRECT
            </Button>
          </div>
          <div className="nw-legend">
            <div>
              ABSOLUTE RISK
            </div>
            <div className="nw-legend-row">
              <div>less</div>
              <div className="nw-legend-risk">
                <div
                  className="nw-risk-div"
                  style={{
                    background: '#939598', left: 1 + 20, top: 8, height: 1, width: 45
                  }}
                />
                <div
                  className="nw-risk-div"
                  style={{
                    background: '#939598', left: 1 + 20, top: 7, border: 0, boxSizing: 'border-box', borderRadius: 3, height: 3, width: 3
                  }}
                />
                <div
                  className="nw-risk-div"
                  style={{
                    background: '#939598', left: 46 + 20, top: 7, border: 0, borderRadius: 3, height: 3, width: 3
                  }}
                />
                <div
                  className="nw-risk-div"
                  style={{
                    background: 'black', left: 20 + 20, top: 4, border: '1px solid #939598', borderRadius: 6, height: 6, width: 6
                  }}
                />
              </div>
              <div>more risk</div>
            </div>
          </div>
        </div>
        <div id="nw-headers">
          <div className="nw-header-text" style={{ left: 0 }}>Health Outcome</div>
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

const mapStateToProps = (state) => ({
  windowSize: state.windowSize,
  networkData: state.networkData
});

export default connect(
  mapStateToProps
)(NetworkGraph);
