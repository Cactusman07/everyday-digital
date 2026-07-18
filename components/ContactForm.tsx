"use client";

import { useForm, ValidationError } from "@formspree/react";

const SERVICES = [
  "Website design",
  "Development",
  "Website hosting",
  "Social media management",
  "Automation",
  "Print & media design",
  "Other",
];

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mojzdnpq");

  if (state.succeeded) {
    return (
      <div className="contact-success">
        <svg
          className="contact-success__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <h2>Message received!</h2>
        <p>
          Thanks for getting in touch — we&apos;ll get back to you within one
          business day.
        </p>
        <p>
          In the meantime, feel free to call or text Sam on{" "}
          <a href="tel:0211759457">021 175 9457</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Your name"
            required
          />
          <ValidationError
            prefix="Name"
            field="name"
            errors={state.errors}
            className="form-error"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="form-error"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">
            Phone <span className="form-optional">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="021 000 0000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="service">What can we help with?</label>
          <select id="service" name="service">
            <option value="">Select a service...</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us about your project or what you're looking to achieve..."
          required
          rows={6}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="form-error"
        />
      </div>

      <button type="submit" className="form-submit" disabled={state.submitting}>
        {state.submitting ? "Sending…" : "Send message"}
      </button>

      <p className="form-note">
        No spam, no mailing lists — just a reply from Sam.
      </p>
    </form>
  );
}
