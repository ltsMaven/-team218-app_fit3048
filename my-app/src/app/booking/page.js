import { Suspense } from "react";
import BookAppointmentClient from "../../components/BookAppointmentClient";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "http://localhost:3000";

export const metadata = {
  title: "Book a Session",
  description:
    "Schedule an online counselling session with Ability to Thrive using the integrated booking calendar.",
  alternates: {
    canonical: `${siteUrl}/booking`,
  },
  openGraph: {
    title: "Book a Session | Ability to Thrive",
    description:
      "Schedule an online counselling session with Ability to Thrive using the integrated booking calendar.",
    url: `${siteUrl}/booking`,
  },
};

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div>Loading booking page...</div>}>
      <BookAppointmentClient />
    </Suspense>
  );
}
