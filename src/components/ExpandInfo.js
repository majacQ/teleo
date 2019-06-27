import React, { useState } from 'react';
// import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { niceAge } from '../utils/ageCalc';
import NetworkGraph from './NetworkGraph';
import RefsList from './RefsList';

const ExpandInfo = ({
  data, refsData, networkData, windowSize
}) => {
  const [refExpanded, setRefExpand] = useState(false);

  // const [expand] = useState(true);
  // // useEffect causes the component to render over and over and over
  // const [expand, setExpand] = useState(true);
  // useEffect(() => {
  //   setExpand(true);
  // });
  // console.log('rendering a lot...')

  const focWidth = windowSize.appWidth;

  const direct = false;

  // if this is a regular event, ref indices are stored in the data
  let refs = [];
  if (['nd', 'ogm'].indexOf(data.class) > -1) {
    ({ refs } = data);
  } else {
    let dcheck = ['NA', 'Y', 'N'];
    if (direct === true) {
      dcheck = ['NA', 'Y'];
    }
    const cls = data.class;
    const lnks = networkData.data.links;
    lnks.forEach((d) => {
      if (d[cls] === data.id && dcheck.indexOf(d.direct) > -1) {
        refs = refs.concat(d.refs);
      }
    });
    refs = refs.filter((item, i, ar) => ar.indexOf(item) === i);
  }
  // if it's a "pathway" event, we need to get the reference indices from the graph


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
          { data.subcat === undefined && <NetworkGraph data={data} /> }
          { data.subcat !== undefined && data.desc_long}
        </div>
        <div className="expand-info-hline" />
        <div className="expand-info-expand-refs">
          <span
            className="expand-info-ref-link"
            onClick={() => { setRefExpand(!refExpanded); }}
            onKeyPress={() => {}}
            role="presentation"
          >
            {`${refExpanded ? 'HIDE' : 'EXPAND'} REFERENCES (${refs.length})`}
            <span
              className={`icon-chevron-${refExpanded ? 'up' : 'down'} expand-info-ref-button`}
            />
          </span>
        </div>
        {refExpanded ? <RefsList data={refsData} indices={refs} nCol={Math.ceil(windowSize.appWidth / 350)} /> : '' }
      </div>
    </div>
  );
};

ExpandInfo.propTypes = {
  data: PropTypes.object.isRequired,
  refsData: PropTypes.object.isRequired,
  networkData: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  networkData: state.networkData,
  refsData: state.refsData
});

export default connect(
  mapStateToProps,
)(ExpandInfo);
