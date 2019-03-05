import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
// import Button from '@material-ui/core/Button';
import FilterPathway from './FilterPathway';
import { setFilters, setFilterOpen } from '../actions';
import { ui } from '../constants';

const FilterVariable = ({
  windowSize, filters, filterOpen, data, toggleFilters, closeFilter
}) => {
  if (data.ogm === undefined) {
    return '';
  }

  return (
    <Dialog open={filterOpen} onClose={closeFilter}>
      <div className="filters-container" style={{ width: windowSize.appWidth, marginTop: ui.header.height - 4, left: windowSize.appLeft }}>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Organogenesis, Growth, & Maturation</span>
          </div>
          <div className="filter-column-content">
            { Object.keys(data.ogm.data).map(d => (
              <div
                key={d}
                className={`filter-button ${filters.ogm.indexOf(d) > -1 ? 'selected' : 'unselected'}`}
                onClick={() => { toggleFilters(d, 'ogm'); }}
                onKeyPress={() => {}}
                role="button"
                tabIndex="-10"
              >
                {d}
              </div>
            )) }
          </div>
        </div>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Neurodevelopment</span>
          </div>
          <div className="filter-column-content">
            { Object.keys(data.nd.data).map(d => (
              <div
                key={d}
                className={`filter-button ${filters.nd.indexOf(d) > -1 ? 'selected' : 'unselected'}`}
                onClick={() => { toggleFilters(d, 'nd'); }}
                onKeyPress={() => {}}
                role="button"
                tabIndex="-10"
              >
                {d}
              </div>
            )) }
          </div>
        </div>
        <div className="filter-column">
          <div className="filter-column-header">
            <span>Outcomes, Risk Factors, & Interventions</span>
          </div>
          <div className="filter-column-content">
            <FilterPathway />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

FilterVariable.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  closeFilter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  filters: state.filters,
  filterOpen: state.filterOpen,
  data: state.timelineData.data
});

const mapDispatchToProps = dispatch => ({
  toggleFilters: (val, group) => {
    dispatch(setFilters({ val, group, type: 'toggle' }));
  },
  closeFilter: () => {
    dispatch(setFilterOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterVariable);
