import React, { useState, useCallback } from 'react';
import CustomAlert, { AlertProps } from './CustomAlert';
import './AlertManager.css';

export interface AlertData extends Omit<AlertProps, 'id' | 'onClose'> {
  id?: string;
}

interface AlertManagerProps {
  children: React.ReactNode;
}

interface AlertManagerContextType {
  showAlert: (alert: AlertData) => void;
  showSuccess: (title: string, message: string, options?: Partial<AlertData>) => void;
  showError: (title: string, message: string, options?: Partial<AlertData>) => void;
  showWarning: (title: string, message: string, options?: Partial<AlertData>) => void;
  showInfo: (title: string, message: string, options?: Partial<AlertData>) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

export const AlertManagerContext = React.createContext<AlertManagerContextType | undefined>(undefined);

export const useAlertManager = () => {
  const context = React.useContext(AlertManagerContext);
  if (!context) {
    throw new Error('useAlertManager must be used within AlertManagerProvider');
  }
  return context;
};

export const AlertManagerProvider: React.FC<AlertManagerProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showAlert = useCallback((alertData: AlertData) => {
    const id = alertData.id || `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: AlertProps = {
      ...alertData,
      id,
      onClose: removeAlert,
    };
    setAlerts(prev => [...prev, newAlert]);
  }, [removeAlert]);

  const showSuccess = useCallback((title: string, message: string, options: Partial<AlertData> = {}) => {
    showAlert({
      type: 'success',
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, options: Partial<AlertData> = {}) => {
    showAlert({
      type: 'error',
      title,
      message,
      duration: 6000,
      ...options,
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, options: Partial<AlertData> = {}) => {
    showAlert({
      type: 'warning',
      title,
      message,
      duration: 5000,
      ...options,
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, options: Partial<AlertData> = {}) => {
    showAlert({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [showAlert]);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    showAlert({
      type: 'warning',
      title,
      message,
      duration: 0, // Don't auto-close
      showCloseButton: false,
      actions: [
        {
          label: 'Cancel',
          onClick: () => {
            onCancel?.();
            // Remove the alert after a short delay
            setTimeout(() => {
              const alertId = alerts[alerts.length - 1]?.id;
              if (alertId) removeAlert(alertId);
            }, 100);
          },
          variant: 'secondary',
        },
        {
          label: 'Confirm',
          onClick: () => {
            onConfirm();
            // Remove the alert after a short delay
            setTimeout(() => {
              const alertId = alerts[alerts.length - 1]?.id;
              if (alertId) removeAlert(alertId);
            }, 100);
          },
          variant: 'danger',
        },
      ],
    });
  }, [showAlert, alerts, removeAlert]);

  const contextValue: AlertManagerContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };

  return (
    <AlertManagerContext.Provider value={contextValue}>
      {children}
      <div className="alerts-container">
        {alerts.map((alert) => (
          <CustomAlert key={alert.id} {...alert} />
        ))}
      </div>
    </AlertManagerContext.Provider>
  );
}; 