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
import { deleteAvailabilityWindow, getAvailabilityWindow } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityWindowShow() {
  const { availabilityWindowId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [availabilityWindow, setAvailabilityWindow] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setAvailabilityWindow(await getAvailabilityWindow(availabilityWindowId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [availabilityWindowId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/availability-windows/${availabilityWindowId}/edit`);
  }, [availabilityWindowId, navigate]);

  const handleDelete = React.useCallback(async () => {
    if (!availabilityWindow) {
      return;
    }

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
      await deleteAvailabilityWindow(availabilityWindowId);
      notifications.show('Availability window deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/availability-windows');
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
  }, [availabilityWindow, availabilityWindowId, dialogs, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/availability-windows');
  }, [navigate]);

  return (
    <PageContainer
      title={`Availability Window ${availabilityWindowId}`}
      breadcrumbs={[
        { title: 'Availability Windows', path: '/dashboard/availability-windows' },
        { title: `Availability Window ${availabilityWindowId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : availabilityWindow ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Resource ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.resourceId}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Day of week</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.dayOfWeek == null
                      ? 'Not set'
                      : DAY_LABELS[availabilityWindow.dayOfWeek] ?? availabilityWindow.dayOfWeek}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Specific date</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.specificDate || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Open time</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.openTime}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Close time</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.closeTime}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Closed</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.isClosed ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Valid from</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.validFrom || 'Not available'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Valid until</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.validUntil || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Note</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {availabilityWindow.note || 'No note'}
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
