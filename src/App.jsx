import { RouterProvider } from 'react-router-dom';
import QueryProvider from './app/providers/QueryProvider';
import ActorProvider from './app/providers/ActorProvider';
import router from './app/routes';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <ActorProvider>
        <RouterProvider router={router} />
      </ActorProvider>
    </QueryProvider>
  );
}

export default App;
