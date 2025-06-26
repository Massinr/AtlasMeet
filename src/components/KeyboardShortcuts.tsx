import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onShowAccounts: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onShowAccounts }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+H to show accounts popup
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        onShowAccounts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShowAccounts]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts; 