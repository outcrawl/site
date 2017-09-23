import React from 'react';

export default element => element.props.children.map((obj, i) => {
  if (obj instanceof Object && obj.hasOwnProperty('key') && obj.key === null) {
    return React.cloneElement(obj, {
      key: i
    });
  }
  return obj;
});
