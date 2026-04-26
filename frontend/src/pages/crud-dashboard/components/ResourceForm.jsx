import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function ResourceForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/resources',
}) {
  const navigate = useNavigate();
  const formValues = formState.values;
  const formErrors = formState.errors;

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

  const handleTextChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleCheckboxChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.checked);
    },
    [onFieldChange],
  );

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath);
  }, [backButtonPath, navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="resourceTypeId"
            label="Resource Type ID"
            type="number"
            value={formValues.resourceTypeId ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.resourceTypeId}
            helperText={formErrors.resourceTypeId ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="custodianId"
            label="Custodian ID"
            type="number"
            value={formValues.custodianId ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.custodianId}
            helperText={formErrors.custodianId ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="status"
            label="Status"
            value={formValues.status ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.status}
            helperText={formErrors.status ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="name"
            label="Name"
            value={formValues.name ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.name}
            helperText={formErrors.name ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="code"
            label="Code"
            value={formValues.code ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.code}
            helperText={formErrors.code ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="description"
            label="Description"
            value={formValues.description ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.description}
            helperText={formErrors.description ?? ' '}
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="tagsText"
            label="Tags"
            value={formValues.tagsText ?? ''}
            onChange={handleTextChange}
            helperText="Enter comma-separated tags."
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="building"
            label="Building"
            value={formValues.building ?? ''}
            onChange={handleTextChange}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="floor"
            label="Floor"
            type="number"
            value={formValues.floor ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.floor}
            helperText={formErrors.floor ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="roomNo"
            label="Room No"
            value={formValues.roomNo ?? ''}
            onChange={handleTextChange}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="capacity"
            label="Capacity"
            type="number"
            value={formValues.capacity ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.capacity}
            helperText={formErrors.capacity ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="minCapacity"
            label="Minimum Capacity"
            type="number"
            value={formValues.minCapacity ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.minCapacity}
            helperText={formErrors.minCapacity ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="replacementCost"
            label="Replacement Cost"
            type="number"
            value={formValues.replacementCost ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.replacementCost}
            helperText={formErrors.replacementCost ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="purchaseDate"
            label="Purchase Date"
            type="date"
            value={formValues.purchaseDate ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="lastServicedAt"
            label="Last Serviced At"
            type="date"
            value={formValues.lastServicedAt ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="nextServiceDue"
            label="Next Service Due"
            type="date"
            value={formValues.nextServiceDue ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="maxBookingDuration"
            label="Max Booking Duration"
            type="number"
            value={formValues.maxBookingDuration ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.maxBookingDuration}
            helperText={formErrors.maxBookingDuration ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="advanceBookingDays"
            label="Advance Booking Days"
            type="number"
            value={formValues.advanceBookingDays ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.advanceBookingDays}
            helperText={formErrors.advanceBookingDays ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="minNoticeMinutes"
            label="Min Notice Minutes"
            type="number"
            value={formValues.minNoticeMinutes ?? ''}
            onChange={handleTextChange}
            error={!!formErrors.minNoticeMinutes}
            helperText={formErrors.minNoticeMinutes ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="defaultOpenTime"
            label="Default Open Time"
            type="time"
            value={formValues.defaultOpenTime ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="defaultCloseTime"
            label="Default Close Time"
            type="time"
            value={formValues.defaultCloseTime ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="primaryImageUrl"
            label="Primary Image URL"
            value={formValues.primaryImageUrl ?? ''}
            onChange={handleTextChange}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="accessibilityNotes"
            label="Accessibility Notes"
            value={formValues.accessibilityNotes ?? ''}
            onChange={handleTextChange}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formValues.isActive)}
                  onChange={handleCheckboxChange}
                  name="isActive"
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formValues.requiresApproval)}
                  onChange={handleCheckboxChange}
                  name="requiresApproval"
                />
              }
              label="Requires Approval"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formValues.isAccessible)}
                  onChange={handleCheckboxChange}
                  name="isAccessible"
                />
              }
              label="Accessible"
            />
          </Stack>
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

ResourceForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
