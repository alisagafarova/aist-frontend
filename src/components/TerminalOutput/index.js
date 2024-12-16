import React, { useRef, useEffect } from 'react';
import styles from './TerminalOutput.module.scss';

const TerminalOutput = ({ output }) => {
  return (
    <div className={styles.output}>
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default TerminalOutput;
