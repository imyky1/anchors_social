import React from 'react';

const Loader = ({ percentage }) => {
  return <div style={{color:'white'}}>Loading... {percentage}%</div>;
};

export default Loader;
