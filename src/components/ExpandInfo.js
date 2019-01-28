import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ExpandInfo = ({
  data, windowSize
}) => {
  const focWidth = windowSize.appWidth;

  return (
    <div className="expand-info" style={{ width: focWidth }}>
      <div className="expand-info-header">{data.gmdd_short_description}</div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Start age
        </div>
        <div className="expand-info-age">
          {data.gmdd_start_age}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Peak start
        </div>
        <div className="expand-info-age">
          {data.gmdd_peak_start_age ? data.gmdd_peak_start_age : 'n/a'}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Peak end
        </div>
        <div className="expand-info-age">
          {data.gmdd_peak_end_age ? data.gmdd_peak_end_age : 'n/a'}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          End age
        </div>
        <div className="expand-info-age">
          {data.gmdd_end_age}
        </div>
      </div>
      <div className="expand-info-hline" />
      <div className="expand-info-detail">
        {data.gmdd_long_description}
      </div>
      <div className="expand-info-hline" />
    </div>
  );
};

ExpandInfo.propTypes = {
  data: PropTypes.array.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(ExpandInfo);
