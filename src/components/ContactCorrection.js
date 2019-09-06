import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const catItems = [
  {
    id: 'ogm',
    name: 'Organogenesis, Growth, & Maturation'
  },
  {
    id: 'nd',
    name: 'Neurodevelopment'
  },
  {
    id: 'orfi',
    name: 'Outcomes, Risk Factors, & Interventions'
  }
];

const subcatItems = {
  ogm: [
    'Blood/Immune',
    'CNS',
    'Cardiovascular',
    'Endocrine',
    'Gastrointestinal',
    'Genitourinary',
    'Integument',
    'Musculoskeletal',
    'PNS',
    'Respiratory'
  ],
  nd: [
    'Cognitive',
    'Emotional',
    'Language',
    'Motor'
  ],
  orfi: [
    'Health Outcome',
    'Intervention',
    'Pathogenesis',
    'Risk Factor'
  ]
};

const ContactCorrection = ({
  timelineData, networkData
}) => {
  const [selectedCat, setSelectedCat] = useState('ogm');
  const [selectedSubcat, setSelectedSubcat] = useState('');

  if (timelineData.ogm === undefined) {
    return '';
  }

  return (
    <div className="contact-correction">
      <div className="contact-detail-header">
        Correction Request
      </div>
      <div className="contact-detail-label">
        What area does the error occur in?
      </div>
      <FormControl variant="outlined" classes={{ root: 'contact-detail-select-outline' }}>
        <Select
          // variant="outlined"
          value={selectedCat}
          onChange={(event) => {
            setSelectedSubcat('');
            setSelectedCat(event.target.value);
          }}
          classes={{ root: 'contact-detail-select' }}
          // labelWidth={labelWidth}
          inputProps={{
            name: 'cat',
            id: 'outlined-cat-simple'
          }}
        >
          {
            catItems.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <div className="contact-detail-label">
        And, what category of the above section does the error occur in?
      </div>
      <FormControl variant="outlined" classes={{ root: 'contact-detail-select-outline' }}>
        <Select
          value={selectedSubcat}
          onChange={(event) => setSelectedSubcat(event.target.value)}
          classes={{ root: 'contact-detail-select' }}
          // labelWidth={labelWidth}
          inputProps={{
            name: 'cat',
            id: 'outlined-cat-simple'
          }}
        >
          {
            subcatItems[selectedCat].map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <div />
      <FormControl>
        <TextField
          multiline
          rows="6"
          InputProps={{
            classes: {
              root: 'contact-detail-textfield-root',
              input: 'contact-detail-textfield-text',
              notchedOutline: 'contact-detail-textfield'
            }
          }}
          margin="normal"
          variant="outlined"
          placeholder="Explain the innaccuracy in enough detail so we can locate it and conduct research to validate the update."
        />
      </FormControl>
      <div />
      <FormControl>
        <TextField
          // label="Name"
          placeholder="Name"
          margin="dense"
          variant="outlined"
          InputProps={{
            classes: {
              root: 'contact-detail-textfield-root2',
              input: 'contact-detail-textfield-text',
              notchedOutline: 'contact-detail-textfield'
            }
          }}
        />
      </FormControl>
      <div />
      <FormControl>
        <TextField
          // label="Email"
          placeholder="Email"
          type="email"
          margin="dense"
          variant="outlined"
          InputProps={{
            classes: {
              root: 'contact-detail-textfield-root2',
              input: 'contact-detail-textfield-text',
              notchedOutline: 'contact-detail-textfield'
            }
          }}
        />
      </FormControl>
    </div>
  );
};

ContactCorrection.propTypes = {
  timelineData: PropTypes.object.isRequired,
  networkData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  timelineData: state.timelineData.data,
  networkData: state.networkData.data
});

export default connect(
  mapStateToProps,
)(ContactCorrection);
