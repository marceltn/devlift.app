const DEFAULT_RECIPIENT = "hello@devlift.app";
const DEFAULT_SUBJECT = "DevLift waitlist";
const PLACEHOLDER_ENDPOINT = "YOUR_FORM_ID";

export function hasConfiguredEndpoint(endpoint) {
  return (
    typeof endpoint === "string" &&
    endpoint.trim().length > 0 &&
    !endpoint.includes(PLACEHOLDER_ENDPOINT)
  );
}

export function buildMailtoLink(email, recipient = DEFAULT_RECIPIENT) {
  const subject = encodeURIComponent(DEFAULT_SUBJECT);
  const body = encodeURIComponent(
    `Add ${email.trim()} to the DevLift waitlist.`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

async function postToEndpoint(endpoint, form) {
  const response = await fetch(endpoint, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Waitlist submission failed with ${response.status}`);
  }
}

function setMessage(messageEl, text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#ffb3c7" : "#b7ffe9";
}

export function initWaitlistForm(doc = document, win = window) {
  const form = doc.getElementById("waitlist-form");
  const message = doc.getElementById("form-message");
  const email = doc.getElementById("email");

  if (!form || !message || !email) {
    return;
  }

  const recipient = form.dataset.waitlistRecipient || DEFAULT_RECIPIENT;
  const endpoint = form.dataset.waitlistEndpoint || "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = email.value.trim();

    if (!value) {
      setMessage(message, "Enter your email to join the waitlist.", true);
      email.focus();
      return;
    }

    if (!hasConfiguredEndpoint(endpoint)) {
      setMessage(
        message,
        "Formspree is not configured yet. Opening your email app instead."
      );
      win.location.href = buildMailtoLink(value, recipient);
      return;
    }

    try {
      await postToEndpoint(endpoint, form);
      setMessage(message, `You're on the waitlist, ${value}.`);
      form.reset();
    } catch (error) {
      setMessage(
        message,
        "Waitlist submission failed. Try again or use the email fallback.",
        true
      );
      console.error(error);
    }
  });
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  initWaitlistForm(document, window);
}
