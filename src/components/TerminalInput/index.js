import React from 'react';
import styles from './TerminalInput.module.scss';

const TerminalInput = ({ promptPrefix, input, onChange, onKeyDown, onSubmit, inputRef }) => {
  return (
    <form onSubmit={onSubmit} className={styles.terminal_input}>
      <span className={styles.prompt_prefix}>{promptPrefix} </span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={styles.input}
        autoFocus
      />
    </form>
  );
};

export default TerminalInput;
