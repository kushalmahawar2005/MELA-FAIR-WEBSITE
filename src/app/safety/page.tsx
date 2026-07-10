import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety Guidelines",
  description: `Safety guidelines and ride rules for visitors at ${site.name}, Jaipur.`,
};

export default function SafetyPage() {
  return (
    <LegalPage
      eyebrow="Safety Guidelines"
      title="Safety Guidelines"
      updated="30 May 2026"
      intro={`Your safety is our top priority. Please review these guidelines before visiting ${site.name} to ensure a safe and enjoyable experience for everyone.`}
      sections={[
        {
          heading: "Before You Ride",
          body: [
            "Check the height, age, and health requirements posted at every ride before queuing.",
            "Guests who are pregnant, have heart conditions, back/neck problems, or other medical issues should avoid high-thrill rides.",
          ],
        },
        {
          heading: "On the Ride",
          body: [
            "Always follow the instructions of the ride operators and keep seat belts and safety harnesses fastened at all times.",
            "Keep hands, arms, legs, and loose items inside the ride throughout. Do not attempt to stand or exit while a ride is in motion.",
          ],
        },
        {
          heading: "Children's Safety",
          body: [
            "Children must be supervised by an adult at all times. Please decide together which rides are appropriate for your child's height and age.",
            "In case you are separated from your group, contact the nearest staff member or the help desk immediately.",
          ],
        },
        {
          heading: "Water Zones",
          body: [
            "Follow lifeguard instructions in all water areas. Non-swimmers should remain in shallow zones and use safety floats where provided.",
          ],
        },
        {
          heading: "General Conduct",
          body: [
            "Outside food, alcohol, sharp objects, and hazardous items are not allowed inside the park.",
            "Please keep the park clean, use dustbins, and report any safety concern to our staff right away.",
          ],
        },
        {
          heading: "Emergency & Help",
          body: [
            `For any emergency or assistance during your visit, reach our help desk or call ${site.phone}.`,
          ],
        },
      ]}
    />
  );
}
