import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (id: string, name: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  loginWithCredentials: async () => false,
  logout: () => {},
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化時檢查本地存儲
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 保留原有的 login 方法
  const login = (id: string, name: string) => {
    const newUser = { id, name };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // 新增帶密碼驗證的登入方法
  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 這裡可以接入真實的 API
      const response = await mockAuthAPI(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithCredentials, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API（之後可以替換成真實 API）
const mockAuthAPI = async (email: string, password: string) => {
  return new Promise<{ success: boolean; user?: User }>((resolve) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve({
          success: true,
          user: { 
            id: '1', 
            name: 'Test User', 
            email: 'test@example.com',
            role: 'user'
          }
        });
      } else {
        resolve({ success: false });
      }
    }, 1000);
  });
};