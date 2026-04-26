import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createAvailabilityWindow } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import AvailabilityWindowForm from './AvailabilityWindowForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES = {
  closeTime: '',
  dayOfWeek: null,
  isClosed: false,
  note: '',
  openTime: '',
  resourceId: null,
  specificDate: '',
  validUntil: '',
};

function validateAvailabilityWindow(values) {
  const errors = {};

  if (!values.resourceId || values.resourceId <= 0) {
    errors.resourceId = 'Resource ID must be greater than 0.';
  }
  if (values.dayOfWeek != null && (values.dayOfWeek < 0 || values.dayOfWeek > 6)) {
    errors.dayOfWeek = 'Day of week must be between 0 and 6.';
  }
  if (!values.openTime) {
    errors.openTime = 'Open time is required.';
  }
  if (!values.closeTime) {
    errors.closeTime = 'Close time is required.';
  }
  if (values.note && values.note.length > 255) {
    errors.note = 'Note must not exceed 255 characters.';
  }

  return errors;
}

function toRequestPayload(values) {
  return {
    resourceId: values.resourceId,
    dayOfWeek: values.dayOfWeek,
    specificDate: values.specificDate || null,
    openTime: values.openTime || null,
    closeTime: values.closeTime || null,
    isClosed: values.isClosed,
    validUntil: values.validUntil || null,
    note: values.note?.trim() || null,
  };
}

export default function AvailabilityWindowCreate() {
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
          [name]: validateAvailabilityWindow(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateAvailabilityWindow(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        const availabilityWindow = await createAvailabilityWindow(toRequestPayload(values));
        notifications.show('Availability window created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/availability-windows/${availabilityWindow.id}`);
      } catch (createError) {
        notifications.show(
          `Failed to create availability window. Reason: ${createError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
        throw createError;
      }
    },
    [navigate, notifications],
  );

  return (
    <PageContainer
      title="New Availability Window"
      breadcrumbs={[
        { title: 'Availability Windows', path: '/dashboard/availability-windows' },
        { title: 'New' },
      ]}
    >
      <AvailabilityWindowForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
