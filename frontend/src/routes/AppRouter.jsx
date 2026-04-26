import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import CrudDashboard from '../pages/crud-dashboard/CrudDashboard'
import AmenityCreate from '../pages/crud-dashboard/components/AmenityCreate'
import AmenityEdit from '../pages/crud-dashboard/components/AmenityEdit'
import AmenityList from '../pages/crud-dashboard/components/AmenityList'
import AmenityShow from '../pages/crud-dashboard/components/AmenityShow'
import AvailabilityWindowCreate from '../pages/crud-dashboard/components/AvailabilityWindowCreate'
import AvailabilityWindowEdit from '../pages/crud-dashboard/components/AvailabilityWindowEdit'
import AvailabilityWindowList from '../pages/crud-dashboard/components/AvailabilityWindowList'
import AvailabilityWindowShow from '../pages/crud-dashboard/components/AvailabilityWindowShow'
import EmployeeCreate from '../pages/crud-dashboard/components/EmployeeCreate'
import EmployeeEdit from '../pages/crud-dashboard/components/EmployeeEdit'
import EmployeeList from '../pages/crud-dashboard/components/EmployeeList'
import EmployeeShow from '../pages/crud-dashboard/components/EmployeeShow'
import MarketingPage from '../pages/marketing-page/MarketingPage'
import ResourceTypeCreate from '../pages/crud-dashboard/components/ResourceTypeCreate'
import ResourceTypeEdit from '../pages/crud-dashboard/components/ResourceTypeEdit'
import ResourceTypeList from '../pages/crud-dashboard/components/ResourceTypeList'
import ResourceTypeShow from '../pages/crud-dashboard/components/ResourceTypeShow'
import ResourceMediaCreate from '../pages/crud-dashboard/components/ResourceMediaCreate'
import ResourceMediaEdit from '../pages/crud-dashboard/components/ResourceMediaEdit'
import ResourceMediaList from '../pages/crud-dashboard/components/ResourceMediaList'
import ResourceMediaShow from '../pages/crud-dashboard/components/ResourceMediaShow'
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
            <Route path="resource-media" element={<ResourceMediaList />} />
            <Route path="resource-media/new" element={<ResourceMediaCreate />} />
            <Route path="resource-media/:resourceMediaId" element={<ResourceMediaShow />} />
            <Route
              path="resource-media/:resourceMediaId/edit"
              element={<ResourceMediaEdit />}
            />
            <Route path="availability-windows" element={<AvailabilityWindowList />} />
            <Route path="availability-windows/new" element={<AvailabilityWindowCreate />} />
            <Route
              path="availability-windows/:availabilityWindowId"
              element={<AvailabilityWindowShow />}
            />
            <Route
              path="availability-windows/:availabilityWindowId/edit"
              element={<AvailabilityWindowEdit />}
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
