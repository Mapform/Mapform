import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="prose mx-auto w-full max-w-screen-lg px-4 py-8 md:px-8">
      <h1 className="mb-8">Privacy Policy</h1>

      <p className="mb-8 italic">Last updated: February 21, 2025</p>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">1. Introduction</h2>
        <p>
          This Privacy Policy explains how Mapform (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your
          personal information. We are committed to protecting your privacy and
          handling your data in an open and transparent manner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          2. Information We Collect
        </h2>
        <p>
          We collect and process only basic personally identifiable information
          (PII), including:
        </p>
        <ul className="mt-2 list-disc pl-6">
          <li>Email address (required for account creation)</li>
          <li>Account credentials</li>
          <li>Usage data and analytics</li>
        </ul>
        <p className="mt-4">
          We do not directly collect or store any other personal information or
          location data. However, as a user of our Service, you may choose to
          store data, which could include PII or other sensitive information.
          You are responsible for ensuring any data you store complies with
          applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          3. How We Use Your Information
        </h2>
        <p>We use the collected information for the following purposes:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>To provide and maintain our Service</li>
          <li>To authenticate and manage your account</li>
          <li>To communicate with you about service-related matters</li>
          <li>To improve and optimize our Service</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          4. Data Sharing and Disclosure
        </h2>
        <p>
          Mapform does not sell or share your personal information with third
          parties without your explicit consent, except when required by law. We
          may share your information in the following circumstances:
        </p>
        <ul className="mt-2 list-disc pl-6">
          <li>When required by law or legal process</li>
          <li>To protect our rights, privacy, safety, or property</li>
          <li>In connection with a merger, acquisition, or sale of assets</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the Internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">6. User Data Rights</h2>
        <p>You have the right to:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>Access your personal information</li>
          <li>Correct inaccurate personal information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict processing of your personal information</li>
          <li>Request a copy of your personal information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">7. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to
          fulfill the purposes for which it was collected, including legal,
          accounting, or reporting requirements. When you delete your account,
          we will delete or anonymize your personal information unless we are
          legally required to retain it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          8. Children&apos;s Privacy
        </h2>
        <p>
          Our Service is not intended for children under the age of 13. We do
          not knowingly collect personal information from children under 13. If
          you become aware that a child has provided us with personal
          information, please contact us, and we will take steps to remove such
          information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          9. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date. Your continued use of the
          Service after such modifications constitutes your acknowledgment of
          the modified Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at{" "}
          <a
            href="mailto:hello@nichaley.com"
            className="text-blue-600 hover:underline"
          >
            hello@nichaley.com
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <p>
          For more information about your rights and obligations when using our
          Service, please refer to our{" "}
          <Link href="/terms-of-use" className="text-blue-600 hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
