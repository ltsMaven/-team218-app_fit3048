"use client";

import React from 'react';
import { InlineWidget } from "react-calendly";
import { ChevronLeft, Clock, DollarSign } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'; 

const SERVICES = [
  {
    id: 'individual',
    title: 'Individual Counselling',
    price: '85.00',
    duration: '60 mins',
    url: 'https://calendly.com/samsthrive2026/individual-counselling',
    description: 'One-on-one support tailored to your personal journey.'
  },
  {
    id: 'couples',
    title: 'Couples Counselling',
    price: '150.00',
    duration: '60 mins',
    url: 'https://calendly.com/your-link/couples',
    description: 'Support for partners to navigate challenges and strengthen connection.'
  },
  {
    id: 'supervision',
    title: 'Clinical Supervision',
    price: '82.50',
    duration: '60 mins',
    url: 'https://calendly.com/your-link/supervision',
    description: 'Professional supervision for practitioners and students.'
  },
  {
    id: 'recovery',
    title: 'Psychosocial Recovery Coaching',
    price: '99.00',
    duration: '60 mins',
    url: 'https://calendly.com/your-link/recovery',
    description: 'Collaborative coaching for NDIS participants focused on recovery.'
  },
  {
    id: 'discovery',
    title: 'Free Discovery Call',
    price: 'Free',
    duration: '15 mins',
    url: 'https://calendly.com/your-link/discovery',
    description: 'A brief chat to see if our services are the right fit for you.'
  }
];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get('service');
  const selectedService = SERVICES.find(s => s.id === serviceId);

  const handleSelect = (id) => {
    router.push(`?service=${id}`);
  };

  const handleBack = () => {
    router.push('/booking');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[linear-gradient(180deg,rgba(146,106,185,0.05)_0%,rgba(238,239,242,1)_100%)] p-8">
      
      <div className="mb-12 w-full max-w-6xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-[#926ab9]">
          {selectedService ? selectedService.title : "Book Your Session"}
        </h1>
        <p className="text-lg text-[#5d6169]">
          {selectedService 
            ? "Select a date and time that suits your schedule." 
            : "Choose the service that best meets your needs to view availability."}
        </p>
      </div>

      <div className="w-full max-w-6xl">
        {!selectedService ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelect(service.id)}
                className="group flex flex-col text-left rounded-2xl border border-[#cfd6e2] bg-white p-6 shadow-sm transition-all hover:border-[#926ab9] hover:shadow-xl active:scale-[0.98]"
              >
                <h3 className="mb-2 text-xl font-bold text-[#42454c] group-hover:text-[#926ab9]">
                  {service.title}
                </h3>
                <p className="mb-6 flex-grow text-sm text-[#5d6169]">
                  {service.description}
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center text-sm font-medium text-[#42454c]">
                    <Clock className="mr-1 h-4 w-4 text-[#926ab9]" />
                    {service.duration}
                  </div>
                  <div className="flex items-center text-sm font-medium text-[#42454c]">
                    <DollarSign className="mr-1 h-4 w-4 text-[#926ab9]" />
                    {service.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
   
          <div className="relative">
            <button 
              onClick={handleBack}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-[#926ab9] hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to all services
            </button>
            
            <div className="h-[700px] w-full overflow-hidden rounded-xl border border-[#cfd6e2] bg-white shadow-2xl">
              <InlineWidget
      
                url={`${selectedService.url}?hide_landing_page_details=1&hide_gdpr_banner=1`}
                pageSettings={{
                  primaryColor: "926ab9",
                  textColor: "42454c",
                  backgroundColor: "ffffff",
                }}
                styles={{ height: "100%" }}
              />
            </div>
          </div>
        )}
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