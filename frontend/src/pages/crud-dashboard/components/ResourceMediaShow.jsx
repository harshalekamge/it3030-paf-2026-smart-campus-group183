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
import { deleteResourceMedia, getResourceMediaById } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function ResourceMediaShow() {
  const { resourceMediaId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [resourceMedia, setResourceMedia] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setResourceMedia(await getResourceMediaById(resourceMediaId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [resourceMediaId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/resource-media/${resourceMediaId}/edit`);
  }, [navigate, resourceMediaId]);

  const handleDelete = React.useCallback(async () => {
    if (!resourceMedia) {
      return;
    }

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
      await deleteResourceMedia(resourceMediaId);
      notifications.show('Resource media deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/resource-media');
    } catch (deleteError) {
      notifications.show(`Failed to delete resource media. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      setIsLoading(false);
    }
  }, [dialogs, navigate, notifications, resourceMedia, resourceMediaId]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/resource-media');
  }, [navigate]);

  return (
    <PageContainer
      title={`Resource Media ${resourceMediaId}`}
      breadcrumbs={[
        { title: 'Resource Media', path: '/dashboard/resource-media' },
        { title: `Resource Media ${resourceMediaId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : resourceMedia ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Resource ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.resourceId}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Media type</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.mediaType || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">URL</Typography>
                  <Typography variant="body1" sx={{ mb: 1, wordBreak: 'break-all' }}>
                    {resourceMedia.url}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Caption</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.caption || 'No caption'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Primary</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.isPrimary ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Display order</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.displayOrder ?? 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Uploaded at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {resourceMedia.uploadedAt
                      ? dayjs(resourceMedia.uploadedAt).format('MMMM D, YYYY h:mm A')
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
