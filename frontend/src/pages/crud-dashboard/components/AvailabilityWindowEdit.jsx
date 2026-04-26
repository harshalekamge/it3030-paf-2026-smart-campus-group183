import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getAvailabilityWindow, updateAvailabilityWindow } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import AvailabilityWindowForm from './AvailabilityWindowForm';
import PageContainer from './PageContainer';

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

export default function AvailabilityWindowEdit() {
  const { availabilityWindowId } = useParams();
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
      const availabilityWindow = await getAvailabilityWindow(availabilityWindowId);
      setFormState({
        values: {
          closeTime: availabilityWindow.closeTime ?? '',
          dayOfWeek: availabilityWindow.dayOfWeek ?? null,
          isClosed: availabilityWindow.isClosed ?? false,
          note: availabilityWindow.note ?? '',
          openTime: availabilityWindow.openTime ?? '',
          resourceId: availabilityWindow.resourceId ?? null,
          specificDate: availabilityWindow.specificDate ?? '',
          validUntil: availabilityWindow.validUntil ?? '',
        },
        errors: {},
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [availabilityWindowId]);

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
        await updateAvailabilityWindow(availabilityWindowId, toRequestPayload(values));
        notifications.show('Availability window updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/availability-windows/${availabilityWindowId}`);
      } catch (updateError) {
        notifications.show(
          `Failed to update availability window. Reason: ${updateError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
        throw updateError;
      }
    },
    [availabilityWindowId, navigate, notifications],
  );

  return (
    <PageContainer
      title={`Edit Availability Window ${availabilityWindowId}`}
      breadcrumbs={[
        { title: 'Availability Windows', path: '/dashboard/availability-windows' },
        {
          title: `Availability Window ${availabilityWindowId}`,
          path: `/dashboard/availability-windows/${availabilityWindowId}`,
        },
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
        <AvailabilityWindowForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/availability-windows/${availabilityWindowId}`}
        />
      )}
    </PageContainer>
  );
}
