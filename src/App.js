import React from 'react';
import Header from './components/Header';
import Body from './components/Body';
import FilterVariable from './components/FilterVariable';
import ReviewReferences from './components/ReviewReferences';
// import AgeRange from './components/AgeRange';

const App = () => (
  <div className="root">
    <Header />
    <Body />
    <FilterVariable />
    {/* <AgeRange /> */}
    <ReviewReferences />
  </div>
);

export default App;
