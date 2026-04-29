import * as React from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../data/assetsApi'
import { useDialogs } from '../hooks/useDialogs/useDialogs'
import useNotifications from '../hooks/useNotifications/useNotifications'
import PageContainer from './PageContainer'

function getDisplayName(user) {
  return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
}

function getRoleColor(role) {
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return 'primary'
  }
  if (role === 'STAFF' || role === 'LECTURER') {
    return 'secondary'
  }
  return 'default'
}

export default function UserList() {
  const navigate = useNavigate()
  const dialogs = useDialogs()
  const notifications = useNotifications()

  const [rows, setRows] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const users = await getUsers()
      setRows(users)
    } catch (listError) {
      setError(listError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData()
    }
  }, [isLoading, loadData])

  const handleCreateClick = React.useCallback(() => {
    navigate('/dashboard/users/new')
  }, [navigate])

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/dashboard/users/${row.id}`)
    },
    [navigate],
  )

  const handleRowEdit = React.useCallback(
    (user) => () => {
      navigate(`/dashboard/users/${user.id}/edit`)
    },
    [navigate],
  )

  const handleRowDelete = React.useCallback(
    (user) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete ${getDisplayName(user)}?`,
        {
          title: 'Delete user account?',
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      )

      if (!confirmed) {
        return
      }

      setIsLoading(true)
      try {
        await deleteUser(user.id)
        notifications.show('User account deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        loadData()
      } catch (deleteError) {
        notifications.show(`Failed to delete user. Reason: ${deleteError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
        setIsLoading(false)
      }
    },
    [dialogs, loadData, notifications],
  )

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'fullName',
        headerName: 'User',
        flex: 1.2,
        minWidth: 250,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Avatar
              src={row.profilePictureUrl ?? undefined}
              alt={getDisplayName(row)}
              imgProps={{ referrerPolicy: 'no-referrer' }}
            >
              {getDisplayName(row).charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 600 }}>
                {getDisplayName(row)}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {row.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 150,
        renderCell: ({ value }) => (
          <Chip
            size="small"
            icon={value === 'ADMIN' ? <AdminPanelSettingsIcon /> : undefined}
            label={String(value ?? '').replace('_', ' ')}
            color={getRoleColor(value)}
            variant={value === 'STUDENT' ? 'outlined' : 'filled'}
          />
        ),
      },
      { field: 'provider', headerName: 'Provider', width: 120 },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 120,
        renderCell: ({ value }) => (
          <Chip
            size="small"
            label={value ? 'Active' : 'Inactive'}
            color={value ? 'success' : 'default'}
            variant={value ? 'filled' : 'outlined'}
          />
        ),
      },
      {
        field: 'lastLoginAt',
        headerName: 'Last login',
        minWidth: 180,
        flex: 0.8,
        valueFormatter: (value) =>
          value ? dayjs(value).format('MMM D, YYYY h:mm A') : 'Never',
      },
      {
        field: 'actions',
        type: 'actions',
        width: 110,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowDelete, handleRowEdit],
  )

  return (
    <PageContainer
      title="User Management"
      breadcrumbs={[{ title: 'User Management' }]}
      actions={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button variant="contained" onClick={handleCreateClick} startIcon={<AddIcon />}>
            Create
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
            showToolbar
          />
        )}
      </Box>
    </PageContainer>
  )
}
