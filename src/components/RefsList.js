import React from 'react';
import PropTypes from 'prop-types';

const RefsList = ({
  refsData, indices
}) => {
  const a = 'references';

  return (
    <div>{a}</div>
  );
};

RefsList.propTypes = {
  data: PropTypes.object.isRequired,
  indices: PropTypes.array.isRequired
};

export default RefsList;
