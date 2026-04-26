import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createMaintenanceLog } from '../data/assetsApi';
import useNotifications from '../hooks/useNotifications/useNotifications';
import MaintenanceLogForm from './MaintenanceLogForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES = {
  category: '',
  cost: '',
  description: '',
  externalRef: '',
  newStatus: '',
  priorStatus: '',
  reportedBy: null,
  resolvedAt: '',
  resourceId: null,
};

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

export default function MaintenanceLogCreate() {
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
        const maintenanceLog = await createMaintenanceLog(toRequestPayload(values));
        notifications.show('Maintenance log created successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        navigate(`/dashboard/maintenance-logs/${maintenanceLog.id}`);
      } catch (createError) {
        notifications.show(`Failed to create maintenance log. Reason: ${createError.message}`, {
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
      title="New Maintenance Log"
      breadcrumbs={[
        { title: 'Maintenance Logs', path: '/dashboard/maintenance-logs' },
        { title: 'New' },
      ]}
    >
      <MaintenanceLogForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
