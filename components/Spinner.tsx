import React from 'react';

const Spinner = ({ size = 24 }: { size?: number }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    spinner: {
      border: `4px solid var(--border-color)`,
      borderTop: `4px solid var(--primary-color)`,
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      animation: 'spin 1s linear infinite',
    },
  };
  
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.spinner} aria-label="Wird geladen"></div>
    </>
  );
};

export default Spinner;
