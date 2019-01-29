import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFilters, setFilterOpen } from '../actions';
import { ui } from '../constants';

const FilterVariable = ({
  windowSize, filters, filterOpen, data, setFilters, closeFilter
}) => {

  if (filterOpen === false || data.ogm === undefined) {
    return '';
  }

  const colWidth = 250;
  // style={{ width: colWidth }}

  return (
    <div className="filters-container" style={{ width: windowSize.appWidth, top: ui.header.height }}>
      <div className="filter-column">
        <div className="filter-column-header">
          <span>Organogenesis, Growth, & Maturation</span>
        </div>
        <div className="filter-column-content">
          { Object.keys(data.ogm.data).map(d => (
            <div
              className="filter-button"
              onClick={() => {}}
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
        <div className="filter-column-content" />
      </div>
      <div className="filter-column">
        <div className="filter-column-header">
          <span>Outcomes, Risk Factors, & Interventions</span>
        </div>
        <div className="filter-column-content" />
      </div>
    </div>
  );
};

FilterVariable.propTypes = {
  windowSize: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  closeFilter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  filters: state.filters,
  filterOpen: state.filterOpen,
  data: state.timelineData.data
});

const mapDispatchToProps = dispatch => ({
  setFilters: (dat) => {
    dispatch(setFilters(dat));
  },
  closeFilter: () => {
    dispatch(setFilterOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterVariable);
