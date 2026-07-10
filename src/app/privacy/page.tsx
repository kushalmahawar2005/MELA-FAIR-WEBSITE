import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      updated="30 May 2026"
      intro={`${site.name} respects your privacy. This policy explains what information we collect when you use our website or book with us, and how we use and protect it.`}
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "When you register an account, book tickets, or submit an enquiry, we may collect your name, phone number, email address, and booking details.",
            "We may also collect non-personal data such as browser type and pages visited to improve our website experience.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "Your information is used to process bookings, respond to enquiries, send booking confirmations, and provide customer support.",
            "We may occasionally send offers or updates about the park. You can opt out of marketing messages at any time.",
          ],
        },
        {
          heading: "Sharing of Information",
          body: [
            "We do not sell or rent your personal information. Information may be shared only with trusted service providers (such as payment or messaging partners) strictly to deliver our services.",
          ],
        },
        {
          heading: "Data Security",
          body: [
            "We take reasonable measures to protect your data against unauthorized access. Passwords are stored in encrypted form and never shared.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "Our website may use cookies to remember your preferences and improve functionality. You can disable cookies in your browser settings.",
          ],
        },
        {
          heading: "Contact Us",
          body: [
            `For privacy-related questions or to request deletion of your data, email us at ${site.email} or call ${site.phone}.`,
          ],
        },
      ]}
    />
  );
}
