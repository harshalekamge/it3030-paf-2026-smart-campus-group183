import * as React from 'react'
import PropTypes from 'prop-types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'

const ROLE_OPTIONS = ['ADMIN', 'SUPER_ADMIN', 'STAFF', 'LECTURER', 'STUDENT']
const PROVIDER_OPTIONS = ['GOOGLE', 'LOCAL', 'MICROSOFT']

export default function UserForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/users',
}) {
  const formValues = formState.values
  const formErrors = formState.errors

  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(formValues)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formValues, onSubmit],
  )

  const handleTextFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value)
    },
    [onFieldChange],
  )

  const handleSelectFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value)
    },
    [onFieldChange],
  )

  const handleSwitchFieldChange = React.useCallback(
    (event, checked) => {
      onFieldChange(event.target.name, checked)
    },
    [onFieldChange],
  )

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath)
  }, [backButtonPath, navigate])

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            label="Email address"
            type="email"
            value={formValues.email ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.email}
            helperText={formErrors.email ?? ' '}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="googleId"
            label="Google ID"
            value={formValues.googleId ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.googleId}
            helperText={formErrors.googleId ?? 'Optional'}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="firstName"
            label="First name"
            value={formValues.firstName ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="lastName"
            label="Last name"
            value={formValues.lastName ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="fullName"
            label="Full name"
            value={formValues.fullName ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.fullName}
            helperText={formErrors.fullName ?? 'Leave blank to auto-generate from first and last name'}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="profilePictureUrl"
            label="Profile picture URL"
            value={formValues.profilePictureUrl ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.profilePictureUrl}
            helperText={formErrors.profilePictureUrl ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!formErrors.role}>
            <InputLabel id="user-role-label">Role</InputLabel>
            <Select
              labelId="user-role-label"
              name="role"
              label="Role"
              value={formValues.role ?? 'STUDENT'}
              onChange={handleSelectFieldChange}
            >
              {ROLE_OPTIONS.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.role ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!formErrors.provider}>
            <InputLabel id="user-provider-label">Provider</InputLabel>
            <Select
              labelId="user-provider-label"
              name="provider"
              label="Provider"
              value={formValues.provider ?? 'GOOGLE'}
              onChange={handleSelectFieldChange}
            >
              {PROVIDER_OPTIONS.map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.provider ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl error={!!formErrors.isActive}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formValues.isActive ?? true}
                  onChange={handleSwitchFieldChange}
                />
              }
              label="User account is active"
            />
            <FormHelperText>{formErrors.isActive ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  )
}

UserForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      fullName: PropTypes.string,
      googleId: PropTypes.string,
      isActive: PropTypes.bool,
      lastName: PropTypes.string,
      profilePictureUrl: PropTypes.string,
      provider: PropTypes.string,
      role: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
}
