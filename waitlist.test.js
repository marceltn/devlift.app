import test from "node:test";
import assert from "node:assert/strict";
import { buildMailtoLink, hasConfiguredEndpoint } from "./waitlist.js";

test("buildMailtoLink encodes the waitlist email and subject", () => {
  const href = buildMailtoLink("alex@example.com");

  assert.equal(
    href,
    "mailto:hello@devlift.app?subject=DevLift%20waitlist&body=Add%20alex%40example.com%20to%20the%20DevLift%20waitlist."
  );
});

test("hasConfiguredEndpoint ignores placeholder endpoints", () => {
  assert.equal(hasConfiguredEndpoint("https://formspree.io/f/YOUR_FORM_ID"), false);
  assert.equal(hasConfiguredEndpoint("https://formspree.io/f/abc123"), true);
});
