/**
 * Admin media helpers — image URL fields, previews, optional Cloudinary upload.
 * Phase 1: paste URL or upload to Cloudinary (configure cms-media-config.js).
 */
(function (global) {
  const config = global.GP_CMS_MEDIA || {};

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(s) {
    return esc(s).replace(/'/g, '&#39;');
  }

  function isCloudinaryReady() {
    return Boolean(config.cloudinary?.cloudName && config.cloudinary?.uploadPreset);
  }

  function renderImageField({ name, label, value = '', hint = '', required = false } = {}) {
    const id = `cms-img-${name}-${uid()}`;
    const uploadHint = isCloudinaryReady()
      ? 'Choose a file to upload directly to Cloudinary, or paste an image URL.'
      : 'Upload to <a href="https://imgbb.com" target="_blank" rel="noopener">ImgBB</a> or <a href="https://cloudinary.com" target="_blank" rel="noopener">Cloudinary</a>, copy the link, and paste it below.';

    return `
      <div class="cms-field cms-image-field" data-cms-image-field>
        <label for="${id}">${esc(label)}${required ? ' <span class="cms-required">*</span>' : ''}</label>
        ${hint ? `<small class="cms-field__hint">${hint}</small>` : ''}
        <div class="cms-image-field__controls">
          <input type="url" id="${id}" name="${escAttr(name)}" class="cms-image-field__input" value="${escAttr(value)}" placeholder="https://..." ${required ? 'required' : ''}>
          <label class="cms-btn cms-btn--outline cms-btn--sm cms-image-field__upload">
            <span class="cms-image-field__upload-text">Choose File</span>
            <input type="file" class="cms-image-field__file" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
          </label>
        </div>
        <div class="cms-image-field__preview" data-preview hidden></div>
        <small class="cms-field__hint cms-field__hint--muted">${uploadHint}</small>
      </div>`;
  }

  function renderSlidesField({ name, label, values = [] } = {}) {
    const slides = values.length ? values : [''];
    return `
      <div class="cms-field cms-slides-field" data-cms-slides-field data-sync-name="${escAttr(name)}">
        <label>${esc(label)}</label>
        <small class="cms-field__hint">One hero banner image per row.</small>
        <div class="cms-slides-field__list" data-slides-list>
          ${slides.map((url, index) => renderSlideRow(url, index)).join('')}
        </div>
        <button type="button" class="cms-btn cms-btn--outline cms-btn--sm" data-add-slide>+ Add Slide</button>
        <textarea name="${escAttr(name)}" class="cms-slides-field__sync" hidden>${esc(values.join('\n'))}</textarea>
      </div>`;
  }

  function renderSlideRow(url, index) {
    return `
      <div class="cms-slide-row" data-slide-row>
        <span class="cms-slide-row__num">${index + 1}</span>
        <div class="cms-image-field cms-image-field--inline" data-cms-image-field>
          <div class="cms-image-field__controls">
            <input type="url" class="cms-image-field__input" value="${escAttr(url)}" placeholder="Slide image URL">
            <label class="cms-btn cms-btn--outline cms-btn--sm cms-image-field__upload">
              <span class="cms-image-field__upload-text">Upload</span>
              <input type="file" class="cms-image-field__file" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
            </label>
          </div>
          <div class="cms-image-field__preview cms-image-field__preview--thumb" data-preview hidden></div>
        </div>
        <button type="button" class="cms-btn cms-btn--ghost cms-btn--sm" data-remove-slide ${index === 0 ? 'hidden' : ''} aria-label="Remove slide">&times;</button>
      </div>`;
  }

  function renderMediaGuide() {
    const cloudReady = isCloudinaryReady();
    return `
      <div class="cms-guide">
        <h3>How to add photos &amp; content</h3>
        <ol class="cms-guide__steps">
          <li><strong>Text content</strong> — edit Homepage, About, Notices, Events, News, Contact in the left menu, then click <em>Save</em>.</li>
          <li><strong>Images (quick)</strong> — upload photo to <a href="https://imgbb.com" target="_blank" rel="noopener">ImgBB</a>, copy <em>Direct link</em>, paste in the image field.</li>
          <li><strong>Images (direct upload)</strong> — ${cloudReady ? 'use the <em>Choose File</em> button in any image field (Cloudinary is configured).' : 'add your Cloudinary keys in <code>js/cms-media-config.js</code> to enable <em>Choose File</em> upload.'}</li>
          <li><strong>Gallery</strong> — Admin → Website → Gallery → Add Photo/Video.</li>
          <li><strong>Share changes</strong> — click <em>Export</em> (top right), send the JSON file to IT, or use <em>Import</em> on another computer.</li>
        </ol>
        <p class="cms-guide__note">When the API is configured in <code>js/cms-api-config.js</code>, content syncs to the server for all visitors. Export regularly as backup.</p>
      </div>`;
  }

  function bindImageFields(root = document) {
    root.querySelectorAll('[data-cms-image-field]').forEach(bindImageField);
    root.querySelectorAll('[data-cms-slides-field]').forEach(bindSlidesField);
  }

  function bindImageField(field) {
    const input = field.querySelector('.cms-image-field__input');
    const fileInput = field.querySelector('.cms-image-field__file');
    const preview = field.querySelector('[data-preview]');
    if (!input || !preview) return;

    const updatePreview = () => {
      const url = input.value.trim();
      if (!url || !/^https?:\/\//i.test(url)) {
        preview.hidden = true;
        preview.innerHTML = '';
        return;
      }
      preview.hidden = false;
      preview.innerHTML = `<img src="${escAttr(url)}" alt="Preview" loading="lazy">`;
    };

    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
    updatePreview();

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const uploadText = field.querySelector('.cms-image-field__upload-text');
      const original = uploadText?.textContent || 'Choose File';

      try {
        if (uploadText) uploadText.textContent = 'Uploading...';
        const url = await uploadImage(file);
        input.value = global.GPImages?.optimize?.(url, { width: 1200 }) || url;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        showToast(field, 'Image uploaded successfully.', 'success');
      } catch (error) {
        showToast(field, error.message || 'Upload failed.', 'error');
      } finally {
        if (uploadText) uploadText.textContent = original;
        fileInput.value = '';
      }
    });
  }

  function bindSlidesField(wrapper) {
    const list = wrapper.querySelector('[data-slides-list]');
    const sync = wrapper.querySelector('.cms-slides-field__sync');
    if (!list || !sync) return;

    const syncSlides = () => {
      const urls = [...list.querySelectorAll('.cms-image-field__input')]
        .map((input) => input.value.trim())
        .filter(Boolean);
      sync.value = urls.join('\n');
    };

    wrapper.addEventListener('input', (event) => {
      if (event.target.matches('.cms-image-field__input')) syncSlides();
    });

    wrapper.querySelector('[data-add-slide]')?.addEventListener('click', () => {
      const row = document.createElement('div');
      row.innerHTML = renderSlideRow('', list.children.length).trim();
      const slideRow = row.firstElementChild;
      list.appendChild(slideRow);
      bindImageField(slideRow.querySelector('[data-cms-image-field]'));
      refreshSlideNumbers(list);
      syncSlides();
    });

    list.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-remove-slide]');
      if (!btn) return;
      btn.closest('[data-slide-row]')?.remove();
      refreshSlideNumbers(list);
      syncSlides();
    });

    list.querySelectorAll('[data-cms-image-field]').forEach(bindImageField);
    syncSlides();
  }

  function refreshSlideNumbers(list) {
    [...list.querySelectorAll('[data-slide-row]')].forEach((row, index) => {
      const num = row.querySelector('.cms-slide-row__num');
      const removeBtn = row.querySelector('[data-remove-slide]');
      if (num) num.textContent = String(index + 1);
      if (removeBtn) removeBtn.hidden = index === 0;
    });
  }

  async function uploadImage(file) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please choose a JPG, PNG, WebP, or GIF image.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5 MB.');
    }

    const session = global.GPCMS?.getSession?.();
    if (global.CMSApi?.isEnabled?.() && session?.apiToken) {
      return global.CMSApi.uploadImage(file, session.apiToken);
    }

    if (isCloudinaryReady()) {
      return uploadToCloudinary(file);
    }

    return uploadToImgBB(file);
  }

  async function uploadToCloudinary(file) {
    const { cloudName, uploadPreset } = config.cloudinary;
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Cloudinary upload failed.');
    }
    return data.secure_url;
  }

  async function uploadToImgBB(file) {
    const apiKey = config.imgbb?.apiKey;
    if (!apiKey) {
      throw new Error('Direct upload is not configured. Paste an image URL from ImgBB or Cloudinary instead.');
    }

    const body = new FormData();
    body.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.data?.url) {
      throw new Error(data?.error?.message || 'ImgBB upload failed.');
    }
    return data.data.url;
  }

  function showToast(field, message, type) {
    let toast = field.querySelector('.cms-image-field__toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cms-image-field__toast';
      field.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `cms-image-field__toast cms-image-field__toast--${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function uid() {
    return Math.random().toString(36).slice(2, 8);
  }

  global.CMSMedia = {
    renderImageField,
    renderSlidesField,
    renderMediaGuide,
    bindImageFields,
    isCloudinaryReady,
  };
})(window);
