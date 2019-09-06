import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ContactFeedback = () => {
  const [expln, setExpln] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');

  return (
    <div className="contact-correction">
      <div className="contact-detail-header">
        Something isn&apos;t working
      </div>
      <div />
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
      <div className="contact-detail-spacer" />
      <FormControl>
        <TextField
          placeholder="What's the topic of your message?"
          margin="dense"
          variant="outlined"
          InputProps={{
            classes: {
              root: 'contact-detail-textfield-root2',
              input: 'contact-detail-textfield-text',
              notchedOutline: 'contact-detail-textfield'
            }
          }}
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
      </FormControl>
      <div className="contact-detail-spacer" />
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
          placeholder="Briefly explain the problem and the steps we can take to reproduce the problem."
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
          topic.length === 0 || expln.length === 0 || name.length === 0 || email.length === 0
        }
        // onClick={() => {}}
      >
        Send
      </Button>
      <div className="contact-detail-spacer2" />
    </div>
  );
};

export default ContactFeedback;
