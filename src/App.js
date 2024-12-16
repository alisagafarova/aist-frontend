// External libraries
import { Route, Routes, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';

// Global components
import { Header, Footer } from './components';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { FinishPage } from './pages/FinishPage';
import { Introduction } from './pages/Introduction';

// Course pages
import { Terminal } from './pages/Terminal';
import { InterfaceConfiguration } from './pages/course/InterfaceConfig';
import { TaskInterfaceConfig } from './pages/course/InterfaceConfig/TaskInterfaceConfig';
import { StaticRoute } from './pages/course/StaticRoute';
import { StaticRouteConfig } from './pages/course/StaticRoute/StaticRouteConfig';
import { NetworkBasicSetup } from './pages/course/NetworkBasicSetup';
import { NetworkBasicConfig } from './pages/course/NetworkBasicSetup/NetworkBasicConfig';

// Utilities
import { useSaveLastVisitedPath } from './utils/useSaveLastVisitedPath';

function App() {
  useSaveLastVisitedPath();

  return (
    <>
      <Header />
      <Container maxWidth="false" style={{ padding: '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/terminal/"
            element={
              <ProtectedRoute>
                <Terminal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intro/"
            element={
              <ProtectedRoute>
                <Introduction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interface-config/"
            element={
              <ProtectedRoute>
                <InterfaceConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/static-route/"
            element={
              <ProtectedRoute requiredTask="interface-config">
                <StaticRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interface-config/task1/"
            element={
              <ProtectedRoute>
                <TaskInterfaceConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/static-route/task2/"
            element={
              <ProtectedRoute requiredTask="interface-config">
                <StaticRouteConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network-config/"
            element={
              <ProtectedRoute requiredTask="static-route">
                <NetworkBasicSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network-config/task3/"
            element={
              <ProtectedRoute requiredTask="static-route">
                <NetworkBasicConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finish/"
            element={
              <ProtectedRoute>
                <FinishPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/forgot-password/" element={<ForgotPassword />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
