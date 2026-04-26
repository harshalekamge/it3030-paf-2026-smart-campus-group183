import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createResourceType } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceTypeForm from './ResourceTypeForm';

const INITIAL_FORM_VALUES = {
  description: '',
  iconSlug: '',
  isEquipment: false,
  requiresCapacity: false,
  requiresLocation: false,
  typeCode: '',
  typeName: '',
};

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

export default function ResourceTypeCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: INITIAL_FORM_VALUES,
    errors: {},
  });

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
        const resourceType = await createResourceType(values);
        notifications.show('Resource type created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resource-types/${resourceType.id}`);
      } catch (createError) {
        notifications.show(`Failed to create resource type. Reason: ${createError.message}`, {
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
      title="New Resource Type"
      breadcrumbs={[
        { title: 'Resource Types', path: '/dashboard/resource-types' },
        { title: 'New' },
      ]}
    >
      <ResourceTypeForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
