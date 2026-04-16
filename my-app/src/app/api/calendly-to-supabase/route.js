import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase-server";

function getCalendlyToken() {
  const token = process.env.CALENDLY_API_TOKEN;

  if (!token) {
    throw new Error("Missing CALENDLY_API_TOKEN environment variable.");
  }

  return token;
}

async function fetchCalendlyResource(uri) {
  const response = await fetch(uri, {
    headers: {
      Authorization: `Bearer ${getCalendlyToken()}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.title || data?.message || `Calendly request failed for ${uri}.`
    );
  }

  return data?.resource;
}

function extractCalendlyUris(body = {}) {
  if (body?.event === "invitee.created") {
    return {
      eventUri: body?.payload?.event || "",
      inviteeUri: body?.payload?.uri || "",
    };
  }

  return {
    eventUri: body?.eventUri || body?.payload?.event?.uri || "",
    inviteeUri: body?.inviteeUri || body?.payload?.invitee?.uri || "",
  };
}

async function buildAppointmentRecord(body) {
  const { eventUri, inviteeUri } = extractCalendlyUris(body);

  if (!eventUri || !inviteeUri) {
    throw new Error("Missing Calendly event or invitee URI.");
  }

  const [eventResource, inviteeResource] = await Promise.all([
    fetchCalendlyResource(eventUri),
    fetchCalendlyResource(inviteeUri),
  ]);

  return {
    client_name: inviteeResource?.name || "",
    client_email: inviteeResource?.email || "",
    appointment_time: eventResource?.start_time || "",
    service_type: eventResource?.name || "",
  };
}

function validateAppointmentRecord(record) {
  if (
    !record.client_name ||
    !record.client_email ||
    !record.appointment_time ||
    !record.service_type
  ) {
    throw new Error("Calendly response is missing appointment details.");
  }
}

async function appointmentExists(supabase, record) {
  const { data, error } = await supabase
    .from("appointments")
    .select("client_email")
    .eq("client_email", record.client_email)
    .eq("appointment_time", record.appointment_time)
    .eq("service_type", record.service_type)
    .limit(1);

  if (error) {
    throw new Error(`Supabase lookup failed: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

async function saveAppointment(record) {
  const supabase = getServerSupabaseClient();

  if (await appointmentExists(supabase, record)) {
    return { duplicate: true };
  }

  const { error } = await supabase.from("appointments").insert([record]);

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return { duplicate: false };
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body?.event && body.event !== "invitee.created") {
      return NextResponse.json({ ignored: true }, { status: 200 });
    }

    const record = await buildAppointmentRecord(body);
    validateAppointmentRecord(record);

    const result = await saveAppointment(record);

    return NextResponse.json(
      {
        success: true,
        duplicate: result.duplicate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Calendly sync failed:", error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
