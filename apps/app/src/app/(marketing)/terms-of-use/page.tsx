import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="prose mx-auto w-full max-w-screen-lg px-4 py-8 md:px-8">
      <h1 className="mb-8">Terms of Use</h1>

      <p className="mb-8 italic">Last updated: February 21, 2025</p>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Mapform (&quot;Service&quot;), you agree to be
          bound by these Terms of Use (&quot;Terms&quot;). If you do not agree
          to these Terms, do not access or use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          2. Description of Service
        </h2>
        <p>
          Mapform provides users with mapping-related services, including tools
          to visualize, interact with, and manage geographical and
          location-based data. The Service may offer various subscription plans,
          including Free and Pro tiers, each with different features and
          limitations.
        </p>
        <p className="mt-4">
          Mapform is open-source software and is distributed under the AGPL-3.0
          License. By using the software, you agree to the terms of this
          open-source license.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">3. User Accounts</h2>
        <p>
          To access certain features of the Service, you must create an account.
          You agree to provide accurate, current, and complete information
          during registration, including your email address and any other
          required information. You are responsible for maintaining the
          confidentiality of your account and password and for all activities
          that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">4. User Obligations</h2>
        <p>By using the Service, you agree that you will not:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>Use the Service for any illegal or unauthorized purposes.</li>
          <li>
            Misuse, interfere with, or disrupt the Service, including accessing
            any part of the Service that you are not authorized to access.
          </li>
          <li>
            Extract or attempt to extract data, scrape, or reverse engineer any
            part of the Service, except as permitted under the AGPL-3.0 License.
          </li>
          <li>Submit false or misleading information.</li>
        </ul>
        <p className="mt-4">
          You acknowledge and agree that Mapform may, at its sole discretion,
          suspend or terminate your account for violation of these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          5. Open Source License (AGPL-3.0)
        </h2>
        <p>
          Mapform is licensed under the GNU Affero General Public License v3.0
          (AGPL-3.0). You may use, modify, and distribute the source code of
          Mapform under the terms of this license. Any modifications or
          derivative works that you distribute must also be licensed under the
          AGPL-3.0 and made publicly available.
        </p>
        <p className="mt-4">
          For full details on your rights and obligations under the AGPL-3.0,
          please refer to the{" "}
          <Link
            href="https://github.com/Mapform/Mapform?tab=AGPL-3.0-1-ov-file#readme"
            className="text-blue-600 hover:underline"
          >
            AGPL-3.0 license text
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          6. Subscriptions and Billing
        </h2>
        <p>
          Mapform offers both Free and Pro subscription plans. Pro plan users
          will be billed based on the plan they select. All payments are
          non-refundable, except as required by law. Subscription fees may
          change, and notice of any changes will be provided to you in advance.
          You may cancel your subscription at any time, but cancellation will
          only take effect at the end of the current billing cycle.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          7. Data Collection and Privacy
        </h2>
        <p>
          Mapform collects and processes only basic personally identifiable
          information (PII), such as your email address. No other PII or
          location data is stored by Mapform directly. However, users of the
          Service have the ability to store data at their discretion, which may
          include PII or other sensitive information. By using the Service, you
          agree to the collection and use of your basic information in
          accordance with Mapform&apos;s Privacy Policy. Mapform does not sell
          or share your personal information with third parties without your
          consent, except as required by law. Users are responsible for ensuring
          that the data they store complies with applicable laws, including data
          protection and privacy regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          8. Limitation of Liability
        </h2>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis without any warranties, express or implied.
          Mapform makes no guarantee that the Service will meet your needs, be
          error-free, uninterrupted, or secure.
        </p>
        <p className="mt-4">
          In no event shall Mapform or its affiliates, partners, or licensors be
          liable for any direct, indirect, incidental, special, or consequential
          damages arising from the use of or inability to use the Service, even
          if advised of the possibility of such damages. This includes but is
          not limited to damages related to loss of profits, data, or goodwill.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">9. Governing Law</h2>
        <p>
          These Terms will be governed by and construed in accordance with the
          laws of the province of Quebec, Canada, without regard to its conflict
          of laws principles. Any legal action or proceeding related to the
          Service shall be brought exclusively in the courts located in Quebec.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">10. Changes to the Terms</h2>
        <p>
          Mapform reserves the right to modify or update these Terms at any
          time. We will notify you of any material changes by posting the new
          Terms on the website or through other communication. Your continued
          use of the Service following the posting of changes constitutes
          acceptance of those changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">11. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:contact@mapform.com"
            className="text-blue-600 hover:underline"
          >
            contact@mapform.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
