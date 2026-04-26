import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getResource, updateResource } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceForm from './ResourceForm';
import {
  buildResourcePayload,
  mapResourceToFormValues,
  validateResource,
} from './resourceFormUtils';

export default function ResourceEdit() {
  const { resourceId } = useParams();
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
      const resource = await getResource(resourceId);
      setFormState({
        values: mapResourceToFormValues(resource),
        errors: {},
      });
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

  const handleFieldChange = React.useCallback((name, value) => {
    setFormState((previousValue) => {
      const values = { ...previousValue.values, [name]: value };
      return {
        values,
        errors: {
          ...previousValue.errors,
          [name]: validateResource(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateResource(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        await updateResource(resourceId, buildResourcePayload(values));
        notifications.show('Resource updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resources/${resourceId}`);
      } catch (updateError) {
        notifications.show(`Failed to update resource. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw updateError;
      }
    },
    [navigate, notifications, resourceId],
  );

  return (
    <PageContainer
      title={`Edit Resource ${resourceId}`}
      breadcrumbs={[
        { title: 'Resources', path: '/dashboard/resources' },
        { title: `Resource ${resourceId}`, path: `/dashboard/resources/${resourceId}` },
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
        <ResourceForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/resources/${resourceId}`}
        />
      )}
    </PageContainer>
  );
}
