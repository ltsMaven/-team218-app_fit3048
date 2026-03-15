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
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Book Your Session</h1>
        <p className="text-lg text-slate-600">Select a time that works for you.</p>
      </div>

      <div className="w-full max-w-4xl h-[700px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <InlineWidget 
          url="https://calendly.com/fit3048/online-counselling" 
          styles={{ height: '100%' }}
        />
      </div>
    </main>
  );
}