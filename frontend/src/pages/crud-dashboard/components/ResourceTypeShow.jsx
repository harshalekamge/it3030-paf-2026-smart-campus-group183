import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { deleteResourceType, getResourceType } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function ResourceTypeShow() {
  const { resourceTypeId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [resourceType, setResourceType] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setResourceType(await getResourceType(resourceTypeId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [resourceTypeId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/resource-types/${resourceTypeId}/edit`);
  }, [navigate, resourceTypeId]);

  const handleDelete = React.useCallback(async () => {
    if (!resourceType) {
      return;
    }

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
      await deleteResourceType(resourceTypeId);
      notifications.show('Resource type deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/resource-types');
    } catch (deleteError) {
      notifications.show(`Failed to delete resource type. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      setIsLoading(false);
    }
  }, [dialogs, navigate, notifications, resourceType, resourceTypeId]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/resource-types');
  }, [navigate]);

  return (
    <PageContainer
      title={`Resource Type ${resourceTypeId}`}
      breadcrumbs={[
        { title: 'Resource Types', path: '/dashboard/resource-types' },
        { title: `Resource Type ${resourceTypeId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : resourceType ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Type code</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.typeCode}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Type name</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.typeName}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Description</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.description || 'No description'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Requires capacity</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.requiresCapacity ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Requires location</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.requiresLocation ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Is equipment</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.isEquipment ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Icon slug</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.iconSlug || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Created at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceType.createdAt
                      ? dayjs(resourceType.createdAt).format('MMMM D, YYYY h:mm A')
                      : 'Not available'}
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
  );
}
