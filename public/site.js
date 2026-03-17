function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-11552877667/nDyCCPb0_MYbEOPY64Qr',
      'value': 1.0,
      'currency': 'USD',
      'event_callback': callback
  });
  return false;
}

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

function showFormSuccess(form, responseEl, message) {
  form.classList.add('form-submitted');
  var groups = form.querySelectorAll('.form-group, .form-step-indicator, button[type="submit"], input[name="_hp"]');
  for (var i = 0; i < groups.length; i++) {
    groups[i].style.display = 'none';
  }
  if (responseEl) {
    responseEl.innerHTML = '';
    responseEl.className = 'form-response form-success';
    var check = document.createElement('div');
    check.className = 'form-success-icon';
    check.textContent = '\u2713';
    var msg = document.createElement('p');
    msg.className = 'form-success-text';
    msg.textContent = message;
    responseEl.appendChild(check);
    responseEl.appendChild(msg);
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
        responseEl.className = 'form-response';
      }
      emailInput.focus();
      return;
    }

    if (responseEl) {
      responseEl.textContent = '';
      responseEl.className = 'form-response';
    }

    disableButton(submitBtn, 'Sending...');

    const body = new URLSearchParams(new FormData(form));
    body.append('formName', 'email-landing');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(form.action || '/__forms/contact', {
        method: 'POST',
        body: body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Non-2xx response');
      }

      showFormSuccess(form, responseEl, 'Thanks! Sonny will be in touch shortly.');
      gtag_report_conversion();
    } catch (err) {
      console.error('Email landing form submission failed', err);
      enableButton(submitBtn);
      if (responseEl) {
        responseEl.textContent = 'Something went wrong sending your details. Please try again.';
        responseEl.className = 'form-response';
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
          responseEl.className = 'form-response';
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
      if (responseEl) {
        responseEl.textContent = '';
        responseEl.className = 'form-response';
      }

      return;
    }

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
      if (responseEl) {
        responseEl.textContent = 'Please enter a valid email address.';
        responseEl.className = 'form-response';
      }
      emailInput.focus();
      return;
    }

    if (responseEl) {
      responseEl.textContent = '';
      responseEl.className = 'form-response';
    }

    disableButton(submitBtn, 'Sending...');

    const body = new URLSearchParams(new FormData(form));
    body.append('formName', 'project-brief-landing');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(form.action || '/__forms/contact', {
        method: 'POST',
        body: body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Non-2xx response');
      }

      showFormSuccess(form, responseEl, 'Thanks! Sonny will review your brief and get back to you shortly.');
      gtag_report_conversion();
    } catch (err) {
      console.error('Project brief form submission failed', err);
      enableButton(submitBtn);
      if (responseEl) {
        responseEl.textContent = 'Something went wrong sending your project. Please try again.';
        responseEl.className = 'form-response';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEmailLandingForm();
  initProjectBriefForm();
});

