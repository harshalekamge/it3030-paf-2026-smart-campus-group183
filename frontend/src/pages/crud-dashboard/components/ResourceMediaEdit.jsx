import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getResourceMediaById, updateResourceMedia } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceMediaForm from './ResourceMediaForm';

function validateResourceMedia(values) {
  const errors = {};

  if (!values.resourceId || values.resourceId <= 0) {
    errors.resourceId = 'Resource ID must be greater than 0.';
  }
  if (!values.url?.trim()) {
    errors.url = 'URL is required.';
  }
  if (values.mediaType && values.mediaType.length > 10) {
    errors.mediaType = 'Media type must not exceed 10 characters.';
  }
  if (values.caption && values.caption.length > 255) {
    errors.caption = 'Caption must not exceed 255 characters.';
  }

  return errors;
}

export default function ResourceMediaEdit() {
  const { resourceMediaId } = useParams();
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
      const resourceMedia = await getResourceMediaById(resourceMediaId);
      setFormState({
        values: {
          caption: resourceMedia.caption ?? '',
          displayOrder: resourceMedia.displayOrder ?? null,
          isPrimary: resourceMedia.isPrimary ?? false,
          mediaType: resourceMedia.mediaType ?? '',
          resourceId: resourceMedia.resourceId ?? null,
          url: resourceMedia.url ?? '',
        },
        errors: {},
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [resourceMediaId]);

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
          [name]: validateResourceMedia(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateResourceMedia(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        await updateResourceMedia(resourceMediaId, values);
        notifications.show('Resource media updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resource-media/${resourceMediaId}`);
      } catch (updateError) {
        notifications.show(`Failed to update resource media. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw updateError;
      }
    },
    [navigate, notifications, resourceMediaId],
  );

  return (
    <PageContainer
      title={`Edit Resource Media ${resourceMediaId}`}
      breadcrumbs={[
        { title: 'Resource Media', path: '/dashboard/resource-media' },
        { title: `Resource Media ${resourceMediaId}`, path: `/dashboard/resource-media/${resourceMediaId}` },
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
        <ResourceMediaForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/resource-media/${resourceMediaId}`}
        />
      )}
    </PageContainer>
  );
}
