"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const MAX_TESTIMONIAL_WORDS = 220;
const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  displayName: "",
  service: "",
  testimonial: "",
  consent: false,
};

function countWords(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
}

function getFieldError(name, value) {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  if (name === "firstName" || name === "lastName") {
    if (!trimmedValue) {
      return "Required.";
    }

    if (!namePattern.test(trimmedValue)) {
      return "Use letters only, with spaces, apostrophes, or hyphens if needed.";
    }
  }

  if (name === "email") {
    if (!trimmedValue) {
      return "Required.";
    }

    if (!emailPattern.test(trimmedValue)) {
      return "Enter a valid email address.";
    }
  }

  if (name === "testimonial") {
    const wordCount = countWords(trimmedValue);

    if (!trimmedValue) {
      return "Please write a testimonial.";
    }

    if (wordCount > MAX_TESTIMONIAL_WORDS) {
      return `Keep it to ${MAX_TESTIMONIAL_WORDS} words or fewer.`;
    }
  }

  if (name === "consent" && !trimmedValue) {
    return "Consent is required.";
  }

  return "";
}

export default function AddTestimonialForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const testimonialWordCount = countWords(formData.testimonial);

  function handleChange(event) {
    const { name, type, checked, value } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    if (
      name === "testimonial" &&
      typeof nextValue === "string" &&
      countWords(nextValue) > MAX_TESTIMONIAL_WORDS
    ) {
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: getFieldError(name, nextValue),
    }));
  }

  function validateForm() {
    const nextErrors = {
      firstName: getFieldError("firstName", formData.firstName),
      lastName: getFieldError("lastName", formData.lastName),
      email: getFieldError("email", formData.email),
      testimonial: getFieldError("testimonial", formData.testimonial),
      consent: getFieldError("consent", formData.consent),
      captcha: captchaToken
        ? ""
        : "Please complete the reCAPTCHA verification.",
    };

    setFieldErrors(nextErrors);

    return Object.values(nextErrors).every((error) => !error);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit testimonial.");
      }

      setStatus({
        type: "success",
        message: "Thank you. Your testimonial has been submitted for review.",
      });
      setFormData(initialFormState);
      setFieldErrors({});
      setCaptchaToken(null);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to submit testimonial.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[2rem] border border-[#d8dfeb] bg-white/92 p-6 shadow-[0_24px_60px_rgba(66,69,76,0.1)] backdrop-blur sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#42454c]">
            First name <span className="text-[#b94a48]">*</span>
          </span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
          />
          {fieldErrors.firstName ? (
            <span className="mt-2 block text-sm text-[#b94a48]">
              {fieldErrors.firstName}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#42454c]">
            Last name <span className="text-[#b94a48]">*</span>
          </span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
            className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
          />
          {fieldErrors.lastName ? (
            <span className="mt-2 block text-sm text-[#b94a48]">
              {fieldErrors.lastName}
            </span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-[#42454c]">
            Email <span className="text-[#b94a48]">*</span>
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
          />
          {fieldErrors.email ? (
            <span className="mt-2 block text-sm text-[#b94a48]">
              {fieldErrors.email}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#42454c]">
            Public display name
          </span>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Example: Sarah M."
            className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#42454c]">
            Service
          </span>
          <div className="relative">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="h-[50px] w-full appearance-none rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 pr-11 text-[#42454c] outline-none transition focus:border-[#926ab9]"
            >
              <option value="">Select a service</option>
              <option value="Free Discovery Call">Free Discovery Call</option>
              <option value="Individual Counselling">
                Individual Counselling
              </option>
              <option value="Clinical Supervision">Clinical Supervision</option>
              <option value="Couples Counselling">Couples Counselling</option>
              <option value="Psychosocial Recovery">
                Psychosocial Recovery
              </option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7b869f]">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
          </div>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#42454c]">
            <span>
              Testimonial <span className="text-[#b94a48]">*</span>
            </span>
            <span
              className={
                testimonialWordCount >= MAX_TESTIMONIAL_WORDS
                  ? "text-[#b94a48]"
                  : "text-[#6b7280]"
              }
            >
              {testimonialWordCount}/{MAX_TESTIMONIAL_WORDS}
            </span>
          </span>
          <textarea
            name="testimonial"
            value={formData.testimonial}
            onChange={handleChange}
            required
            rows={7}
            placeholder="Share what felt helpful, supportive, or meaningful about your experience."
            className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
          />
          {fieldErrors.testimonial ? (
            <span className="mt-2 block text-sm text-[#b94a48]">
              {fieldErrors.testimonial}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] p-4">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-[#cfd6e2] text-[#926ab9]"
        />
        <span className="text-sm leading-6 text-[#5d6169]">
          I consent to Ability to Thrive sharing this testimonial publicly. I
          understand it may be edited for length or clarity before publication.
        </span>
      </label>
      {fieldErrors.consent ? (
        <p className="mt-2 text-sm text-[#b94a48]">{fieldErrors.consent}</p>
      ) : null}

      <div className="mt-6">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          hl="en"
          onChange={(token) => {
            setCaptchaToken(token);
            setFieldErrors((current) => ({
              ...current,
              captcha: token
                ? ""
                : "Please complete the reCAPTCHA verification.",
            }));
          }}
          onExpired={() => {
            setCaptchaToken(null);
            setFieldErrors((current) => ({
              ...current,
              captcha: "Please complete the reCAPTCHA verification.",
            }));
          }}
          onErrored={() => {
            setCaptchaToken(null);
            setFieldErrors((current) => ({
              ...current,
              captcha: "reCAPTCHA could not be verified. Please try again.",
            }));
          }}
        />
        {fieldErrors.captcha ? (
          <p className="mt-3 text-sm font-medium text-[#b94a48]">
            {fieldErrors.captcha}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="inline-flex items-center justify-center rounded-2xl bg-[#926ab9] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit testimonial"}
        </button>

        {status.message ? (
          <p
            className={`text-base font-medium ${
              status.type === "error" ? "text-[#b94a48]" : "text-[#4b8e9a]"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
