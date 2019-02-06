import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { niceAge } from '../utils/ageCalc';
import NetworkGraph from './NetworkGraph';
// import { CSSTransition } from 'react-transition-group';

const ExpandInfo = ({
  data, windowSize
}) => {
  const focWidth = windowSize.appWidth;

  // <CSSTransition
  //   timeout={300}
  //   classNames="expand-info"
  //   onEnter={() => alert('hi')}
  // >

  return (
    <div className="expand-info-wrapper" style={{ width: windowSize.width }}>
      <div className="expand-info" style={{ width: focWidth, marginLeft: windowSize.appLeft }}>
        <div className="expand-info-header">{data.desc_short}</div>
        <div className="expand-info-age-container">
          <div className="expand-info-age-label">
            Start age
          </div>
          <div className="expand-info-age">
            {niceAge(data.age_start)}
          </div>
        </div>
        <div className="expand-info-age-container">
          <div className="expand-info-age-label">
            Peak start
          </div>
          <div className="expand-info-age">
            {data.age_start_peak ? niceAge(data.age_start_peak) : 'n/a'}
          </div>
        </div>
        <div className="expand-info-age-container">
          <div className="expand-info-age-label">
            Peak end
          </div>
          <div className="expand-info-age">
            {data.age_end_peak ? niceAge(data.age_end_peak) : 'n/a'}
          </div>
        </div>
        <div className="expand-info-age-container">
          <div className="expand-info-age-label">
            End age
          </div>
          <div className="expand-info-age">
            {niceAge(data.age_end)}
          </div>
        </div>
        <div className="expand-info-hline" />
        <div className="expand-info-detail">
          { data.class !== undefined && <NetworkGraph data={data} /> }
          { data.class === undefined && data.desc_long}
        </div>
        <div className="expand-info-hline" />
      </div>
    </div>
  );
};

ExpandInfo.propTypes = {
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  networkData: state.networkData
});

export default connect(
  mapStateToProps,
)(ExpandInfo);
