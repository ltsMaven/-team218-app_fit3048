"use client";

import { useCalendlyEventListener, InlineWidget } from "react-calendly";

export default function BookAppointment() {
  
  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      const inviteeUri = e.data.payload.invitee.uri;
      const eventUri = e.data.payload.event.uri;

      await fetch('/api/calendly-to-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteeUri, eventUri })
      });
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-[linear-gradient(180deg,#f7f8fb_0%,#eeeff2_100%)] p-8">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="mb-4 text-4xl font-extrabold text-[#42454c]">Book Your Session</h1>
        <p className="text-lg text-[#5d6169]">Select a time that works for you.</p>
      </div>

      <div className="h-[700px] w-full max-w-4xl overflow-hidden rounded-xl border border-[#cfd6e2] bg-white shadow-[0_24px_60px_rgba(66,69,76,0.08)]">
        <InlineWidget 
          url="https://calendly.com/fit3048/online-counselling" 
          styles={{ height: '100%' }}
        />
      </div>
    </main>
  );
}
