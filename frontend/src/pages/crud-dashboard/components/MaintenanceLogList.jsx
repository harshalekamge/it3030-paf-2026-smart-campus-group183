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
import { deleteMaintenanceLog, getMaintenanceLogs } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function MaintenanceLogList() {
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
      setRows(await getMaintenanceLogs());
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
    navigate('/dashboard/maintenance-logs/new');
  }, [navigate]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/dashboard/maintenance-logs/${row.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (maintenanceLog) => () => {
      navigate(`/dashboard/maintenance-logs/${maintenanceLog.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (maintenanceLog) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete maintenance log ${maintenanceLog.id}?`,
        {
          title: 'Delete maintenance log?',
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
        await deleteMaintenanceLog(maintenanceLog.id);
        notifications.show('Maintenance log deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        loadData();
      } catch (deleteError) {
        notifications.show(`Failed to delete maintenance log. Reason: ${deleteError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        setIsLoading(false);
      }
    },
    [dialogs, loadData, notifications],
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'resourceId', headerName: 'Resource ID', width: 110 },
      { field: 'reportedBy', headerName: 'Reported by', width: 110 },
      { field: 'category', headerName: 'Category', width: 140 },
      { field: 'priorStatus', headerName: 'Prior status', width: 130 },
      { field: 'newStatus', headerName: 'New status', width: 130 },
      { field: 'cost', headerName: 'Cost', width: 110 },
      { field: 'startedAt', headerName: 'Started at', width: 180 },
      { field: 'resolvedAt', headerName: 'Resolved at', width: 180 },
      { field: 'externalRef', headerName: 'External ref', width: 140 },
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
      title="Maintenance Logs"
      breadcrumbs={[{ title: 'Maintenance Logs' }]}
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
              columns: {
                columnVisibilityModel: {
                  externalRef: false,
                },
              },
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
