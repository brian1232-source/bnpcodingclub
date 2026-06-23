// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Terminal typing animation ----------
const typedLine = document.getElementById('typedLine');
const terminalOut = document.getElementById('terminalOut');

const fullLine = 'welcome --to --Baringo Coding="club"';
const outputLine = 'Welcome aboard. First meeting: Tuesday, 4PM.';

let charIndex = 0;

function typeChar() {
  if (charIndex < fullLine.length) {
    typedLine.textContent += fullLine.charAt(charIndex);
    charIndex++;
    setTimeout(typeChar, 45);
  } else {
    setTimeout(typeOut, 500);
  }
}

let outIndex = 0;
function typeOut() {
  if (outIndex < outputLine.length) {
    terminalOut.textContent += outputLine.charAt(outIndex);
    outIndex++;
    setTimeout(typeOut, 25);
  }
}

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  typedLine.textContent = fullLine;
  terminalOut.textContent = outputLine;
} else {
  typeChar();
}

// ---------- Contact form (Google Sheet backend) ----------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzuRu56m0DeaRO_YDzHmL2cSOZR4k07zfcsLbEV2ed7pCT4dgEDHNr3Urpt3pDFyaw/exec";

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Please fill in all fields correctly.';
    return;
  }

  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formStatus.textContent = "Sending...";

  try {
    const res = await fetch(SHEET_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "text/plain" } // avoids CORS preflight issues with Apps Script
    });

    const result = await res.json();

    if (result.result === "success") {
      formStatus.textContent = `Thanks, ${data.name}! Your message has been saved.`;
      contactForm.reset();
    } else {
      formStatus.textContent = "Something went wrong. Please try again.";
    }
  } catch (err) {
    formStatus.textContent = "Network error. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--ink)';
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));