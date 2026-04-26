import * as React from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, updateUser } from '../data/assetsApi'
import useNotifications from '../hooks/useNotifications/useNotifications'
import PageContainer from './PageContainer'
import UserForm from './UserForm'

function validateUser(values) {
  const errors = {}

  if (!values.email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.role) {
    errors.role = 'Role is required.'
  }

  if (!values.provider?.trim()) {
    errors.provider = 'Provider is required.'
  }

  return errors
}

export default function UserEdit() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()

  const [formState, setFormState] = React.useState({
    values: null,
    errors: {},
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const user = await getUser(userId)
      setFormState({
        values: {
          email: user.email ?? '',
          firstName: user.firstName ?? '',
          fullName: user.fullName ?? '',
          googleId: user.googleId ?? '',
          isActive: user.isActive ?? true,
          lastName: user.lastName ?? '',
          profilePictureUrl: user.profilePictureUrl ?? '',
          provider: user.provider ?? 'GOOGLE',
          role: user.role ?? 'STUDENT',
        },
        errors: {},
      })
    } catch (loadError) {
      setError(loadError)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleFieldChange = React.useCallback((name, value) => {
    setFormState((previousValue) => {
      const values = { ...previousValue.values, [name]: value }
      return {
        values,
        errors: {
          ...previousValue.errors,
          [name]: validateUser(values)[name],
        },
      }
    })
  }, [])

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateUser(values)
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }))
        return
      }

      try {
        await updateUser(userId, values)
        notifications.show('User account updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        navigate(`/dashboard/users/${userId}`)
      } catch (updateError) {
        notifications.show(`Failed to update user. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
        throw updateError
      }
    },
    [navigate, notifications, userId],
  )

  return (
    <PageContainer
      title={`Edit User ${userId}`}
      breadcrumbs={[
        { title: 'User Management', path: '/dashboard/users' },
        { title: `User ${userId}`, path: `/dashboard/users/${userId}` },
        { title: 'Edit' },
      ]}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <UserForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/users/${userId}`}
        />
      )}
    </PageContainer>
  )
}
