import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

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

const ContactCorrection = () => {
  const [selectedCat, setSelectedCat] = useState('ogm');
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [expln, setExpln] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const sendMail = () => {
    const subject = 'ELEnOR: Correction request';
    const ids = catItems.map((ee) => ee.id);
    const catName = catItems[ids.indexOf(selectedCat)].name;
    const body = `From: ${name}%0D%0A%0D%0AEmail: ${email}%0D%0A%0D%0AArea: ${encodeURIComponent(catName)}%0D%0A%0D%0ACategory: ${encodeURIComponent(selectedSubcat)}%0D%0A%0D%0ADetails:${encodeURIComponent(expln)}`;
    const mail = document.createElement('a');
    mail.href = `mailto:info@kiglobalhealth.org?subject=${subject}&body=${body}`;
    mail.click();
  };

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
          value={expln}
          onChange={(event) => setExpln(event.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Explain the innaccuracy in enough detail so we can locate it and conduct research to validate the update."
        />
      </FormControl>
      <div className="contact-detail-spacer" />
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
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </FormControl>
      <div className="contact-detail-spacer" />
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <div className="contact-detail-label">
        We&apos;ll reach out to you if we have any questions,
        or to keep you updated on this inquiry.
      </div>
      <div className="contact-detail-spacer" />
      <Button
        classes={{ label: 'contact-button-label', root: 'contact-button-root' }}
        disabled={
          selectedSubcat === '' || expln.length === 0 || name.length === 0 || email.length === 0
        }
        onClick={sendMail}
      >
        Send
      </Button>
      <div className="contact-detail-spacer2" />
    </div>
  );
};

export default ContactCorrection;
