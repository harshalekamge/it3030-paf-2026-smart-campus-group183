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
import { deleteResourceType, getResourceTypes } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function ResourceTypeList() {
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
      const resourceTypes = await getResourceTypes();
      setRows(resourceTypes);
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
    navigate('/dashboard/resource-types/new');
  }, [navigate]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/dashboard/resource-types/${row.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (resourceType) => () => {
      navigate(`/dashboard/resource-types/${resourceType.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (resourceType) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete ${resourceType.typeName}?`,
        {
          title: 'Delete resource type?',
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
        await deleteResourceType(resourceType.id);
        notifications.show('Resource type deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        loadData();
      } catch (deleteError) {
        notifications.show(`Failed to delete resource type. Reason: ${deleteError.message}`, {
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
      { field: 'typeCode', headerName: 'Code', width: 140 },
      { field: 'typeName', headerName: 'Name', flex: 1, minWidth: 180 },
      { field: 'description', headerName: 'Description', flex: 1.2, minWidth: 220 },
      { field: 'iconSlug', headerName: 'Icon slug', width: 150 },
      { field: 'requiresCapacity', headerName: 'Capacity', type: 'boolean', width: 110 },
      { field: 'requiresLocation', headerName: 'Location', type: 'boolean', width: 110 },
      { field: 'isEquipment', headerName: 'Equipment', type: 'boolean', width: 120 },
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
      title="Resource Types"
      breadcrumbs={[{ title: 'Resource Types' }]}
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
                  iconSlug: false,
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
