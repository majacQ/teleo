import React from 'react';
import Header from './components/Header';
import Body from './components/Body';
import FilterVariable from './components/FilterVariable';
import AgeRange from './components/AgeRange';
import ReviewReferences from './components/ReviewReferences';
import LinkDialog from './components/LinkDialog';

const App = () => (
  <div className="root">
    <Header />
    <Body />
    <FilterVariable />
    <AgeRange />
    <ReviewReferences />
    <LinkDialog />
  </div>
);

export default App;
