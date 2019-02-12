import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FilterPathwaySelect from './FilterPathwaySelect';
import { setFilters, setPathwayOpen, setSelectedORFI } from '../actions';
import { ui } from '../constants';

const FilterPathway = ({
  windowSize, selected, pathwayOpen, data, openPathway, removePathway
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
  const lookup = {};
  keys.forEach((ky) => { lookup[ky] = data.nodes[ky].data.map(d => d.id); });

  const content = keys.map((ky, i) => {
    const ids = selected[ky];
    if (ids.length > 0) {
      return ids.map((id) => {
        const idx = lookup[ky].indexOf(id);
        return (
          <Chip
            key={id}
            className="pathway-chip"
            label={data.nodes[ky].data[idx].name}
            onDelete={() => removePathway(
              data.nodes[ky].data[idx].id, data.nodes[ky].data[idx].class)}
          />
        );
      });
    }
    return (
      <div className="pathway-empty-text">
        Examples:
        <br />
        {emptyText[i]}
      </div>
    );
  });

  const cls = ['ho', 'rf', 'int'];
  const items = [];
  cls.forEach(d => data.nodes[d].data.forEach(a => items.push({
    id: a.id, name: a.name, type: data.nodes[d].name, class: a.class
  })));

  return (
    <div className="pathway-container" style={{ width: windowSize.appWidth, marginTop: ui.header.height - 4, left: windowSize.appLeft }}>
      <div className="pathway-header">
        <Button className="header-filter-button" onClick={openPathway}>
          <span className="icon-chevron-left header-filter-icon" />
          Back
        </Button>
        <FilterPathwaySelect items={items} />
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
  openPathway: PropTypes.func.isRequired,
  removePathway: PropTypes.func.isRequired
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
  },
  removePathway: (val, group) => {
    dispatch(setSelectedORFI({ val, group, type: 'remove' }));
  }

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPathway);
