import React from 'react';
import { ChipIcon } from './Icons';

const Header = () => {
  return (
    <header style={styles.header}>
      <ChipIcon />
      <h1 style={styles.title}>Hardware Hacker's Almanac</h1>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--foreground-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  title: {
    marginLeft: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'normal',
    color: 'var(--primary-color)',
  },
};

export default Header;