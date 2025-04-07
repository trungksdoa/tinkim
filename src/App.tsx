import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LoadingProvider } from './contexts/LoadingContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './app/login/page'
import Employees from './app/employees/page'
import EmployeeCreate from './app/employees/create/page'
import EmployeeDetail from './app/employees/[id]/page'

function getCookie(name:any) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isAuthenticated = getCookie("authToken");
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <LoadingProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/create" element={<EmployeeCreate />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
        </Route>
      </Routes>
    </LoadingProvider>
  )
}

export default App