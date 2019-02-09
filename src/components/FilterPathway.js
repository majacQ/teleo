import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { setFilters, setPathwayOpen } from '../actions';
import { ui } from '../constants';

const FilterPathway = ({
  windowSize, selected, pathwayOpen, data, openPathway
}) => {
  if (pathwayOpen === false || data.nodes === undefined) {
    return '';
  }

  const emptyText = [
    'Pneumonia, Measles, Type 1 Diabetes, etc.',
    'Malnutrition, Maternal Drug Use, Hypoxia, etc.',
    'Immunization, Exclusive Breastfeeding, Chemotherapy, etc.'
  ];

  const keys = ['ho', 'rf', 'int'];
  const content = keys.map((d, i) => {
    const dat = selected[d];
    if (dat.length > 0) {
      return dat.join(', ');
    }
    return (
      <div className="pathway-empty-text">
        Examples:
        <br />
        {emptyText[i]}
      </div>
    );
  });

  return (
    <div className="pathway-container" style={{ width: windowSize.appWidth, marginTop: ui.header.height, left: windowSize.appLeft }}>
      <div className="pathway-header">
        <Button className="header-filter-button" onClick={openPathway}>
          <span className="icon-chevron-left header-filter-icon" />
          Back
        </Button>
      </div>
      <div className="pathways-container" style={{ width: windowSize.appWidth, left: windowSize.appLeft }}>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Health Outcomes</span>
          </div>
          <div className="filter-column-content">
            {content[0]}
          </div>
        </div>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Risk Factors</span>
          </div>
          <div className="filter-column-content">
            {content[1]}
          </div>
        </div>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Interventions</span>
          </div>
          <div className="filter-column-content">
            {content[2]}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterPathway.propTypes = {
  windowSize: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  pathwayOpen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  openPathway: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  selected: state.selectedORFI,
  pathwayOpen: state.pathwayOpen,
  data: state.networkData.data
});

const mapDispatchToProps = dispatch => ({
  toggleFilters: (val, group) => {
    dispatch(setFilters({ val, group, type: 'toggle' }));
  },
  openPathway: () => {
    dispatch(setPathwayOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPathway);
