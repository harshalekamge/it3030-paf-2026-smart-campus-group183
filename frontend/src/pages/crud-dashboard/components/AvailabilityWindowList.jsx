import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { deleteAvailabilityWindow, getAvailabilityWindows } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityWindowList() {
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      setRows(await getAvailabilityWindows());
    } catch (listError) {
      setError(listError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleCreateClick = React.useCallback(() => {
    navigate('/dashboard/availability-windows/new');
  }, [navigate]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/dashboard/availability-windows/${row.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (availabilityWindow) => () => {
      navigate(`/dashboard/availability-windows/${availabilityWindow.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (availabilityWindow) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete availability window ${availabilityWindow.id}?`,
        {
          title: 'Delete availability window?',
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      );

      if (!confirmed) {
        return;
      }

      setIsLoading(true);
      try {
        await deleteAvailabilityWindow(availabilityWindow.id);
        notifications.show('Availability window deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        loadData();
      } catch (deleteError) {
        notifications.show(
          `Failed to delete availability window. Reason: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
        setIsLoading(false);
      }
    },
    [dialogs, loadData, notifications],
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'resourceId', headerName: 'Resource ID', width: 110 },
      {
        field: 'dayOfWeek',
        headerName: 'Day',
        width: 120,
        valueFormatter: (value) => (value == null ? 'Not set' : DAY_LABELS[value] ?? value),
      },
      { field: 'specificDate', headerName: 'Specific date', width: 130 },
      { field: 'openTime', headerName: 'Open', width: 100 },
      { field: 'closeTime', headerName: 'Close', width: 100 },
      { field: 'isClosed', headerName: 'Closed', type: 'boolean', width: 90 },
      { field: 'validUntil', headerName: 'Valid until', width: 130 },
      { field: 'note', headerName: 'Note', flex: 1, minWidth: 180 },
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
  );

  return (
    <PageContainer
      title="Availability Windows"
      breadcrumbs={[{ title: 'Availability Windows' }]}
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
  );
}
