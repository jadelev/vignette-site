// Phone menu
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (!header || !toggle) return;
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  header.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Enquiry form: validates, sends through FormSubmit, then shows the thank-you message
(function () {
  var form = document.getElementById('enquiry');
  if (!form) return;
  var status = document.getElementById('form-status');
  var thanks = document.getElementById('thanks');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = [];
    if (!form.elements['name'].value.trim()) missing.push('your name');
    if (!/^\S+@\S+\.\S+$/.test(form.elements['email'].value.trim())) missing.push('a valid email');
    if (!form.querySelector('input[name="gathering"]:checked')) missing.push('what you’re gathering for');
    if (!form.querySelector('input[name="budget"]:checked')) missing.push('a budget range');
    if (missing.length) {
      status.textContent = 'Please add ' + missing.join(', ') + '.';
      return;
    }
    status.textContent = '';
    button.disabled = true;
    button.textContent = 'Sending…';

    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () {
        form.hidden = true;
        thanks.hidden = false;
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Send enquiry';
        status.textContent = 'Something went wrong sending that. Please try again, or email hello@jadelevinson.com.';
      });
  });
})();
