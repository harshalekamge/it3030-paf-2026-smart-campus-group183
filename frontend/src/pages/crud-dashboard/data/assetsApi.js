const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const errorMessage =
      payload?.message ||
      payload?.error ||
      (typeof payload === 'string' && payload) ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return payload?.data ?? payload;
}

export async function getResourceTypes() {
  return request('/resource-types');
}

export async function getResources() {
  return request('/resources');
}

export async function getResource(resourceId) {
  return request(`/resources/${resourceId}`);
}

export async function createResource(resource) {
  return request('/resources', {
    method: 'POST',
    body: JSON.stringify(resource),
  });
}

export async function updateResource(resourceId, resource) {
  return request(`/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(resource),
  });
}

export async function deleteResource(resourceId) {
  return request(`/resources/${resourceId}`, {
    method: 'DELETE',
  });
}

export async function getResourceType(resourceTypeId) {
  return request(`/resource-types/${resourceTypeId}`);
}

export async function createResourceType(resourceType) {
  return request('/resource-types', {
    method: 'POST',
    body: JSON.stringify(resourceType),
  });
}

export async function updateResourceType(resourceTypeId, resourceType) {
  return request(`/resource-types/${resourceTypeId}`, {
    method: 'PUT',
    body: JSON.stringify(resourceType),
  });
}

export async function deleteResourceType(resourceTypeId) {
  return request(`/resource-types/${resourceTypeId}`, {
    method: 'DELETE',
  });
}

export async function getResourceMedia() {
  return request('/resource-media');
}

export async function getResourceMediaById(resourceMediaId) {
  return request(`/resource-media/${resourceMediaId}`);
}

export async function createResourceMedia(resourceMedia) {
  return request('/resource-media', {
    method: 'POST',
    body: JSON.stringify(resourceMedia),
  });
}

export async function updateResourceMedia(resourceMediaId, resourceMedia) {
  return request(`/resource-media/${resourceMediaId}`, {
    method: 'PUT',
    body: JSON.stringify(resourceMedia),
  });
}

export async function deleteResourceMedia(resourceMediaId) {
  return request(`/resource-media/${resourceMediaId}`, {
    method: 'DELETE',
  });
}

export async function getAvailabilityWindows() {
  return request('/availability-windows');
}

export async function getAvailabilityWindow(availabilityWindowId) {
  return request(`/availability-windows/${availabilityWindowId}`);
}

export async function createAvailabilityWindow(availabilityWindow) {
  return request('/availability-windows', {
    method: 'POST',
    body: JSON.stringify(availabilityWindow),
  });
}

export async function updateAvailabilityWindow(availabilityWindowId, availabilityWindow) {
  return request(`/availability-windows/${availabilityWindowId}`, {
    method: 'PUT',
    body: JSON.stringify(availabilityWindow),
  });
}

export async function deleteAvailabilityWindow(availabilityWindowId) {
  return request(`/availability-windows/${availabilityWindowId}`, {
    method: 'DELETE',
  });
}

export async function getMaintenanceLogs() {
  return request('/maintenance-logs');
}

export async function getMaintenanceLog(maintenanceLogId) {
  return request(`/maintenance-logs/${maintenanceLogId}`);
}

export async function createMaintenanceLog(maintenanceLog) {
  return request('/maintenance-logs', {
    method: 'POST',
    body: JSON.stringify(maintenanceLog),
  });
}

export async function updateMaintenanceLog(maintenanceLogId, maintenanceLog) {
  return request(`/maintenance-logs/${maintenanceLogId}`, {
    method: 'PUT',
    body: JSON.stringify(maintenanceLog),
  });
}

export async function deleteMaintenanceLog(maintenanceLogId) {
  return request(`/maintenance-logs/${maintenanceLogId}`, {
    method: 'DELETE',
  });
}

export async function getAmenities() {
  return request('/amenities');
}

export async function getAmenity(amenityId) {
  return request(`/amenities/${amenityId}`);
}

export async function createAmenity(amenity) {
  return request('/amenities', {
    method: 'POST',
    body: JSON.stringify(amenity),
  });
}

export async function updateAmenity(amenityId, amenity) {
  return request(`/amenities/${amenityId}`, {
    method: 'PUT',
    body: JSON.stringify(amenity),
  });
}

export async function deleteAmenity(amenityId) {
  return request(`/amenities/${amenityId}`, {
    method: 'DELETE',
  });
}

export async function getResourceAmenities() {
  return request('/resource-amenities');
}
