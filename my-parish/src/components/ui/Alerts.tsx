import React, { useState, useEffect, createContext, useContext } from 'react';
import { XCircle, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

type AlertType = 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const getAlertStyles = (type: AlertType) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 border-green-500 text-green-700';
    case 'warning':
      return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    case 'error':
      return 'bg-red-100 border-red-500 text-red-700';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-700';
  }
};

// Context for managing global alerts
type AlertContextType = {
  showSuccess: (message: string, autoCloseTime?: number) => void;
  showWarning: (message: string, autoCloseTime?: number) => void;
  showError: (message: string, autoCloseTime?: number) => void;
  showConfirmation: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  hideAlert: () => void;
  hideConfirmation: () => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

type AlertProviderProps = {
  children: React.ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [confirmHandler, setConfirmHandler] = useState<(() => void) | null>(null);
  const [cancelHandler, setCancelHandler] = useState<(() => void) | null>(null);
  const [autoCloseTime, setAutoCloseTime] = useState<number>(7000);

  const showSuccess = (message: string, closeTime?: number) => {
    hideAlert();
    setSuccessMessage(message);
    setAutoCloseTime(closeTime || 7000);
  };

  const showWarning = (message: string, closeTime?: number) => {
    hideAlert();
    setWarningMessage(message);
    setAutoCloseTime(closeTime || 7000);
  };

  const showError = (message: string, closeTime?: number) => {
    hideAlert();
    setErrorMessage(message);
    setAutoCloseTime(closeTime || 0); // Default to no auto-close for errors
  };

  const showConfirmation = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    hideAlert();
    setConfirmationMessage(message);
    setConfirmHandler(() => onConfirm);
    setCancelHandler(() => onCancel || hideConfirmation);
  };

  const hideAlert = () => {
    setSuccessMessage(null);
    setWarningMessage(null);
    setErrorMessage(null);
  };

  const hideConfirmation = () => {
    setConfirmationMessage(null);
    setConfirmHandler(null);
    setCancelHandler(null);
  };

  return (
    <AlertContext.Provider
      value={{
        showSuccess,
        showWarning,
        showError,
        showConfirmation,
        hideAlert,
        hideConfirmation,
      }}
    >
      {children}
      
      {/* Fixed position container for alerts */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[85%] sm:max-w-md">
        {successMessage && (
          <Alert 
            type="success" 
            message={successMessage} 
            onClose={hideAlert} 
            autoClose={true} 
            autoCloseTime={autoCloseTime} 
          />
        )}
        
        {warningMessage && (
          <Alert 
            type="warning" 
            message={warningMessage} 
            onClose={hideAlert} 
            autoClose={true} 
            autoCloseTime={autoCloseTime} 
          />
        )}
        
        {errorMessage && (
          <Alert 
            type="error" 
            message={errorMessage} 
            onClose={hideAlert} 
            autoClose={autoCloseTime > 0} 
            autoCloseTime={autoCloseTime} 
          />
        )}
        
        {confirmationMessage && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 sm:p-6 mb-4 animate-fadeIn w-[90%] sm:w-full mx-auto">
            <div className="text-center">
              <div className="mx-auto w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-amber-100 mb-2 sm:mb-4">
                <AlertTriangle className="text-amber-500" size={16} />
              </div>
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Potwierdzenie</h3>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6">{confirmationMessage}</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    if (cancelHandler) cancelHandler();
                  }}
                  className="w-full sm:w-auto px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs sm:text-base"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => {
                    if (confirmHandler) {
                      confirmHandler();
                      hideConfirmation();
                    }
                  }}
                  className="w-full sm:w-auto px-3 sm:px-5 py-1.5 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-xs sm:text-base"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AlertContext.Provider>
  );
};

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 7000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoClose) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  // Get icon based on alert type
  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex items-center justify-between p-4 mb-4 border-l-4 rounded-md shadow-md ${getAlertStyles(type)}`}>
      <div className="flex items-center flex-1">
        <span className="mr-2">{getAlertIcon()}</span>
        <div>{message}</div>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Zamknij"
      >
        <XCircle size={20} />
      </button>
    </div>
  );
};

// Standalone alert components (for backward compatibility)
export const SuccessAlert: React.FC<Omit<AlertProps, 'type'>> = (props) => (
  <Alert type="success" {...props} />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'type'>> = (props) => (
  <Alert type="warning" {...props} />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'type'>> = (props) => (
  <Alert type="error" {...props} />
);

// Confirmation dialog component
interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-3 sm:p-6 max-w-[85%] sm:max-w-md w-full mx-2 sm:mx-4">
        <div className="text-center">
          <div className="mx-auto w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-amber-100 mb-2 sm:mb-4">
            <AlertTriangle className="text-amber-500" size={16} />
          </div>
          <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Potwierdzenie</h3>
          <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs sm:text-base"
            >
              Anuluj
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-3 sm:px-5 py-1.5 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-xs sm:text-base"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};