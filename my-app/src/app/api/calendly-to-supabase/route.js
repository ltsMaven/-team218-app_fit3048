import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; 

export async function POST(request) {
  try {
    const { inviteeUri, eventUri } = await request.json();
    const calendlyToken = process.env.CALENDLY_API_TOKEN;
    
    const inviteeResponse = await fetch(inviteeUri, {
      headers: { 'Authorization': `Bearer ${calendlyToken}` }
    });
    const inviteeData = await inviteeResponse.json();
    
    const eventResponse = await fetch(eventUri, {
      headers: { 'Authorization': `Bearer ${calendlyToken}` }
    });
    const eventData = await eventResponse.json();

    const clientName = inviteeData.resource.name;
    const clientEmail = inviteeData.resource.email;
    const appointmentTime = eventData.resource.start_time;

    const { error } = await supabase
      .from('appointments')
      .insert([
        { 
          client_name: clientName, 
          client_email: clientEmail, 
          appointment_time: appointmentTime 
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('Failed to save booking:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}