import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getAmenity, updateAmenity } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import AmenityForm from './AmenityForm';
import PageContainer from './PageContainer';

function validateAmenity(values) {
  const errors = {};

  if (!values.code?.trim()) {
    errors.code = 'Code is required.';
  }
  if (!values.label?.trim()) {
    errors.label = 'Label is required.';
  }

  return errors;
}

export default function AmenityEdit() {
  const { amenityId } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: null,
    errors: {},
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const amenity = await getAmenity(amenityId);
      setFormState({
        values: {
          code: amenity.code ?? '',
          iconSlug: amenity.iconSlug ?? '',
          label: amenity.label ?? '',
        },
        errors: {},
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [amenityId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFieldChange = React.useCallback((name, value) => {
    setFormState((previousValue) => {
      const values = { ...previousValue.values, [name]: value };
      return {
        values,
        errors: {
          ...previousValue.errors,
          [name]: validateAmenity(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateAmenity(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        await updateAmenity(amenityId, values);
        notifications.show('Amenity updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/amenities/${amenityId}`);
      } catch (updateError) {
        notifications.show(`Failed to update amenity. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw updateError;
      }
    },
    [amenityId, navigate, notifications],
  );

  return (
    <PageContainer
      title={`Edit Amenity ${amenityId}`}
      breadcrumbs={[
        { title: 'Amenities', path: '/dashboard/amenities' },
        { title: `Amenity ${amenityId}`, path: `/dashboard/amenities/${amenityId}` },
        { title: 'Edit' },
      ]}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <AmenityForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/amenities/${amenityId}`}
        />
      )}
    </PageContainer>
  );
}
