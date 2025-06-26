import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomPrompt, { PromptOptions } from './CustomPrompt';

interface PromptContextType {
  showPrompt: (options: PromptOptions) => Promise<string | null>;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showInput: (title: string, message: string, placeholder?: string) => Promise<string | null>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};

interface PromptManagerProps {
  children: React.ReactNode;
}

export const PromptManager: React.FC<PromptManagerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PromptOptions>({
    title: '',
    message: '',
  });
  const [resolvePromise, setResolvePromise] = useState<((value: any) => void) | null>(null);

  const showPrompt = useCallback((promptOptions: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setOptions(promptOptions);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const showConfirm = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        message,
        type: 'confirm',
        confirmText: 'Yes',
        cancelText: 'No',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
      setIsOpen(true);
    });
  }, []);

  const showInput = useCallback((title: string, message: string, placeholder?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        message,
        type: 'info',
        confirmText: 'Submit',
        cancelText: 'Cancel',
        showInput: true,
        inputPlaceholder: placeholder,
        inputRequired: true,
        onConfirm: (inputValue) => resolve(inputValue || null),
        onCancel: () => resolve(null),
      });
      setIsOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(null);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleConfirm = useCallback((inputValue?: string) => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(inputValue || null);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(null);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const contextValue: PromptContextType = {
    showPrompt,
    showConfirm,
    showInput,
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
      <CustomPrompt
        isOpen={isOpen}
        options={{
          ...options,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        }}
        onClose={handleClose}
      />
    </PromptContext.Provider>
  );
};

export default PromptManager; 