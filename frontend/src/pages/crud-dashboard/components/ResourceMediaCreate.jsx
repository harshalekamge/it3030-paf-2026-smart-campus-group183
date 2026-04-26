import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createResourceMedia } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import ResourceMediaForm from './ResourceMediaForm';

const INITIAL_FORM_VALUES = {
  caption: '',
  displayOrder: null,
  isPrimary: false,
  mediaType: '',
  resourceId: null,
  url: '',
};

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

export default function ResourceMediaCreate() {
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
        const resourceMedia = await createResourceMedia(values);
        notifications.show('Resource media created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/resource-media/${resourceMedia.id}`);
      } catch (createError) {
        notifications.show(`Failed to create resource media. Reason: ${createError.message}`, {
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
      title="New Resource Media"
      breadcrumbs={[
        { title: 'Resource Media', path: '/dashboard/resource-media' },
        { title: 'New' },
      ]}
    >
      <ResourceMediaForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
