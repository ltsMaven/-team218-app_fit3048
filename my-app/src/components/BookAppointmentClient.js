"use client";

import { InlineWidget, useCalendlyEventListener } from "react-calendly";

export default function BookAppointmentClient() {
  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      const inviteeUri = e.data.payload.invitee.uri;
      const eventUri = e.data.payload.event.uri;

      await fetch("/api/calendly-to-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeUri, eventUri }),
      });
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-[linear-gradient(180deg,rgba(146,106,185,0.05)_0%,rgba(238,239,242,1)_100%)] p-8">
      <div className="mb-8 w-full max-w-6xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-[#926ab9]">
          Book Your Session
        </h1>
        <p className="text-lg text-[#5d6169]">
          Select a time that works for you.
        </p>
      </div>

      <div className="h-[700px] w-full max-w-6xl overflow-hidden rounded-xl border border-[#cfd6e2] bg-white shadow-[0_24px_60px_rgba(66,69,76,0.08)]">
        <InlineWidget
          url="https://calendly.com/samsthrive2026/consulling"
          pageSettings={{
            primaryColor: "926ab9",
            textColor: "42454c",
            backgroundColor: "ffffff",
          }}
          styles={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
