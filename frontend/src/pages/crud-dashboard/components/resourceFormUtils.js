export const INITIAL_RESOURCE_FORM_VALUES = {
  resourceTypeId: '',
  custodianId: '',
  name: '',
  code: '',
  description: '',
  tagsText: '',
  building: '',
  floor: '',
  roomNo: '',
  capacity: '',
  minCapacity: '',
  status: '',
  isActive: true,
  purchaseDate: '',
  lastServicedAt: '',
  nextServiceDue: '',
  replacementCost: '',
  maxBookingDuration: '',
  advanceBookingDays: '',
  requiresApproval: false,
  minNoticeMinutes: '',
  defaultOpenTime: '',
  defaultCloseTime: '',
  isAccessible: false,
  accessibilityNotes: '',
  primaryImageUrl: '',
};

function normalizeInteger(value) {
  if (value === '' || value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

function normalizeDecimal(value) {
  if (value === '' || value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeOptionalString(value) {
  const normalized = normalizeString(value);
  return normalized ? normalized : null;
}

function normalizeOptionalDate(value) {
  return value ? value : null;
}

function normalizeOptionalTime(value) {
  return value ? value : null;
}

function normalizeTags(tagsText) {
  if (!tagsText?.trim()) {
    return null;
  }

  const tags = tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : null;
}

export function validateResource(values) {
  const errors = {};

  if (!values.resourceTypeId || Number(values.resourceTypeId) <= 0) {
    errors.resourceTypeId = 'Resource type ID must be greater than 0.';
  }

  if (!values.name?.trim()) {
    errors.name = 'Name is required.';
  }

  if (!values.code?.trim()) {
    errors.code = 'Code is required.';
  }

  if (values.custodianId && Number(values.custodianId) <= 0) {
    errors.custodianId = 'Custodian ID must be greater than 0.';
  }

  [
    ['floor', 'Floor'],
    ['capacity', 'Capacity'],
    ['minCapacity', 'Minimum capacity'],
    ['maxBookingDuration', 'Max booking duration'],
    ['advanceBookingDays', 'Advance booking days'],
    ['minNoticeMinutes', 'Minimum notice minutes'],
  ].forEach(([field, label]) => {
    if (values[field] !== '' && Number.isNaN(Number(values[field]))) {
      errors[field] = `${label} must be a number.`;
    }
  });

  if (values.replacementCost !== '' && Number.isNaN(Number(values.replacementCost))) {
    errors.replacementCost = 'Replacement cost must be a number.';
  }

  return errors;
}

export function buildResourcePayload(values) {
  return {
    resourceTypeId: normalizeInteger(values.resourceTypeId),
    custodianId: normalizeInteger(values.custodianId),
    name: normalizeString(values.name),
    code: normalizeString(values.code),
    description: normalizeOptionalString(values.description),
    tags: normalizeTags(values.tagsText),
    building: normalizeOptionalString(values.building),
    floor: normalizeInteger(values.floor),
    roomNo: normalizeOptionalString(values.roomNo),
    capacity: normalizeInteger(values.capacity),
    minCapacity: normalizeInteger(values.minCapacity),
    status: normalizeOptionalString(values.status),
    isActive: Boolean(values.isActive),
    purchaseDate: normalizeOptionalDate(values.purchaseDate),
    lastServicedAt: normalizeOptionalDate(values.lastServicedAt),
    nextServiceDue: normalizeOptionalDate(values.nextServiceDue),
    replacementCost: normalizeDecimal(values.replacementCost),
    maxBookingDuration: normalizeInteger(values.maxBookingDuration),
    advanceBookingDays: normalizeInteger(values.advanceBookingDays),
    requiresApproval: Boolean(values.requiresApproval),
    minNoticeMinutes: normalizeInteger(values.minNoticeMinutes),
    defaultOpenTime: normalizeOptionalTime(values.defaultOpenTime),
    defaultCloseTime: normalizeOptionalTime(values.defaultCloseTime),
    isAccessible: Boolean(values.isAccessible),
    accessibilityNotes: normalizeOptionalString(values.accessibilityNotes),
    primaryImageUrl: normalizeOptionalString(values.primaryImageUrl),
  };
}

export function mapResourceToFormValues(resource) {
  return {
    resourceTypeId: resource.resourceTypeId?.toString() ?? '',
    custodianId: resource.custodianId?.toString() ?? '',
    name: resource.name ?? '',
    code: resource.code ?? '',
    description: resource.description ?? '',
    tagsText: resource.tags?.join(', ') ?? '',
    building: resource.building ?? '',
    floor: resource.floor?.toString() ?? '',
    roomNo: resource.roomNo ?? '',
    capacity: resource.capacity?.toString() ?? '',
    minCapacity: resource.minCapacity?.toString() ?? '',
    status: resource.status ?? '',
    isActive: resource.isActive ?? true,
    purchaseDate: resource.purchaseDate ?? '',
    lastServicedAt: resource.lastServicedAt ?? '',
    nextServiceDue: resource.nextServiceDue ?? '',
    replacementCost: resource.replacementCost?.toString() ?? '',
    maxBookingDuration: resource.maxBookingDuration?.toString() ?? '',
    advanceBookingDays: resource.advanceBookingDays?.toString() ?? '',
    requiresApproval: resource.requiresApproval ?? false,
    minNoticeMinutes: resource.minNoticeMinutes?.toString() ?? '',
    defaultOpenTime: resource.defaultOpenTime ?? '',
    defaultCloseTime: resource.defaultCloseTime ?? '',
    isAccessible: resource.isAccessible ?? false,
    accessibilityNotes: resource.accessibilityNotes ?? '',
    primaryImageUrl: resource.primaryImageUrl ?? '',
  };
}
