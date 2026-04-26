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
import { deleteAmenity, getAmenity } from '../data/assetsApi';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';

export default function AmenityShow() {
  const { amenityId } = useParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [amenity, setAmenity] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setAmenity(await getAmenity(amenityId));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [amenityId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/amenities/${amenityId}/edit`);
  }, [amenityId, navigate]);

  const handleDelete = React.useCallback(async () => {
    if (!amenity) {
      return;
    }

    const confirmed = await dialogs.confirm(`Do you wish to delete ${amenity.label}?`, {
      title: 'Delete amenity?',
      severity: 'error',
      okText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAmenity(amenityId);
      notifications.show('Amenity deleted successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/dashboard/amenities');
    } catch (deleteError) {
      notifications.show(`Failed to delete amenity. Reason: ${deleteError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      setIsLoading(false);
    }
  }, [amenity, amenityId, dialogs, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/amenities');
  }, [navigate]);

  return (
    <PageContainer
      title={`Amenity ${amenityId}`}
      breadcrumbs={[
        { title: 'Amenities', path: '/dashboard/amenities' },
        { title: `Amenity ${amenityId}` },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : amenity ? (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {amenity.id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Code</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {amenity.code}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Icon slug</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {amenity.iconSlug || 'Not set'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline">Label</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {amenity.label}
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
