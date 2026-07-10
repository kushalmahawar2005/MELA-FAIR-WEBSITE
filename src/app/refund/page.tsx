import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Ticket cancellation and refund policy for ${site.name}, Jaipur.`,
};

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Refund Policy"
      title="Refund & Cancellation"
      updated="30 May 2026"
      intro={`This policy explains the cancellation and refund terms for tickets and event bookings at ${site.name}.`}
      sections={[
        {
          heading: "Admission Tickets",
          body: [
            "Online admission tickets are non-refundable and non-cancellable once purchased, except where required by applicable law.",
            "Tickets are valid only for the selected date and cannot be transferred to another person.",
          ],
        },
        {
          heading: "Park Closure & Rescheduling",
          body: [
            "If the park is closed due to weather, technical, or other unforeseen reasons, affected tickets will be rescheduled to a future date or issued as a credit voucher.",
            "Rescheduling requests must be made within the validity period communicated by our helpdesk.",
          ],
        },
        {
          heading: "Event & Group Bookings",
          body: [
            "Custom event setups and group bookings follow the specific cancellation terms agreed at the time of booking. Advance payments may be partially or fully non-refundable depending on the notice period.",
            "For event cancellations, please contact our team as early as possible so we can assist you.",
          ],
        },
        {
          heading: "How Refunds Are Processed",
          body: [
            "Where a refund is approved, it will be processed to the original payment method within 7–10 business days.",
          ],
        },
        {
          heading: "Contact Us",
          body: [
            `For refund or cancellation requests, email ${site.email} or call ${site.phone}.`,
          ],
        },
      ]}
    />
  );
}
