import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import CrudDashboard from '../pages/crud-dashboard/CrudDashboard'
import EmployeeCreate from '../pages/crud-dashboard/components/EmployeeCreate'
import EmployeeEdit from '../pages/crud-dashboard/components/EmployeeEdit'
import EmployeeList from '../pages/crud-dashboard/components/EmployeeList'
import EmployeeShow from '../pages/crud-dashboard/components/EmployeeShow'
import MarketingPage from '../pages/marketing-page/MarketingPage'
import SignInSide from '../pages/sign-in-side/SignInSide'
import SignUp from '../pages/sign-up/SignUp'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route
            path="/signin"
            element={
              <PublicOnlyRoute>
                <SignInSide />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignUp />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CrudDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeCreate />} />
            <Route path="employees/:employeeId" element={<EmployeeShow />} />
            <Route path="employees/:employeeId/edit" element={<EmployeeEdit />} />
            <Route path="reports" element={<EmployeeList />} />
            <Route path="reports/sales" element={<EmployeeList />} />
            <Route path="reports/traffic" element={<EmployeeList />} />
            <Route path="integrations" element={<EmployeeList />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRouter
