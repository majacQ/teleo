import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { setAgeRange, setAgeRangeOpen } from '../actions';
import { ui } from '../constants';

const ranges = [
  {
    id: 0, label: (<em>(custom age range)</em>), start: -1, end: -1
  },
  {
    id: 1, label: 'First Trimester', start: 0.1 / 7, end: 84 / 7
  },
  {
    id: 2, label: 'Second Trimester', start: 84 / 7, end: 168 / 7
  },
  {
    id: 3, label: 'Third Trimester', start: 168 / 7, end: 280 / 7
  },
  {
    id: 4, label: 'Pregnancy (all trimesters)', start: 0.1 / 7, end: 280 / 7
  },
  {
    id: 5, label: 'Neonatal (0 to 1 month)', start: 279.9 / 7, end: 308 / 7
  },
  {
    id: 6, label: 'Early infancy (0 to 6 months)', start: 279.9 / 7, end: 460 / 7
  },
  {
    id: 7, label: 'First year of life', start: 279.9 / 7, end: 645 / 7
  },
  {
    id: 8, label: 'First two years of life', start: 279.9 / 7, end: 1010 / 7
  },
  {
    id: 9, label: 'First five years of life', start: 279.9 / 7, end: 2105 / 7
  },
  {
    id: 10, label: 'Late childhood (5 years to 13 years)', start: 2105 / 7, end: 5025 / 7
  },
  {
    id: 11, label: 'Birth to age 13 years', start: 279.9 / 7, end: 5025 / 7
  }
];

const AgeRange = ({
  windowSize, ageRange, ageRangeOpen, updateAgeRange, closeAgeRange
}) => {
  const getCurVal = () => {
    let curVal = 0;
    const curStart = Math.round(ageRange[0] * 7 * 10) / 10;
    const curEnd = Math.round(ageRange[1] * 7 * 10) / 10;
    for (let i = 0; i < ranges.length; i += 1) {
      const start = Math.round(ranges[i].start * 7 * 10) / 10;
      const end = Math.round(ranges[i].end * 7 * 10) / 10;
      if (curStart === start && curEnd === end) {
        curVal = ranges[i].id;
        break;
      }
    }
    return curVal;
  };
  const curVal = getCurVal();

  const [selectedRange, setSelectedRange] = useState(curVal);

  useEffect(() => setSelectedRange(getCurVal()), [ageRange]);

  if (ageRangeOpen === false) {
    return '';
  }

  const onAgeRangeChange = (id) => {
    setSelectedRange(id);
    if (id !== 0) {
      updateAgeRange([ranges[id].start, ranges[id].end]);
    }
    closeAgeRange();
  };

  return (
    <Dialog open={ageRangeOpen} onClose={closeAgeRange}>
      <div className="agerange-container" style={{ width: 312, marginTop: ui.header.height + 36, right: 220 + windowSize.appLeft }}>
        <div className="agerange-header">
          Notable Age Ranges
        </div>
        <div className="agerange-text">
          Select below from a list of pre-defined age ranges
          or drag the age slider for a custom age range.
        </div>
        <div>
          <FormControl variant="outlined">
            <Select
              className="agerange-select"
              value={selectedRange}
              onChange={(event) => { onAgeRangeChange(event.target.value); }}
              input={(
                <OutlinedInput
                  labelWidth={0}
                  name="agerange"
                  id="outlined-agerange"
                />
              )}
            >
              {
                ranges.map(d => (
                  <MenuItem value={d.id} key={d.id} disabled={d.id === 0}>{d.label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
      </div>
    </Dialog>
  );
};

AgeRange.propTypes = {
  windowSize: PropTypes.object.isRequired,
  ageRange: PropTypes.array.isRequired,
  ageRangeOpen: PropTypes.bool.isRequired,
  updateAgeRange: PropTypes.func.isRequired,
  closeAgeRange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  ageRange: state.ageRange,
  ageRangeOpen: state.ageRangeOpen
});

const mapDispatchToProps = dispatch => ({
  updateAgeRange: (val) => {
    dispatch(setAgeRange(val));
  },
  closeAgeRange: () => {
    dispatch(setAgeRangeOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgeRange);
