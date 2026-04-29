import * as React from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteUser, getUser } from '../data/assetsApi'
import { useDialogs } from '../hooks/useDialogs/useDialogs'
import useNotifications from '../hooks/useNotifications/useNotifications'
import PageContainer from './PageContainer'

function getDisplayName(user) {
  return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
}

export default function UserShow() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dialogs = useDialogs()
  const notifications = useNotifications()

  const [user, setUser] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      setUser(await getUser(userId))
    } catch (loadError) {
      setError(loadError)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/users/${userId}/edit`)
  }, [navigate, userId])

  const handleDelete = React.useCallback(async () => {
    if (!user) {
      return
    }

    const confirmed = await dialogs.confirm(`Do you wish to delete ${getDisplayName(user)}?`, {
      title: 'Delete user account?',
      severity: 'error',
      okText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!confirmed) {
      return
    }

    setIsLoading(true)
    try {
      await deleteUser(userId)
      notifications.show('User account deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      })
      navigate('/dashboard/users')
    } catch (deleteError) {
      notifications.show(`Failed to delete user. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      })
      setIsLoading(false)
    }
  }, [dialogs, navigate, notifications, user, userId])

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/users')
  }, [navigate])

  return (
    <PageContainer
      title={`User ${userId}`}
      breadcrumbs={[
        { title: 'User Management', path: '/dashboard/users' },
        { title: `User ${userId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : user ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Paper
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                p: 3,
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Avatar
                src={user.profilePictureUrl ?? undefined}
                alt={getDisplayName(user)}
                imgProps={{ referrerPolicy: 'no-referrer' }}
                sx={{ width: 72, height: 72 }}
              >
                {getDisplayName(user).charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {getDisplayName(user)}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={String(user.role ?? '').replace('_', ' ')} color="primary" />
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'default'}
                    variant={user.isActive ? 'filled' : 'outlined'}
                  />
                  <Chip label={user.provider || 'Unknown provider'} variant="outlined" />
                </Stack>
              </Box>
            </Paper>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Google ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.googleId || 'Not linked'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Profile picture URL</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.profilePictureUrl || 'Not provided'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">First name</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.firstName || 'Not provided'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Last name</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.lastName || 'Not provided'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Full name</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.fullName || 'Auto-generated when available'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Created at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.createdAt ? dayjs(user.createdAt).format('MMMM D, YYYY h:mm A') : 'Not available'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Updated at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.updatedAt ? dayjs(user.updatedAt).format('MMMM D, YYYY h:mm A') : 'Not available'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Last login</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.lastLoginAt ? dayjs(user.lastLoginAt).format('MMMM D, YYYY h:mm A') : 'Never'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
              <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                Back
              </Button>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </PageContainer>
  )
}
