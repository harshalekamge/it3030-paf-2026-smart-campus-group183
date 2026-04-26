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
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function ResourceMediaForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/resource-media',
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
            name="displayOrder"
            label="Display order"
            type="number"
            value={formValues.displayOrder ?? ''}
            onChange={handleNumberFieldChange}
            error={!!formErrors.displayOrder}
            helperText={formErrors.displayOrder ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
          <TextField
            name="url"
            label="URL"
            value={formValues.url ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.url}
            helperText={formErrors.url ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="mediaType"
            label="Media type"
            value={formValues.mediaType ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.mediaType}
            helperText={formErrors.mediaType ?? 'Examples: IMAGE, VIDEO'}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl error={!!formErrors.isPrimary}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isPrimary"
                  checked={formValues.isPrimary ?? false}
                  onChange={handleCheckboxFieldChange}
                />
              }
              label="Primary media"
            />
            <FormHelperText>{formErrors.isPrimary ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
          <TextField
            name="caption"
            label="Caption"
            value={formValues.caption ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.caption}
            helperText={formErrors.caption ?? ' '}
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

ResourceMediaForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      caption: PropTypes.string,
      displayOrder: PropTypes.number,
      isPrimary: PropTypes.bool,
      mediaType: PropTypes.string,
      resourceId: PropTypes.number,
      url: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
