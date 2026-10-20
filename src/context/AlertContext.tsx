import React, { createContext, useContext, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlertDialog, AlertConfig, AlertType } from '../components/CustomAlertDialog';

export interface ShowAlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface ShowConfirmOptions {
  title: string;
  message: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (options: ShowAlertOptions) => void;
  showConfirm: (options: ShowConfirmOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = useCallback((options: ShowAlertOptions) => {
    setAlertConfig({
      visible: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      icon: options.icon,
      confirmText: options.confirmText || 'Mengerti',
      onConfirm: options.onConfirm,
    });
  }, []);

  const showConfirm = useCallback((options: ShowConfirmOptions) => {
    setAlertConfig({
      visible: true,
      title: options.title,
      message: options.message,
      type: options.type || 'danger',
      icon: options.icon,
      confirmText: options.confirmText || 'Hapus',
      cancelText: options.cancelText || 'Batal',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
      {children}
      <CustomAlertDialog config={alertConfig} onClose={hideAlert} />
    </AlertContext.Provider>
  );
};

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
