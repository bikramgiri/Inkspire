import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { setToastAdder, clearToastAdder } from '../../../utils/toast'; 

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const adder = (message, type = 'info') => {
      const id = Math.random().toString(36).substring(7);
      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    setToastAdder(adder);

    return () => {
      clearToastAdder();
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="size-5" />;
      case 'error':
        return <AlertCircle className="size-5" />;
      default:
        return <Info className="size-5" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-600';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-600';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-600';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md ${getColorClasses(toast.type)} animate-slide-in-right pointer-events-auto`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Close toast"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
