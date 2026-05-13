// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
