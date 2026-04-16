import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Using your Anon Key

export async function POST(request) {
  try {
    const rawBody = await request.json();
    console.log(`Webhook Received: ${rawBody.event}`);

    // SPECIFICITY: Only proceed if this is a new booking
    if (rawBody.event !== 'invitee.created') {
      console.log('Event is not a new creation. Ignoring.');
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 }); 
    }

    const { payload } = rawBody;
    const clientName = payload?.name;
    const clientEmail = payload?.email;
    const eventUri = payload?.event; 

    if (!eventUri) {
      console.error('No Event URI found in payload');
      return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
    }

    // Fetch Event Details from Calendly
    const calendlyToken = process.env.CALENDLY_API_TOKEN;
    const eventResponse = await fetch(eventUri, {
      headers: { 'Authorization': `Bearer ${calendlyToken}` }
    });
    
    const eventData = await eventResponse.json();

    if (!eventResponse.ok) {
      console.error('Calendly API Error:', eventData);
      return NextResponse.json({ error: 'Calendly Fetch Failed' }, { status: 400 });
    }

    const appointmentTime = eventData.resource?.start_time;
    const serviceType = eventData.resource?.name; 

    console.log('Preparing to save:', { clientName, serviceType, appointmentTime });

    // Insert into Supabase using your Anon Key
    // Since RLS is disabled, this will successfully write to the database
    const { error } = await supabase
      .from('appointments')
      .insert([
        { 
          client_name: clientName, 
          client_email: clientEmail, 
          appointment_time: appointmentTime,
          service_type: serviceType
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error.message);
      return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    console.log('Successfully saved to Supabase!');
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('Server Crash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}