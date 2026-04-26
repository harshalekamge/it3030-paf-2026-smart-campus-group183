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
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteResource, getResource } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

function formatDate(value) {
  return value ? dayjs(value).format('MMMM D, YYYY') : 'Not available';
}

function formatDateTime(value) {
  return value ? dayjs(value).format('MMMM D, YYYY h:mm A') : 'Not available';
}

function DetailCard({ label, value }) {
  return (
    <Paper sx={{ px: 2, py: 1 }}>
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function ResourceShow() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [resource, setResource] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setResource(await getResource(resourceId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/resources/${resourceId}/edit`);
  }, [navigate, resourceId]);

  const handleDelete = React.useCallback(async () => {
    if (!resource) {
      return;
    }

    const confirmed = await dialogs.confirm(`Do you wish to delete ${resource.name}?`, {
      title: 'Delete resource?',
      severity: 'error',
      okText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteResource(resourceId);
      notifications.show('Resource deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/resources');
    } catch (deleteError) {
      notifications.show(`Failed to delete resource. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      setIsLoading(false);
    }
  }, [dialogs, navigate, notifications, resource, resourceId]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/resources');
  }, [navigate]);

  return (
    <PageContainer
      title={`Resource ${resourceId}`}
      breadcrumbs={[
        { title: 'Resources', path: '/dashboard/resources' },
        { title: `Resource ${resourceId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : resource ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Name" value={resource.name} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Code" value={resource.code} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Resource Type ID" value={resource.resourceTypeId} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Custodian ID" value={resource.custodianId ?? 'Not assigned'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailCard label="Description" value={resource.description || 'No description'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailCard
                  label="Tags"
                  value={resource.tags?.length ? resource.tags.join(', ') : 'No tags'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Building" value={resource.building || 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Floor" value={resource.floor ?? 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Room No" value={resource.roomNo || 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Capacity" value={resource.capacity ?? 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Minimum Capacity" value={resource.minCapacity ?? 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Status" value={resource.status || 'Not set'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Active" value={resource.isActive ? 'Yes' : 'No'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Requires Approval"
                  value={resource.requiresApproval ? 'Yes' : 'No'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Accessible" value={resource.isAccessible ? 'Yes' : 'No'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Purchase Date" value={formatDate(resource.purchaseDate)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Last Serviced At"
                  value={formatDate(resource.lastServicedAt)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard label="Next Service Due" value={formatDate(resource.nextServiceDue)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Replacement Cost"
                  value={resource.replacementCost ?? 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Max Booking Duration"
                  value={
                    resource.maxBookingDuration != null
                      ? `${resource.maxBookingDuration} minutes`
                      : 'Not set'
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Advance Booking Days"
                  value={resource.advanceBookingDays ?? 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Min Notice Minutes"
                  value={resource.minNoticeMinutes ?? 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Default Open Time"
                  value={resource.defaultOpenTime || 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DetailCard
                  label="Default Close Time"
                  value={resource.defaultCloseTime || 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailCard
                  label="Accessibility Notes"
                  value={resource.accessibilityNotes || 'No accessibility notes'}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailCard
                  label="Primary Image URL"
                  value={resource.primaryImageUrl || 'Not set'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Created At" value={formatDateTime(resource.createdAt)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailCard label="Updated At" value={formatDateTime(resource.updatedAt)} />
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
