import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getResourceType, updateResourceType } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceTypeForm from './ResourceTypeForm';

function validateResourceType(values) {
  const errors = {};

  if (!values.typeCode?.trim()) {
    errors.typeCode = 'Type code is required.';
  }
  if (!values.typeName?.trim()) {
    errors.typeName = 'Type name is required.';
  }

  return errors;
}

export default function ResourceTypeEdit() {
  const { resourceTypeId } = useParams();
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
      const resourceType = await getResourceType(resourceTypeId);
      setFormState({
        values: {
          description: resourceType.description ?? '',
          iconSlug: resourceType.iconSlug ?? '',
          isEquipment: resourceType.isEquipment ?? false,
          requiresCapacity: resourceType.requiresCapacity ?? false,
          requiresLocation: resourceType.requiresLocation ?? false,
          typeCode: resourceType.typeCode ?? '',
          typeName: resourceType.typeName ?? '',
        },
        errors: {},
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [resourceTypeId]);

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
          [name]: validateResourceType(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateResourceType(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        await updateResourceType(resourceTypeId, values);
        notifications.show('Resource type updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resource-types/${resourceTypeId}`);
      } catch (updateError) {
        notifications.show(`Failed to update resource type. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw updateError;
      }
    },
    [navigate, notifications, resourceTypeId],
  );

  const pageTitle = `Edit Resource Type ${resourceTypeId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Resource Types', path: '/dashboard/resource-types' },
        { title: `Resource Type ${resourceTypeId}`, path: `/dashboard/resource-types/${resourceTypeId}` },
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
        <ResourceTypeForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/resource-types/${resourceTypeId}`}
        />
      )}
    </PageContainer>
  );
}
