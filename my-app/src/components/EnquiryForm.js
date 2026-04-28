"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const MAX_MESSAGE_WORDS = 300;
const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState = {
  f_name: "",
  l_name: "",
  email: "",
  message: "",
};

const faqs = [
  {
    question: "What happens after I submit an enquiry?",
    answer:
      "After you submit the form, we will review your message and respond with the most appropriate next step based on your situation.",
  },
  {
    question: "Do I need to know which service I need before contacting you?",
    answer:
      "No. You can briefly explain what support you are looking for, and we can help guide you toward counselling, coaching, supervision, or NDIS-related support.",
  },
  {
    question: "Is my enquiry confidential?",
    answer:
      "Your enquiry will be treated with care and respect. Please avoid including highly sensitive or urgent information in the form.",
  },
  {
    question: "Can I ask about NDIS support through this form?",
    answer:
      "Yes. You can use the enquiry form to ask about NDIS-related counselling, recovery coaching, or support options.",
  },
];

function countWords(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
}

function getFieldError(name, value) {
  const trimmedValue = value.trim();

  if (name === "f_name") {
    if (!trimmedValue) {
      return "Can't be blank.";
    }

    if (!namePattern.test(trimmedValue)) {
      return "Use letters only, with spaces, apostrophes, or hyphens if needed.";
    }
  }

  if (name === "l_name") {
    if (trimmedValue && !namePattern.test(trimmedValue)) {
      return "Use letters only, with spaces, apostrophes, or hyphens if needed.";
    }
  }

  if (name === "email") {
    if (!trimmedValue) {
      return "Can't be blank.";
    }

    if (!emailPattern.test(trimmedValue)) {
      return "Enter a valid email address.";
    }
  }

  if (name === "message") {
    const wordCount = countWords(trimmedValue);

    if (!trimmedValue) {
      return "Can't be blank.";
    }

    if (wordCount > MAX_MESSAGE_WORDS) {
      return `Message must be ${MAX_MESSAGE_WORDS} words or fewer.`;
    }
  }

  return "";
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageWordCount = countWords(formData.message);

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValue =
      name === "message" && countWords(value) > MAX_MESSAGE_WORDS
        ? formData.message
        : value;

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
      f_name: getFieldError("f_name", formData.f_name),
      l_name: getFieldError("l_name", formData.l_name),
      email: getFieldError("email", formData.email),
      message: getFieldError("message", formData.message),
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
      const response = await fetch("/api/send", {
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
        throw new Error(result.error || "Unable to send your enquiry.");
      }

      setStatus({
        type: "success",
        message: "Your enquiry has been sent. We will be in touch soon.",
      });

      setFormData(initialFormState);
      setFieldErrors({});
      setCaptchaToken(null);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your enquiry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section
        id="enquiry"
        className="bg-[#f1f2f5] px-6 py-24 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              Enquiry
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
              Reach out for support that fits your situation.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5d6169]">
              Share a few details about what you need and we will respond with
              the best next step for counselling, coaching, supervision, or NDIS
              support.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,239,242,0.92))] p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)]"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#42454c]">
                  First name <span className="text-[#b94a48]">*</span>
                </span>
                <input
                  type="text"
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
                />
                {fieldErrors.f_name ? (
                  <span className="mt-2 block text-sm text-[#b94a48]">
                    {fieldErrors.f_name}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#42454c]">
                  Last name
                </span>
                <input
                  type="text"
                  name="l_name"
                  value={formData.l_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
                />
                {fieldErrors.l_name ? (
                  <span className="mt-2 block text-sm text-[#b94a48]">
                    {fieldErrors.l_name}
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

              <label className="block md:col-span-2">
                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-[#42454c]">
                  <span>
                    Message <span className="text-[#b94a48]">*</span>
                  </span>
                  <span
                    className={
                      messageWordCount >= MAX_MESSAGE_WORDS
                        ? "text-[#b94a48]"
                        : "text-[#6b7280]"
                    }
                  >
                    {messageWordCount}/{MAX_MESSAGE_WORDS}
                  </span>
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
                />
                {fieldErrors.message ? (
                  <span className="mt-2 block text-sm text-[#b94a48]">
                    {fieldErrors.message}
                  </span>
                ) : null}
              </label>
            </div>

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
                    captcha:
                      "reCAPTCHA could not be verified. Please try again.",
                  }));
                }}
              />
              {fieldErrors.captcha ? (
                <p className="mt-3 text-base font-medium text-[#b94a48]">
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
                {isSubmitting ? "Sending..." : "Send enquiry"}
              </button>

              {status.message ? (
                <p
                  className={`text-base font-medium sm:text-lg ${
                    status.type === "error"
                      ? "text-[#b94a48]"
                      : "text-[#4b8e9a]"
                  }`}
                >
                  {status.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              FAQ
            </p>

            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl">
              Common questions before reaching out
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
              Here are a few quick answers that may help you better understand
              the counselling process.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#d8dfeb] bg-white/90 p-6 shadow-[0_16px_40px_rgba(66,69,76,0.06)] transition-all duration-300 open:shadow-[0_20px_50px_rgba(66,69,76,0.1)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-[#42454c]">
                  {faq.question}

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1eef6] text-[#926ab9] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-4 leading-7 text-[#5d6169]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
