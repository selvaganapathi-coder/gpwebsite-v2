/**
 * G.P. Pharmacy College — Contact enquiry form
 */
(function () {
  const config = window.GP_CONTACT || {};
  const limits = {
    nameMin: 2,
    nameMax: 80,
    messageMax: 1000,
    ...config.limits,
  };

  let submitController = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const statusEl = document.getElementById('contactFormStatus');
    const submitBtn = form.querySelector('[type="submit"]');
    const messageField = form.querySelector('#message');
    const counterEl = document.getElementById('messageCounter');

    form.setAttribute('novalidate', '');

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field, { showError: true }));
      field.addEventListener('input', () => {
        clearFieldError(field);
        if (statusEl && !statusEl.hidden) hideStatus(statusEl);
      });
    });

    messageField?.addEventListener('input', () => updateMessageCounter(messageField, counterEl));
    updateMessageCounter(messageField, counterEl);

    form.addEventListener('submit', (event) => handleSubmit(event, form, statusEl, submitBtn));
  }

  function handleSubmit(event, form, statusEl, submitBtn) {
    event.preventDefault();
    hideStatus(statusEl);

    if (form.querySelector('[name="_honey"]')?.value) return;

    const fields = [...form.querySelectorAll('input, select, textarea')].filter(
      (field) => field.name && field.name !== '_honey' && !field.disabled,
    );

    const isValid = fields.every((field) => validateField(field, { showError: true }));
    if (!isValid) {
      const firstInvalid = form.querySelector('.form-group--error input, .form-group--error select, .form-group--error textarea');
      firstInvalid?.focus();
      showStatus(statusEl, 'Please correct the highlighted fields and try again.', 'error');
      return;
    }

    if (!config.recipientEmail) {
      showStatus(statusEl, 'Contact form is not configured. Please call the college directly.', 'error');
      return;
    }

    void sendEnquiry(form, statusEl, submitBtn);
  }

  async function sendEnquiry(form, statusEl, submitBtn) {
    submitController?.abort();
    submitController = new AbortController();

    const payload = buildPayload(form);
    const originalLabel = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(config.recipientEmail)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal: submitController.signal,
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to send your enquiry right now.');
      }

      form.reset();
      form.querySelectorAll('.form-group').forEach((group) => group.classList.remove('form-group--error'));
      form.querySelectorAll('.form-error').forEach((error) => {
        error.textContent = '';
        error.hidden = true;
      });
      updateMessageCounter(form.querySelector('#message'), document.getElementById('messageCounter'));
      showStatus(
        statusEl,
        'Thank you! Your enquiry has been sent. A confirmation email has been sent to your inbox.',
        'success',
      );
    } catch (error) {
      if (error.name === 'AbortError') return;
      showStatus(
        statusEl,
        error.message || 'Something went wrong. Please try again or call +91 94434 37487.',
        'error',
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      submitBtn.textContent = originalLabel;
    }
  }

  function buildPayload(form) {
    const fd = new FormData(form);
    const name = cleanText(fd.get('name'));
    const phone = cleanText(fd.get('phone'));
    const email = cleanText(fd.get('email'));
    const courseKey = cleanText(fd.get('course'));
    const message = cleanText(fd.get('message'));
    const course = config.courseLabels?.[courseKey] || courseKey || 'Not specified';

    return {
      name,
      email,
      phone,
      course,
      message: message || 'No message provided.',
      _subject: `${config.subject || 'New Enquiry — G.P. Pharmacy College'} — ${name}`,
      _autoresponse: buildAutoResponse(name),
      _template: 'table',
      _captcha: 'false',
    };
  }

  function buildAutoResponse(name) {
    const template = config.autoResponseTemplate || config.autoResponse || '';
    if (template.includes('{{name}}')) {
      return template.replace(/\{\{name\}\}/g, name);
    }
    return `Dear ${name},\n\n${template}`;
  }

  function validateField(field, { showError = false } = {}) {
    const value = cleanText(field.value);
    const group = field.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    let message = '';

    if (field.required && !value) {
      message = 'This field is required.';
    } else if (field.name === 'name' && value) {
      if (value.length < limits.nameMin) message = `Name must be at least ${limits.nameMin} characters.`;
      else if (value.length > limits.nameMax) message = `Name must be under ${limits.nameMax} characters.`;
    } else if (field.name === 'phone' && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) {
        message = 'Enter a valid phone number (10–13 digits).';
      }
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
      message = 'Enter a valid email address.';
    } else if (field.name === 'message' && value.length > limits.messageMax) {
      message = `Message must be under ${limits.messageMax} characters.`;
    }

    if (showError) setFieldError(group, errorEl, field, message);
    return !message;
  }

  function setFieldError(group, errorEl, field, message) {
    if (!group || !errorEl) return;
    const hasError = Boolean(message);
    group.classList.toggle('form-group--error', hasError);
    errorEl.textContent = message;
    errorEl.hidden = !hasError;
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function clearFieldError(field) {
    const group = field.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    if (!group?.classList.contains('form-group--error')) return;
    setFieldError(group, errorEl, field, '');
  }

  function updateMessageCounter(field, counterEl) {
    if (!field || !counterEl) return;
    const remaining = limits.messageMax - field.value.length;
    counterEl.textContent = `${field.value.length} / ${limits.messageMax}`;
    counterEl.classList.toggle('form-counter--limit', remaining < 50);
  }

  function showStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `form-status form-status--${type}`;
    el.hidden = false;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  }

  function hideStatus(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
    el.removeAttribute('role');
    el.removeAttribute('aria-live');
  }

  function cleanText(value) {
    return String(value ?? '').trim();
  }

  function isValidEmail(value) {
    return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
  }
})();
