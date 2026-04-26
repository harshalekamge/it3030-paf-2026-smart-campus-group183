import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const DAY_OPTIONS = [
  { value: '', label: 'Not set' },
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function AvailabilityWindowForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/availability-windows',
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

  const handleCheckboxFieldChange = React.useCallback(
    (event, checked) => {
      onFieldChange(event.target.name, checked);
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value === '' ? null : Number(event.target.value));
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
          <FormControl error={!!formErrors.dayOfWeek} fullWidth>
            <InputLabel id="availability-window-day-label">Day of week</InputLabel>
            <Select
              labelId="availability-window-day-label"
              name="dayOfWeek"
              label="Day of week"
              value={formValues.dayOfWeek ?? ''}
              onChange={handleSelectFieldChange}
            >
              {DAY_OPTIONS.map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.dayOfWeek ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="specificDate"
            label="Specific date"
            type="date"
            value={formValues.specificDate ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.specificDate}
            helperText={formErrors.specificDate ?? ' '}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl error={!!formErrors.isClosed}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isClosed"
                  checked={formValues.isClosed ?? false}
                  onChange={handleCheckboxFieldChange}
                />
              }
              label="Closed"
            />
            <FormHelperText>{formErrors.isClosed ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="openTime"
            label="Open time"
            type="time"
            value={formValues.openTime ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.openTime}
            helperText={formErrors.openTime ?? ' '}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="closeTime"
            label="Close time"
            type="time"
            value={formValues.closeTime ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.closeTime}
            helperText={formErrors.closeTime ?? ' '}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="validUntil"
            label="Valid until"
            type="date"
            value={formValues.validUntil ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.validUntil}
            helperText={formErrors.validUntil ?? ' '}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
          <TextField
            name="note"
            label="Note"
            value={formValues.note ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.note}
            helperText={formErrors.note ?? ' '}
            multiline
            minRows={3}
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

AvailabilityWindowForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      closeTime: PropTypes.string,
      dayOfWeek: PropTypes.number,
      isClosed: PropTypes.bool,
      note: PropTypes.string,
      openTime: PropTypes.string,
      resourceId: PropTypes.number,
      specificDate: PropTypes.string,
      validUntil: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
