import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../data/assetsApi'
import useNotifications from '../hooks/useNotifications/useNotifications'
import PageContainer from './PageContainer'
import UserForm from './UserForm'

const INITIAL_FORM_VALUES = {
  email: '',
  firstName: '',
  fullName: '',
  googleId: '',
  isActive: true,
  lastName: '',
  profilePictureUrl: '',
  provider: 'GOOGLE',
  role: 'STUDENT',
}

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

export default function UserCreate() {
  const navigate = useNavigate()
  const notifications = useNotifications()

  const [formState, setFormState] = React.useState({
    values: INITIAL_FORM_VALUES,
    errors: {},
  })

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
        const user = await createUser(values)
        notifications.show('User account created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        navigate(`/dashboard/users/${user.id}`)
      } catch (createError) {
        notifications.show(`Failed to create user. Reason: ${createError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
        throw createError
      }
    },
    [navigate, notifications],
  )

  return (
    <PageContainer
      title="New User"
      breadcrumbs={[
        { title: 'User Management', path: '/dashboard/users' },
        { title: 'New' },
      ]}
    >
      <UserForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  )
}
