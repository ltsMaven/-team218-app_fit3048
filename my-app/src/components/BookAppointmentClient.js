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
          url="https://calendly.com/d/cxs3-cd5-vc4"
          pageSettings={{
            primaryColor: "926ab9",
            textColor: "42454c",
            backgroundColor: "ffffff",
          }}
          styles={{ height: "100%" }}
        />
      </div>
    <div className="mt-12 w-full max-w-6xl rounded-xl border border-red-100 bg-white/50 p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-[#42454c]">
          Crisis and Emergency Support
        </h2>
        <p className="mb-6 text-[#5d6169] leading-relaxed">
          Please be aware that <strong>Ability To Thrive</strong> is not an emergency or crisis service. 
          In the event of a mental health-related emergency, please contact your Family Doctor/GP or one of the following services immediately:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col border-l-4 border-red-500 pl-4 py-1">
            <span className="font-bold text-red-600">Emergencies (Police/Ambulance)</span>
            <a href="tel:000" className="text-lg font-semibold hover:underline">000</a>
          </div>

          {[
            { name: "Lifeline", num: "13 11 14" },
            { name: "Beyond Blue", num: "1300 22 4636" },
            { name: "Kids Helpline (5-25)", num: "1800 551 800" },
            { name: "Suicide Callback Service", num: "1300 659 467" },
            { name: "Mensline", num: "1300 78 9978" },
            { name: "Domestic Violence Line", num: "1800 737 732" },
            { name: "Sexual Assault Crisis Line", num: "1800 806 292" },
            { name: "Sane Australia", num: "1800 18 7263" },
          ].map((service) => (
            <div key={service.name} className="flex flex-col border-l-4 border-[#926ab9] pl-4 py-1 bg-white/30">
              <span className="font-medium text-[#42454c]">{service.name}</span>
              <a href={`tel:${service.num.replace(/\s/g, '')}`} className="text-[#926ab9] font-bold hover:underline">
                {service.num}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
}