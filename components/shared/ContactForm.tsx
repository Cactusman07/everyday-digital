"use client";

// Enquiry form, submitted to Formspree (which emails it to us).

import { useEffect, useId, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { SERVICES, getServiceMeta, type ServiceSlug } from "@/lib/services";
import { FOUNDER, SITE, telHref } from "@/lib/site";
import OutlineIcon from "./OutlineIcon";

/** How the founder signs off ("Sam"). */
const FIRST_NAME = FOUNDER.name.split(" ")[0];

/** Formspree form id (public; it's in the form's action URL). */
const FORMSPREE_FORM_ID = "mojzdnpq";

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), "Something else"];

export default function ContactForm({
  defaultService,
  context,
  compact = false,
  submitLabel = "Send message",
}: {
  /** Pre-selects this service in the "What can we help with?" dropdown. */
  defaultService?: ServiceSlug;
  /** Hidden field so the email says which page or package the lead came from. */
  context?: string;
  /**
   * Leaves out the phone and service row (landing pages); the pre-selected
   * service is still sent, as a hidden field.
   */
  compact?: boolean;
  submitLabel?: string;
} = {}) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  // Unique per form, so two forms on one page don't share field ids
  const id = useId();
  const successHeading = useRef<HTMLHeadingElement>(null);
  // The success message replaces the form (and the focused button), so move
  // focus to it: screen readers announce it and keyboard users aren't lost
  useEffect(() => {
    if (state.succeeded) successHeading.current?.focus();
  }, [state.succeeded]);
  const serviceTitle = defaultService
    ? getServiceMeta(defaultService)?.title
    : undefined;

  if (state.succeeded) {
    return (
      <div className="contact-success">
        <OutlineIcon className="contact-success__icon" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </OutlineIcon>
        <h2 ref={successHeading} tabIndex={-1}>
          Message received!
        </h2>
        <p>
          Thanks for getting in touch — we&apos;ll get back to you within one
          business day.
        </p>
        <p>
          In the meantime, feel free to call or text {FIRST_NAME} on{" "}
          <a href={telHref()}>{SITE.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {context && <input type="hidden" name="context" value={context} />}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${id}-name`}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-name`}
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
          <label htmlFor={`${id}-email`}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-email`}
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

      {compact ? (
        serviceTitle && (
          <input type="hidden" name="service" value={serviceTitle} />
        )
      ) : (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`${id}-phone`}>
              Phone <span className="form-optional">(optional)</span>
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              name="phone"
              placeholder="021 000 0000"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${id}-service`}>What can we help with?</label>
            <select
              id={`${id}-service`}
              name="service"
              defaultValue={serviceTitle ?? ""}
            >
              <option value="">Select a service...</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor={`${id}-message`}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${id}-message`}
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

      {/* Errors that aren't about one field (network, server, spam check) */}
      <div role="alert">
        <ValidationError errors={state.errors} className="form-error" />
      </div>

      <button type="submit" className="form-submit" disabled={state.submitting}>
        {state.submitting ? "Sending…" : submitLabel}
      </button>

      <p className="form-note">
        No spam, no mailing lists — just a reply from {FIRST_NAME}.
      </p>
    </form>
  );
}
