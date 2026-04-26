import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createAmenity } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import AmenityForm from './AmenityForm';

const INITIAL_FORM_VALUES = {
  code: '',
  iconSlug: '',
  label: '',
};

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

export default function AmenityCreate() {
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
        const amenity = await createAmenity(values);
        notifications.show('Amenity created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/amenities/${amenity.id}`);
      } catch (createError) {
        notifications.show(`Failed to create amenity. Reason: ${createError.message}`, {
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
      title="New Amenity"
      breadcrumbs={[
        { title: 'Amenities', path: '/dashboard/amenities' },
        { title: 'New' },
      ]}
    >
      <AmenityForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
