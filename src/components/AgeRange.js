import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { setAgeRange, setAgeRangeOpen } from '../actions';
import { ui } from '../constants';

const AgeRange = ({
  windowSize, ageRange, ageRangeOpen, closeAgeRange
}) => {
  const [age0, setAge0] = useState({ val: ageRange[0], units: 'Weeks' });
  const [age1, setAge1] = useState({ val: ageRange[1], units: 'Weeks' });
  const [ageOrigin, setAgeOrigin] = useState('Conception');

  if (ageRangeOpen === false) {
    return '';
  }

  const updateAgeInputs = (event, which) => {
    if (which === 0) {
      setAge0({ val: event.target.value, units: age0.units });
    } else {
      setAge1({ val: event.target.value, units: age1.units });
    }
  };

  const updateAgeUnits = (event, which) => {
    if (which === 0) {
      setAge0({ val: age0.val, units: event.target.value });
    } else {
      setAge1({ val: age1.val, units: event.target.value });
    }
  };

  const updateAgeOrigin = (event) => {
    setAgeOrigin(event.target.value === 'Conception' ? 'Conception' : 'Birth');
  };

  return (
    <ClickAwayListener onClickAway={closeAgeRange}>
      <div className="agerange-container" style={{ width: 240, marginTop: ui.header.height, right: 272 + windowSize.appLeft }}>
        <div className="agerange-row">
          <TextField
            // label="Number"
            value={age0.val}
            onChange={(event) => { updateAgeInputs(event, 0); }}
            // type="number"
            className="age-num-input"
            margin="normal"
            variant="outlined"
          />
          <FormControl variant="outlined">
            <Select
              className="age-units-input"
              value={age0.units}
              onChange={(event) => { updateAgeUnits(event, 0); }}
              input={(
                <OutlinedInput
                  labelWidth={0}
                  name="units0"
                  id="outlined-units0"
                />
              )}
            >
              <MenuItem value="WeeksGA">Weeks GA</MenuItem>
              <MenuItem value="Weeks">Weeks</MenuItem>
              <MenuItem value="Months">Months</MenuItem>
              <MenuItem value="Years">Years</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="agerange-row-divider">
            to
        </div>
        <div className="agerange-row">
          <TextField
            // label="Number"
            value={age1.val}
            onChange={(event) => { updateAgeInputs(event, 1); }}
            // type="number"
            className="age-num-input"
            margin="normal"
            variant="outlined"
          />
          <FormControl variant="outlined">
            <Select
              className="age-units-input"
              value={age1.units}
              onChange={(event) => { updateAgeUnits(event, 0); }}
              input={(
                <OutlinedInput
                  labelWidth={0}
                  name="units1"
                  id="outlined-units1"
                />
              )}
            >
              <MenuItem value="WeeksGA">Weeks GA</MenuItem>
              <MenuItem value="Weeks">Weeks</MenuItem>
              <MenuItem value="Months">Months</MenuItem>
              <MenuItem value="Years">Years</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="agerange-row">
          <FormControl component="fieldset">
            <FormLabel component="legend" className="age-units-legend">Measure age from</FormLabel>
            <RadioGroup
              aria-label="BirthOrigin"
              name="birthorigin"
              // className={classes.group}
              value={ageOrigin}
              onChange={updateAgeOrigin}
            >
              <FormControlLabel
                className="age-radio-label"
                value="Conception"
                control={<Radio className={`age-radio ${ageOrigin === 'Conception' ? 'age-radio-checked' : ''}`} />}
                label="Conception"
              />
              <FormControlLabel
                className="age-radio-label"
                value="Birth"
                control={<Radio className={`age-radio ${ageOrigin === 'Birth' ? 'age-radio-checked' : ''}`} />}
                label="Birth"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </ClickAwayListener>
  );
};

AgeRange.propTypes = {
  windowSize: PropTypes.object.isRequired,
  ageRange: PropTypes.array.isRequired,
  ageRangeOpen: PropTypes.bool.isRequired,
  // updateAgeRange: PropTypes.func.isRequired,
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
