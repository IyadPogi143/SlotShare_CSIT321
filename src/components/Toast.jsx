import React, { useState, useEffect } from 'react';

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return <div className="toast">{message}</div>;
}

export default Toast;