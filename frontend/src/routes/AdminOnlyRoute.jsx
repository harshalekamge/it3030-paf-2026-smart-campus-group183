import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function AdminOnlyRoute({ children }) {
  const location = useLocation()
  const { isAdmin, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          User management is available to administrators only.
        </Alert>
        <Typography color="text.secondary">
          Your account does not have permission to access this section.
        </Typography>
      </Container>
    )
  }

  return children
}

export default AdminOnlyRoute
