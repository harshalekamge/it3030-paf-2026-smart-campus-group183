import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import CrudDashboard from '../pages/crud-dashboard/CrudDashboard'
import AmenityCreate from '../pages/crud-dashboard/components/AmenityCreate'
import AmenityEdit from '../pages/crud-dashboard/components/AmenityEdit'
import AmenityList from '../pages/crud-dashboard/components/AmenityList'
import AmenityShow from '../pages/crud-dashboard/components/AmenityShow'
import EmployeeCreate from '../pages/crud-dashboard/components/EmployeeCreate'
import EmployeeEdit from '../pages/crud-dashboard/components/EmployeeEdit'
import EmployeeList from '../pages/crud-dashboard/components/EmployeeList'
import EmployeeShow from '../pages/crud-dashboard/components/EmployeeShow'
import MarketingPage from '../pages/marketing-page/MarketingPage'
import ResourceTypeCreate from '../pages/crud-dashboard/components/ResourceTypeCreate'
import ResourceTypeEdit from '../pages/crud-dashboard/components/ResourceTypeEdit'
import ResourceTypeList from '../pages/crud-dashboard/components/ResourceTypeList'
import ResourceTypeShow from '../pages/crud-dashboard/components/ResourceTypeShow'
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
            <Route path="resource-types" element={<ResourceTypeList />} />
            <Route path="resource-types/new" element={<ResourceTypeCreate />} />
            <Route path="resource-types/:resourceTypeId" element={<ResourceTypeShow />} />
            <Route
              path="resource-types/:resourceTypeId/edit"
              element={<ResourceTypeEdit />}
            />
            <Route path="amenities" element={<AmenityList />} />
            <Route path="amenities/new" element={<AmenityCreate />} />
            <Route path="amenities/:amenityId" element={<AmenityShow />} />
            <Route path="amenities/:amenityId/edit" element={<AmenityEdit />} />
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
