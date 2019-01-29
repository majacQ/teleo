import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ExpandInfo = ({
  data, windowSize
}) => {
  const focWidth = windowSize.appWidth;

  return (
    <div className="expand-info" style={{ width: focWidth }}>
      <div className="expand-info-header">{data.desc_short}</div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Start age
        </div>
        <div className="expand-info-age">
          {data.age_start}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Peak start
        </div>
        <div className="expand-info-age">
          {data.age_start_peak ? data.age_start_peak : 'n/a'}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          Peak end
        </div>
        <div className="expand-info-age">
          {data.age_end_peak ? data.age_end_peak : 'n/a'}
        </div>
      </div>
      <div className="expand-info-age-container">
        <div className="expand-info-age-label">
          End age
        </div>
        <div className="expand-info-age">
          {data.age_end}
        </div>
      </div>
      <div className="expand-info-hline" />
      <div className="expand-info-detail">
        {data.desc_long}
      </div>
      <div className="expand-info-hline" />
    </div>
  );
};

ExpandInfo.propTypes = {
  data: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(ExpandInfo);