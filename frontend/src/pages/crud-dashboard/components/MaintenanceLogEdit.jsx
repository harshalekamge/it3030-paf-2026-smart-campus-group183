import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getMaintenanceLog, updateMaintenanceLog } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import MaintenanceLogForm from './MaintenanceLogForm';
import PageContainer from './PageContainer';

function validateMaintenanceLog(values) {
  const errors = {};

  if (!values.resourceId || values.resourceId <= 0) {
    errors.resourceId = 'Resource ID must be greater than 0.';
  }
  if (values.reportedBy != null && values.reportedBy !== '' && values.reportedBy <= 0) {
    errors.reportedBy = 'Reported by must be greater than 0.';
  }
  if (values.priorStatus && values.priorStatus.length > 25) {
    errors.priorStatus = 'Prior status must not exceed 25 characters.';
  }
  if (values.newStatus && values.newStatus.length > 25) {
    errors.newStatus = 'New status must not exceed 25 characters.';
  }
  if (values.category && values.category.length > 50) {
    errors.category = 'Category must not exceed 50 characters.';
  }
  if (values.externalRef && values.externalRef.length > 100) {
    errors.externalRef = 'External reference must not exceed 100 characters.';
  }
  if (values.cost !== '' && values.cost != null && Number(values.cost) < 0) {
    errors.cost = 'Cost must be zero or greater.';
  }

  return errors;
}

function toRequestPayload(values) {
  return {
    resourceId: values.resourceId,
    reportedBy: values.reportedBy || null,
    priorStatus: values.priorStatus?.trim() || null,
    newStatus: values.newStatus?.trim() || null,
    category: values.category?.trim() || null,
    description: values.description?.trim() || null,
    resolvedAt: values.resolvedAt ? new Date(values.resolvedAt).toISOString() : null,
    cost: values.cost === '' || values.cost == null ? null : values.cost,
    externalRef: values.externalRef?.trim() || null,
  };
}

function toDateTimeLocalValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function MaintenanceLogEdit() {
  const { maintenanceLogId } = useParams();
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
      const maintenanceLog = await getMaintenanceLog(maintenanceLogId);
      setFormState({
        values: {
          category: maintenanceLog.category ?? '',
          cost: maintenanceLog.cost ?? '',
          description: maintenanceLog.description ?? '',
          externalRef: maintenanceLog.externalRef ?? '',
          newStatus: maintenanceLog.newStatus ?? '',
          priorStatus: maintenanceLog.priorStatus ?? '',
          reportedBy: maintenanceLog.reportedBy ?? null,
          resolvedAt: toDateTimeLocalValue(maintenanceLog.resolvedAt),
          resourceId: maintenanceLog.resourceId ?? null,
        },
        errors: {},
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setIsLoading(false);
    }
  }, [maintenanceLogId]);

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
          [name]: validateMaintenanceLog(values)[name],
        },
      };
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (values) => {
      const errors = validateMaintenanceLog(values);
      if (Object.keys(errors).length > 0) {
        setFormState((previousValue) => ({ ...previousValue, errors }));
        return;
      }

      try {
        await updateMaintenanceLog(maintenanceLogId, toRequestPayload(values));
        notifications.show('Maintenance log updated successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/maintenance-logs/${maintenanceLogId}`);
      } catch (updateError) {
        notifications.show(`Failed to update maintenance log. Reason: ${updateError.message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        });
        throw updateError;
      }
    },
    [maintenanceLogId, navigate, notifications],
  );

  return (
    <PageContainer
      title={`Edit Maintenance Log ${maintenanceLogId}`}
      breadcrumbs={[
        { title: 'Maintenance Logs', path: '/dashboard/maintenance-logs' },
        { title: `Maintenance Log ${maintenanceLogId}`, path: `/dashboard/maintenance-logs/${maintenanceLogId}` },
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
        <MaintenanceLogForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Save"
          backButtonPath={`/dashboard/maintenance-logs/${maintenanceLogId}`}
        />
      )}
    </PageContainer>
  );
}
