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

export default function ResourceTypeForm({
  formState,
  onFieldChange,
  onSubmit,
  submitButtonLabel,
  backButtonPath = '/dashboard/resource-types',
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
            name="typeCode"
            label="Type code"
            value={formValues.typeCode ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.typeCode}
            helperText={formErrors.typeCode ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="typeName"
            label="Type name"
            value={formValues.typeName ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.typeName}
            helperText={formErrors.typeName ?? ' '}
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
            minRows={3}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
          <TextField
            name="iconSlug"
            label="Icon slug"
            value={formValues.iconSlug ?? ''}
            onChange={handleTextFieldChange}
            error={!!formErrors.iconSlug}
            helperText={formErrors.iconSlug ?? ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={1}>
            <FormControl error={!!formErrors.requiresCapacity}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="requiresCapacity"
                    checked={formValues.requiresCapacity ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Requires capacity"
              />
              <FormHelperText>{formErrors.requiresCapacity ?? ' '}</FormHelperText>
            </FormControl>
            <FormControl error={!!formErrors.requiresLocation}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="requiresLocation"
                    checked={formValues.requiresLocation ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Requires location"
              />
              <FormHelperText>{formErrors.requiresLocation ?? ' '}</FormHelperText>
            </FormControl>
            <FormControl error={!!formErrors.isEquipment}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isEquipment"
                    checked={formValues.isEquipment ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Is equipment"
              />
              <FormHelperText>{formErrors.isEquipment ?? ' '}</FormHelperText>
            </FormControl>
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

ResourceTypeForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.shape({
      description: PropTypes.string,
      iconSlug: PropTypes.string,
      isEquipment: PropTypes.bool,
      requiresCapacity: PropTypes.bool,
      requiresLocation: PropTypes.bool,
      typeCode: PropTypes.string,
      typeName: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};
