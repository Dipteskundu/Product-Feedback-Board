import { RouterProvider } from 'react-router-dom';
import QueryProvider from './app/providers/QueryProvider';
import { AuthProvider } from './features/auth/hooks/useAuth';
import ActorProvider from './app/providers/ActorProvider';
import { ToastProvider } from './shared/components/Toast';
import { ThemeProvider } from './app/providers/ThemeProvider';
import router from './app/routes';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ActorProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </ActorProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
