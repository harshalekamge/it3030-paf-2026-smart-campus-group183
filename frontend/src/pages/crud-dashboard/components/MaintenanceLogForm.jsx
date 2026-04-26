import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function MaintenanceLogForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/maintenance-logs',
}) {
  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event) => {
      const { name, value } = event.target;
      onFieldChange(name, value === '' ? null : Number(value));
    },
    [onFieldChange],
  );

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath);
  }, [backButtonPath, navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="resourceId"
            label="Resource ID"
            type="number"
            value={formValues.resourceId ?? ''}
            onChange={handleNumberFieldChange}
            error={!!formErrors.resourceId}
            helperText={formErrors.resourceId ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="reportedBy"
            label="Reported by"
            type="number"
            value={formValues.reportedBy ?? ''}
            onChange={handleNumberFieldChange}
            error={!!formErrors.reportedBy}
            helperText={formErrors.reportedBy ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="priorStatus"
            label="Prior status"
            value={formValues.priorStatus ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.priorStatus}
            helperText={formErrors.priorStatus ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="newStatus"
            label="New status"
            value={formValues.newStatus ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.newStatus}
            helperText={formErrors.newStatus ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="category"
            label="Category"
            value={formValues.category ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.category}
            helperText={formErrors.category ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="cost"
            label="Cost"
            type="number"
            value={formValues.cost ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.cost}
            helperText={formErrors.cost ?? ' '}
            fullWidth
            inputProps={{ min: 0, step: '0.01' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="resolvedAt"
            label="Resolved at"
            type="datetime-local"
            value={formValues.resolvedAt ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.resolvedAt}
            helperText={formErrors.resolvedAt ?? ' '}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="externalRef"
            label="External reference"
            value={formValues.externalRef ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.externalRef}
            helperText={formErrors.externalRef ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
          <TextField
            name="description"
            label="Description"
            value={formValues.description ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.description}
            helperText={formErrors.description ?? ' '}
            multiline
            minRows={4}
            fullWidth
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

MaintenanceLogForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      category: PropTypes.string,
      cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      externalRef: PropTypes.string,
      newStatus: PropTypes.string,
      priorStatus: PropTypes.string,
      reportedBy: PropTypes.number,
      resolvedAt: PropTypes.string,
      resourceId: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
