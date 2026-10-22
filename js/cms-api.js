/**
 * G.P. Pharmacy College — CMS API sync (Phase 2)
 * Fetches shared content from the server so all visitors see the same data.
 */
(function (global) {
  const config = global.GP_CMS_API || {};

  function getBaseUrl() {
    if (config.baseUrl) return String(config.baseUrl).replace(/\/$/, '');
    if (global.location?.origin) return global.location.origin;
    return '';
  }

  function apiUrl(path) {
    return `${getBaseUrl()}${path}`;
  }

  function isEnabled() {
    return Boolean(getBaseUrl());
  }

  async function fetchPublicContent() {
    const response = await fetch(apiUrl('/api/content/public'));
    if (!response.ok) throw new Error('Unable to load website content.');
    return response.json();
  }

  async function fetchAdminContent(token) {
    const response = await fetch(apiUrl('/api/content'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Unable to load admin content.');
    return response.json();
  }

  async function saveContent(payload, token) {
    const response = await fetch(apiUrl('/api/content'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Unable to save content to server.');
    }
    return response.json();
  }

  async function login(email, password) {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Login failed.');
    return data;
  }

  async function uploadImage(file, token) {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch(apiUrl('/api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.error || 'Upload failed.');
    return data.url;
  }

  async function bootstrap() {
    if (!isEnabled() || !global.GPCMS) return { mode: 'local' };

    const session = global.GPCMS.getSession?.();
    try {
      if (session?.apiToken) {
        const adminData = await fetchAdminContent(session.apiToken);
        global.GPCMS.applyRemoteData(adminData, { admin: true });
        return { mode: 'server', scope: 'admin' };
      }

      const publicData = await fetchPublicContent();
      global.GPCMS.applyRemoteData(publicData, { admin: false });
      return { mode: 'server', scope: 'public' };
    } catch (error) {
      console.warn('[CMSApi] Server unavailable, using local content.', error);
      return { mode: 'local', error };
    }
  }

  global.CMSApi = {
    isEnabled,
    bootstrap,
    login,
    saveContent,
    uploadImage,
    fetchPublicContent,
    fetchAdminContent,
  };
})(window);
