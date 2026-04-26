import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function AmenityForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/amenities',
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

  const handleFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
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
            name="code"
            label="Code"
            value={formValues.code ?? ''}
            onChange={handleFieldChange}
            error={!!formErrors.code}
            helperText={formErrors.code ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="label"
            label="Label"
            value={formValues.label ?? ''}
            onChange={handleFieldChange}
            error={!!formErrors.label}
            helperText={formErrors.label ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="iconSlug"
            label="Icon slug"
            value={formValues.iconSlug ?? ''}
            onChange={handleFieldChange}
            error={!!formErrors.iconSlug}
            helperText={formErrors.iconSlug ?? ' '}
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

AmenityForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      code: PropTypes.string,
      iconSlug: PropTypes.string,
      label: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
