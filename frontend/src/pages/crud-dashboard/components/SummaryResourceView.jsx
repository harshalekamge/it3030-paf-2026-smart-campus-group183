import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAmenities,
  getAvailabilityWindows,
  getMaintenanceLogs,
  getResource,
  getResourceAmenities,
  getResourceMedia,
  getResourceType,
} from '../data/assetsApi';
import PageContainer from './PageContainer';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const API_PUBLIC_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
).replace(/\/api\/?$/, '');

function formatDate(value) {
  return value ? dayjs(value).format('MMM D, YYYY') : 'Not set';
}

function formatDateTime(value) {
  return value ? dayjs(value).format('MMM D, YYYY h:mm A') : 'Not set';
}

function formatTime(value) {
  return value ? dayjs(`2000-01-01T${value}`).format('h:mm A') : 'Not set';
}

function formatMoney(value) {
  if (value == null || value === '') {
    return 'Not set';
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function resolveMediaUrl(value) {
  if (!value) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  return `${API_PUBLIC_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function getStatusTone(resource) {
  if (resource?.isActive) {
    return { label: 'ACTIVE', color: '#45b36b' };
  }

  if (resource?.status) {
    return { label: String(resource.status).toUpperCase(), color: '#f59e0b' };
  }

  return { label: 'INACTIVE', color: '#64748b' };
}

function SectionCard({ title, subtitle, children, sx = undefined }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,255,0.96) 100%)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)',
        ...sx,
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {children}
    </Paper>
  );
}

function StatTile({ label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.85)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.8 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function DetailRow({ label, value }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'space-between', py: 1.25, gap: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function EmptyState({ message }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  );
}

function AvailabilityRow({ item }) {
  const label =
    item.specificDate || item.dayOfWeek == null
      ? formatDate(item.specificDate)
      : DAY_LABELS[item.dayOfWeek] ?? item.dayOfWeek;

  const schedule = item.isClosed
    ? 'Closed'
    : `${formatTime(item.openTime)} - ${formatTime(item.closeTime)}`;

  const note = item.note || 'No note';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.9)',
      }}
    >
      <Stack spacing={1.5} sx={{ height: '100%' }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(37, 99, 235, 0.08)',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {String(label).slice(0, 3)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {note}
          </Typography>
        </Box>
        <Chip
          label={schedule}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: item.isClosed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.06)',
            color: item.isClosed ? '#b91c1c' : 'text.primary',
          }}
        />
      </Stack>
    </Paper>
  );
}

export default function SummaryResourceView() {
  const { resourceId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    availabilityWindows: [],
    error: null,
    isLoading: true,
    maintenanceLogs: [],
    resource: null,
    resourceAmenities: [],
    resourceMedia: [],
    resourceType: null,
    amenities: [],
  });

  const loadData = React.useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      error: null,
      isLoading: true,
    }));

    try {
      const resource = await getResource(resourceId);

      const [
        resourceType,
        media,
        availabilityWindows,
        maintenanceLogs,
        amenities,
        resourceAmenities,
      ] = await Promise.all([
        resource.resourceTypeId ? getResourceType(resource.resourceTypeId) : Promise.resolve(null),
        getResourceMedia(),
        getAvailabilityWindows(),
        getMaintenanceLogs(),
        getAmenities(),
        getResourceAmenities(),
      ]);

      setState({
        amenities,
        availabilityWindows,
        error: null,
        isLoading: false,
        maintenanceLogs,
        resource,
        resourceAmenities,
        resourceMedia: media,
        resourceType,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        error,
        isLoading: false,
      }));
    }
  }, [resourceId]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadData]);

  const handleBack = React.useCallback(() => {
    navigate('/dashboard/resources');
  }, [navigate]);

  const handleEdit = React.useCallback(() => {
    navigate(`/dashboard/resources/${resourceId}/edit`);
  }, [navigate, resourceId]);

  const handleOpenRecord = React.useCallback(() => {
    navigate(`/dashboard/resources/${resourceId}`);
  }, [navigate, resourceId]);

  const resource = state.resource;
  const statusTone = getStatusTone(resource);
  const filteredMedia = React.useMemo(
    () => state.resourceMedia.filter((item) => item.resourceId === Number(resourceId)),
    [resourceId, state.resourceMedia],
  );
  const primaryMedia = React.useMemo(
    () =>
      filteredMedia.find((item) => item.isPrimary) ??
      (resource?.primaryImageUrl
        ? { url: resource.primaryImageUrl, caption: resource.name, mediaType: 'image' }
        : filteredMedia[0]),
    [filteredMedia, resource],
  );
  const primaryMediaUrl = React.useMemo(
    () => resolveMediaUrl(primaryMedia?.url),
    [primaryMedia?.url],
  );
  const filteredWindows = React.useMemo(
    () =>
      state.availabilityWindows
        .filter((item) => item.resourceId === Number(resourceId))
        .sort((left, right) => {
          if (left.specificDate && right.specificDate) {
            return left.specificDate.localeCompare(right.specificDate);
          }

          if (left.specificDate) {
            return 1;
          }

          if (right.specificDate) {
            return -1;
          }

          return (left.dayOfWeek ?? 99) - (right.dayOfWeek ?? 99);
        }),
    [resourceId, state.availabilityWindows],
  );
  const filteredMaintenance = React.useMemo(
    () =>
      state.maintenanceLogs
        .filter((item) => item.resourceId === Number(resourceId))
        .sort((left, right) => dayjs(right.startedAt).valueOf() - dayjs(left.startedAt).valueOf()),
    [resourceId, state.maintenanceLogs],
  );
  const amenityLookup = React.useMemo(
    () => new Map(state.amenities.map((item) => [item.id, item])),
    [state.amenities],
  );
  const assignedAmenities = React.useMemo(
    () =>
      state.resourceAmenities
        .filter((item) => item.resourceId === Number(resourceId))
        .map((item) => amenityLookup.get(item.amenityId))
        .filter(Boolean),
    [amenityLookup, resourceId, state.resourceAmenities],
  );

  return (
    <PageContainer
      title={resource ? `SRV | ${resource.name}` : 'SRV'}
      breadcrumbs={[
        { title: 'Resources', path: '/dashboard/resources' },
        resource ? { title: resource.name, path: `/dashboard/resources/${resourceId}` } : null,
        { title: 'SRV' },
      ].filter(Boolean)}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {state.isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : state.error ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            {state.error.message}
          </Alert>
        ) : resource ? (
          <Stack spacing={2.5} sx={{ width: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 5,
                border: '1px solid',
                borderColor: 'divider',
                background: `radial-gradient(circle at top left, ${alpha('#2563eb', 0.08)} 0%, rgba(255,255,255,0.96) 42%, rgba(248,250,252,0.98) 100%)`,
                boxShadow: '0 22px 60px rgba(15, 23, 42, 0.06)',
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
                >
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}
                    >
                      RESOURCES / SUMMARY RESOURCE VIEW
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800 }}>
                      {resource.name || 'Untitled Resource'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                      {resource.description ||
                        'A compact workspace summary for operations, booking, and upkeep.'}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusTone.label}
                    sx={{
                      alignSelf: { xs: 'flex-start', md: 'center' },
                      borderRadius: 999,
                      px: 1,
                      height: 34,
                      color: '#fff',
                      fontWeight: 700,
                      bgcolor: statusTone.color,
                    }}
                  />
                </Stack>
                <Divider />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                      Back to Resources
                    </Button>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>
                      Edit Resource
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<LaunchIcon />}
                      onClick={handleOpenRecord}
                    >
                      Open Standard View
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    SRV keeps the full resource profile in one read-only workspace.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <SectionCard
              title="Availability Snapshot"
              subtitle="Weekly rhythm and dated overrides for this resource"
            >
              {filteredWindows.length ? (
                <Grid container spacing={1.5}>
                  {filteredWindows.slice(0, 7).map((item) => (
                    <Grid
                      key={item.id ?? `${item.resourceId}-${item.dayOfWeek}-${item.specificDate}`}
                      size={{ xs: 12, sm: 6, md: 4, lg: Math.min(filteredWindows.length, 7) > 4 ? 3 : 4 }}
                    >
                      <AvailabilityRow item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState message="No availability windows are configured yet." />
              )}
            </SectionCard>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack spacing={2.5}>
                  <SectionCard
                    title="Basic Information"
                    subtitle="Core identification, ownership, and live operating flags"
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StatTile label="Resource ID" value={resource.id} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StatTile label="Code" value={resource.code || 'Not set'} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StatTile
                          label="Resource Type"
                          value={state.resourceType?.typeName || 'Not assigned'}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StatTile
                          label="Custodian ID"
                          value={resource.custodianId ?? 'Not assigned'}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={0.25}>
                      <DetailRow label="Status" value={resource.status || 'Not set'} />
                      <DetailRow label="Active" value={resource.isActive ? 'Yes' : 'No'} />
                      <DetailRow
                        label="Requires Approval"
                        value={resource.requiresApproval ? 'Yes' : 'No'}
                      />
                      <DetailRow
                        label="Accessible"
                        value={resource.isAccessible ? 'Yes' : 'No'}
                      />
                    </Stack>
                  </SectionCard>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Location & Capacity"
                        subtitle="Where the resource is and how many it supports"
                        sx={{ height: '100%' }}
                      >
                        <Stack spacing={0.25}>
                          <DetailRow label="Building" value={resource.building || 'Not assigned'} />
                          <DetailRow label="Floor" value={resource.floor ?? 'Not set'} />
                          <DetailRow label="Room No" value={resource.roomNo || 'Not set'} />
                          <DetailRow label="Capacity" value={resource.capacity ?? 'Not set'} />
                          <DetailRow
                            label="Min Capacity"
                            value={resource.minCapacity ?? 'Not set'}
                          />
                        </Stack>
                      </SectionCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Booking Rules"
                        subtitle="Availability rules and reservation thresholds"
                        sx={{ height: '100%' }}
                      >
                        <Stack spacing={0.25}>
                          <DetailRow
                            label="Max Booking Duration"
                            value={
                              resource.maxBookingDuration != null
                                ? `${resource.maxBookingDuration} mins`
                                : 'Not set'
                            }
                          />
                          <DetailRow
                            label="Advance Booking Days"
                            value={resource.advanceBookingDays ?? 'Not set'}
                          />
                          <DetailRow
                            label="Min Notice Minutes"
                            value={resource.minNoticeMinutes ?? 'Not set'}
                          />
                          <DetailRow
                            label="Default Open Time"
                            value={formatTime(resource.defaultOpenTime)}
                          />
                          <DetailRow
                            label="Default Close Time"
                            value={formatTime(resource.defaultCloseTime)}
                          />
                        </Stack>
                      </SectionCard>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Maintenance & Cost"
                        subtitle="Service history and lifecycle values"
                        sx={{ height: '100%' }}
                      >
                        <Stack spacing={0.25}>
                          <DetailRow
                            label="Replacement Cost"
                            value={formatMoney(resource.replacementCost)}
                          />
                          <DetailRow
                            label="Purchase Date"
                            value={formatDate(resource.purchaseDate)}
                          />
                          <DetailRow
                            label="Last Serviced At"
                            value={formatDate(resource.lastServicedAt)}
                          />
                          <DetailRow
                            label="Next Service Due"
                            value={formatDate(resource.nextServiceDue)}
                          />
                        </Stack>
                      </SectionCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Accessibility"
                        subtitle="Access notes and operational support details"
                        sx={{ height: '100%' }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Notes
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {resource.accessibilityNotes || 'No accessibility notes.'}
                        </Typography>
                      </SectionCard>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Media & Audit"
                        subtitle="Reference media and system timestamps"
                        sx={{ height: '100%' }}
                      >
                        <Stack spacing={0.25}>
                          <DetailRow
                            label="Primary Image URL"
                            value={
                              primaryMedia?.url ? (
                                <Link href={primaryMediaUrl} target="_blank" rel="noreferrer">
                                  Open media
                                </Link>
                              ) : (
                                'Not set'
                              )
                            }
                          />
                          <DetailRow
                            label="Created At"
                            value={formatDateTime(resource.createdAt)}
                          />
                          <DetailRow
                            label="Updated At"
                            value={formatDateTime(resource.updatedAt)}
                          />
                          <DetailRow
                            label="Tags"
                            value={resource.tags?.length ? resource.tags.join(', ') : 'Read only'}
                          />
                        </Stack>
                      </SectionCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SectionCard
                        title="Maintenance Pulse"
                        subtitle="Latest service activity linked to this resource"
                        sx={{ height: '100%' }}
                      >
                        {filteredMaintenance.length ? (
                          <Stack spacing={1.5}>
                            {filteredMaintenance.slice(0, 3).map((item) => (
                              <Paper
                                key={item.id}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 3,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                <Stack spacing={0.5}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                  >
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                      {item.category || 'Maintenance'}
                                    </Typography>
                                    <Chip
                                      label={item.newStatus || 'No status'}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.description || 'No maintenance description provided.'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Started {formatDateTime(item.startedAt)}
                                    {item.resolvedAt
                                      ? ` - Resolved ${formatDateTime(item.resolvedAt)}`
                                      : ''}
                                  </Typography>
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        ) : (
                          <EmptyState message="No maintenance logs are linked to this resource." />
                        )}
                      </SectionCard>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Stack spacing={2.5}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 5,
                      color: '#fff',
                      overflow: 'hidden',
                      position: 'relative',
                      background:
                        'linear-gradient(160deg, #172033 0%, #24324b 62%, #314762 100%)',
                      boxShadow: '0 28px 60px rgba(23, 32, 51, 0.32)',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -48,
                        right: -30,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        bgcolor: 'rgba(125, 211, 252, 0.14)',
                      }}
                    />
                    <Stack spacing={1.5} sx={{ position: 'relative' }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'rgba(191, 219, 254, 0.85)', letterSpacing: 1.1 }}
                      >
                        RESOURCE PREVIEW
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
                      >
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {resource.name || 'Untitled Resource'}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: 'rgba(226, 232, 240, 0.9)', mt: 0.5 }}
                          >
                            {state.resourceType?.typeName || 'Type not assigned yet'}
                          </Typography>
                        </Box>
                        <Chip
                          label={statusTone.label}
                          sx={{
                            bgcolor: statusTone.color,
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        />
                      </Stack>
                      <Box
                        sx={{
                          minHeight: 220,
                          borderRadius: 4,
                          border: '1px solid rgba(148, 163, 184, 0.18)',
                          bgcolor: 'rgba(148, 163, 184, 0.12)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'stretch',
                          justifyContent: 'center',
                        }}
                      >
                        {primaryMediaUrl ? (
                          <Box
                            component="img"
                            src={primaryMediaUrl}
                            alt={primaryMedia.caption || resource.name}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Stack
                            spacing={0.5}
                            sx={{ p: 3, alignSelf: 'flex-end', width: '100%' }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              No primary media yet
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(226, 232, 240, 0.8)' }}
                            >
                              Add a media URL or mark one item as primary to populate this panel.
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 6 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              bgcolor: 'rgba(148, 163, 184, 0.14)',
                              color: '#fff',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
                              Code
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                              {resource.code || 'Not set'}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              bgcolor: 'rgba(148, 163, 184, 0.14)',
                              color: '#fff',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
                              Location
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                              {resource.building && resource.roomNo
                                ? `${resource.building} / ${resource.roomNo}`
                                : resource.building || resource.roomNo || 'Not assigned'}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              bgcolor: 'rgba(148, 163, 184, 0.14)',
                              color: '#fff',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
                              Capacity
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                              {resource.capacity ?? 'Not set'}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              bgcolor: 'rgba(148, 163, 184, 0.14)',
                              color: '#fff',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
                              Approval
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                              {resource.requiresApproval ? 'Required' : 'Not required'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>

                  <SectionCard
                    title="Workspace Summary"
                    subtitle="A compact read on the live configuration"
                  >
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <StatTile label="Amenities" value={assignedAmenities.length} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <StatTile label="Windows" value={filteredWindows.length} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <StatTile label="Logs" value={filteredMaintenance.length} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <StatTile label="Media" value={filteredMedia.length} />
                      </Grid>
                    </Grid>
                  </SectionCard>

                  <SectionCard
                    title="Assigned Amenities"
                    subtitle="The resource experience at a glance"
                  >
                    {assignedAmenities.length ? (
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {assignedAmenities.map((amenity) => (
                          <Chip
                            key={amenity.id}
                            label={amenity.label}
                            variant="outlined"
                            sx={{ borderRadius: 2.5 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <EmptyState message="No amenities are assigned to this resource yet." />
                    )}
                  </SectionCard>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        ) : null}
      </Box>
    </PageContainer>
  );
}
