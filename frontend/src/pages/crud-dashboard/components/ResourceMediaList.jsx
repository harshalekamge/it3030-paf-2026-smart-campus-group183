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
import { deleteResourceMedia, getResourceMedia } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function ResourceMediaList() {
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
      setRows(await getResourceMedia());
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
    navigate('/dashboard/resource-media/new');
  }, [navigate]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/dashboard/resource-media/${row.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (resourceMedia) => () => {
      navigate(`/dashboard/resource-media/${resourceMedia.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (resourceMedia) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete media ${resourceMedia.id}?`,
        {
          title: 'Delete resource media?',
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
        await deleteResourceMedia(resourceMedia.id);
        notifications.show('Resource media deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        loadData();
      } catch (deleteError) {
        notifications.show(`Failed to delete resource media. Reason: ${deleteError.message}`, {
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
      { field: 'mediaType', headerName: 'Media type', width: 120 },
      { field: 'url', headerName: 'URL', flex: 1.2, minWidth: 220 },
      { field: 'caption', headerName: 'Caption', flex: 1, minWidth: 180 },
      { field: 'isPrimary', headerName: 'Primary', type: 'boolean', width: 100 },
      { field: 'displayOrder', headerName: 'Order', width: 90 },
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
      title="Resource Media"
      breadcrumbs={[{ title: 'Resource Media' }]}
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
