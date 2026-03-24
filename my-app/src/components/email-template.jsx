import * as React from "react";

export function EmailTemplate({ name, email, phone, message }) {
  return (
    <div
      style={{
        fontFamily:
          'Arial, "Helvetica Neue", Helvetica, sans-serif',
        lineHeight: "1.6",
        color: "#42454c",
      }}
    >
      <h1 style={{ marginBottom: "16px", color: "#42454c" }}>
        New enquiry from {name}
      </h1>
      <p style={{ margin: "0 0 8px" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ margin: "0 0 8px" }}>
        <strong>Email:</strong> {email}
      </p>
      <p style={{ margin: "0 0 8px" }}>
        <strong>Phone:</strong> {phone || "Not provided"}
      </p>
      <p style={{ margin: "20px 0 8px" }}>
        <strong>Message:</strong>
      </p>
      <p
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          borderRadius: "12px",
          backgroundColor: "#eeeff2",
          padding: "16px",
        }}
      >
        {message}
      </p>
    </div>
  );
}
