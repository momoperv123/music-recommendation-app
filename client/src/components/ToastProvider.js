import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({ notifyError: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const remove = useCallback((id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const notifyError = useCallback((text) => {
    const id = Math.random().toString(36).slice(2);
    setMessages((prev) => [...prev, { id, text }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ notifyError }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {messages.map((m) => (
          <div key={m.id} className="bg-red-600 text-white px-4 py-2 rounded shadow">
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


