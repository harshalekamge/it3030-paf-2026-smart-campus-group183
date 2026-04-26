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
import { deleteMaintenanceLog, getMaintenanceLog } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function MaintenanceLogShow() {
  const { maintenanceLogId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [maintenanceLog, setMaintenanceLog] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setMaintenanceLog(await getMaintenanceLog(maintenanceLogId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [maintenanceLogId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/maintenance-logs/${maintenanceLogId}/edit`);
  }, [maintenanceLogId, navigate]);

  const handleDelete = React.useCallback(async () => {
    if (!maintenanceLog) {
      return;
    }

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
      await deleteMaintenanceLog(maintenanceLogId);
      notifications.show('Maintenance log deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/maintenance-logs');
    } catch (deleteError) {
      notifications.show(`Failed to delete maintenance log. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      setIsLoading(false);
    }
  }, [dialogs, maintenanceLog, maintenanceLogId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/maintenance-logs');
  }, [navigate]);

  return (
    <PageContainer
      title={`Maintenance Log ${maintenanceLogId}`}
      breadcrumbs={[
        { title: 'Maintenance Logs', path: '/dashboard/maintenance-logs' },
        { title: `Maintenance Log ${maintenanceLogId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : maintenanceLog ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Resource ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.resourceId}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Reported by</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.reportedBy ?? 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Prior status</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.priorStatus || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">New status</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.newStatus || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Category</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.category || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Cost</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.cost ?? 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Started at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.startedAt
                      ? dayjs(maintenanceLog.startedAt).format('MMMM D, YYYY h:mm A')
                      : 'Not available'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Resolved at</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.resolvedAt
                      ? dayjs(maintenanceLog.resolvedAt).format('MMMM D, YYYY h:mm A')
                      : 'Not resolved'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">External reference</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.externalRef || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Description</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {maintenanceLog.description || 'No description'}
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
