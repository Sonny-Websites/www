// Basic utilities
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function disableButton(btn, label) {
  if (!btn) return;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  if (label) btn.dataset.originalLabel = btn.textContent || '';
  if (label) btn.textContent = label;
}

function enableButton(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.removeAttribute('aria-busy');
  if (btn.dataset.originalLabel) {
    btn.textContent = btn.dataset.originalLabel;
    delete btn.dataset.originalLabel;
  }
}

function initEmailLandingForm() {
  const form = document.getElementById('email-landing-form');
  if (!form) return;

  const emailInput = document.getElementById('email-landing-email');
  const responseEl = document.getElementById('email-landing-response');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!emailInput) return;
    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
      if (responseEl) {
        responseEl.textContent = 'Please enter a valid email address.';
      }
      emailInput.focus();
      return;
    }

    if (responseEl) {
      responseEl.textContent = '';
    }

    disableButton(submitBtn, 'Sending...');

    const formData = new FormData(form);
    formData.append('formName', 'email-landing');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(form.action || '/__forms/contact', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Non-2xx response');
      }

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        // ignore JSON parse issues; fall back to redirect
      }

      const redirectUrl =
        data && data.redirect
          ? data.redirect
          : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
              ? import.meta.env.BASE_URL
              : '/') + 'thank-you/';

      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Email landing form submission failed', err);
      enableButton(submitBtn);
      if (responseEl) {
        responseEl.textContent = 'Something went wrong sending your details. Please try again.';
      }
    }
  });
}

function initProjectBriefForm() {
  const form = document.getElementById('brief-landing-form');
  if (!form) return;

  const descriptionGroup = document.getElementById('brief-description-group');
  const emailGroup = document.getElementById('brief-email-group');
  const descriptionInput = document.getElementById('brief-description');
  const emailInput = document.getElementById('brief-email');
  const responseEl = document.getElementById('brief-landing-response');
  const submitBtn = form.querySelector('button[type="submit"]');

  let emailStage = false;

  if (emailGroup instanceof HTMLElement) {
    emailGroup.hidden = true;
    emailGroup.style.display = 'none';
  }
  if (descriptionGroup instanceof HTMLElement) {
    descriptionGroup.hidden = false;
    descriptionGroup.style.display = '';
  }
  if (emailInput) {
    emailInput.disabled = true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!emailStage) {
      const description =
        descriptionInput && 'value' in descriptionInput ? descriptionInput.value.trim() : '';

      if (!description || description.length < 10) {
        if (responseEl) {
          responseEl.textContent = 'Please add a bit more detail about your site or business.';
        }
        if (descriptionInput) {
          descriptionInput.focus();
        }
        return;
      }

      emailStage = true;

      if (descriptionGroup instanceof HTMLElement) {
        descriptionGroup.hidden = true;
        descriptionGroup.style.display = 'none';
      }
      if (emailGroup instanceof HTMLElement) {
        emailGroup.hidden = false;
        emailGroup.style.display = '';
      }
      if (emailInput) {
        emailInput.disabled = false;
        emailInput.focus();
      }
      if (submitBtn) {
        submitBtn.textContent = 'Submit';
      }

      return;
    }

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
      if (responseEl) {
        responseEl.textContent = 'Please enter a valid email address.';
      }
      emailInput.focus();
      return;
    }

    if (responseEl) {
      responseEl.textContent = '';
    }

    disableButton(submitBtn, 'Sending...');

    const formData = new FormData(form);
    formData.append('formName', 'project-brief-landing');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(form.action || '/__forms/contact', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Non-2xx response');
      }

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        // ignore JSON parse issues; fall back to redirect
      }

      const redirectUrl =
        data && data.redirect
          ? data.redirect
          : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
              ? import.meta.env.BASE_URL
              : '/') + 'thank-you/';

      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Project brief form submission failed', err);
      enableButton(submitBtn);
      if (responseEl) {
        responseEl.textContent = 'Something went wrong sending your project. Please try again.';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEmailLandingForm();
  initProjectBriefForm();
});

