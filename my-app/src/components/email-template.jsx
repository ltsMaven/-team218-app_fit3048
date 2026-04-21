function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessageHtml(message) {
  return escapeHtml(message).replaceAll("\n", "<br />");
}

export function buildEnquiryEmailHtml({ name, email, message }) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #42454c;">
      <h1 style="margin-bottom: 16px; color: #42454c;">New enquiry from ${escapeHtml(name)}</h1>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 20px 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0; border-radius: 12px; background-color: #eeeff2; padding: 16px;">
        ${formatMessageHtml(message)}
      </p>
    </div>
  `;
}

export function buildEnquiryEmailText({ name, email, message }) {
  return `New enquiry from ${name}

Name: ${name}
Email: ${email}

Message:
${message}`;
}

export function buildTestimonialEmailHtml({
  name,
  email,
  displayName,
  service,
  rating,
  testimonial,
}) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #42454c;">
      <h1 style="margin-bottom: 16px; color: #42454c;">New testimonial from ${escapeHtml(name)}</h1>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 8px;"><strong>Public display name:</strong> ${escapeHtml(displayName || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Service:</strong> ${escapeHtml(service || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Rating:</strong> ${escapeHtml(rating || "Not provided")}</p>
      <p style="margin: 20px 0 8px;"><strong>Testimonial:</strong></p>
      <p style="margin: 0; border-radius: 12px; background-color: #eeeff2; padding: 16px;">
        ${formatMessageHtml(testimonial)}
      </p>
    </div>
  `;
}

export function buildTestimonialEmailText({
  name,
  email,
  displayName,
  service,
  rating,
  testimonial,
}) {
  return `New testimonial from ${name}

Name: ${name}
Email: ${email}
Public display name: ${displayName || "Not provided"}
Service: ${service || "Not provided"}
Rating: ${rating || "Not provided"}

Testimonial:
${testimonial}`;
}
