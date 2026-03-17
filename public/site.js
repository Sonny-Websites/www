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

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var nameInput = document.getElementById('contact-name');
  var emailInput = document.getElementById('contact-email');
  var messageInput = document.getElementById('contact-message');
  var nameError = document.getElementById('contact-name-error');
  var emailError = document.getElementById('contact-email-error');
  var messageError = document.getElementById('contact-message-error');
  var responseEl = document.getElementById('contact-response');
  var submitBtn = form.querySelector('button[type="submit"]');

  function validateName() {
    var val = nameInput ? nameInput.value.trim() : '';
    if (val.length < 2) {
      if (nameError) nameError.textContent = 'Please enter at least 2 characters.';
      return false;
    }
    if (nameError) nameError.textContent = '';
    return true;
  }

  function validateEmail() {
    var val = emailInput ? emailInput.value.trim() : '';
    if (!val || !isValidEmail(val)) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      return false;
    }
    if (emailError) emailError.textContent = '';
    return true;
  }

  function validateMessage() {
    var val = messageInput ? messageInput.value.trim() : '';
    if (val.length < 10) {
      if (messageError) messageError.textContent = 'Please enter at least 10 characters.';
      return false;
    }
    if (messageError) messageError.textContent = '';
    return true;
  }

  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function () { if (nameError && nameError.textContent) validateName(); });
  }
  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function () { if (emailError && emailError.textContent) validateEmail(); });
  }
  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', function () { if (messageError && messageError.textContent) validateMessage(); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var hp = form.querySelector('input[name="_hp"]');
    if (hp && hp.value) return;

    var validName = validateName();
    var validEmail = validateEmail();
    var validMsg = validateMessage();
    if (!validName || !validEmail || !validMsg) return;

    if (responseEl) {
      responseEl.textContent = '';
      responseEl.className = 'form-response';
    }

    disableButton(submitBtn, 'Sending...');

    var body = new URLSearchParams(new FormData(form));
    body.append('formName', 'contact');

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 30000);

    fetch(form.action || '/__forms/contact', {
      method: 'POST',
      body: body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      signal: controller.signal
    }).then(function (res) {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Non-2xx response');
      showFormSuccess(form, responseEl, 'Thanks! Sonny will be in touch shortly.');
      gtag_report_conversion();
    }).catch(function (err) {
      clearTimeout(timeoutId);
      console.error('Contact form submission failed', err);
      enableButton(submitBtn);
      if (responseEl) {
        responseEl.textContent = 'Something went wrong. Please try again.';
        responseEl.className = 'form-response';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initEmailLandingForm();
  initProjectBriefForm();
  initContactForm();
});

