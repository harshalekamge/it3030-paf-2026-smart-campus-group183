import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createResource } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceForm from './ResourceForm';
import {
  buildResourcePayload,
  INITIAL_RESOURCE_FORM_VALUES,
  validateResource,
} from './resourceFormUtils';

export default function ResourceCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: INITIAL_RESOURCE_FORM_VALUES,
    errors: {},
  });

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
        const resource = await createResource(buildResourcePayload(values));
        notifications.show('Resource created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resources/${resource.id}`);
      } catch (createError) {
        notifications.show(`Failed to create resource. Reason: ${createError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw createError;
      }
    },
    [navigate, notifications],
  );

  return (
    <PageContainer
      title="New Resource"
      breadcrumbs={[
        { title: 'Resources', path: '/dashboard/resources' },
        { title: 'New' },
      ]}
    >
      <ResourceForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
