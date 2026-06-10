import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms | Camp Riverbend",
  description:
    "Camp Riverbend's Statement of Privacy and Mobile Terms & Conditions, governing how we collect, use, and protect your personal information.",
};

/** Styling helpers shared across the policy copy. */
const heading =
  "font-camp text-2xl md:text-[1.75rem] text-charcoal font-bold mt-14 mb-4 scroll-mt-28 first:mt-0";
const para = "text-bark leading-relaxed text-body-lg mb-5 last:mb-0";
const list =
  "list-disc pl-6 space-y-1.5 text-bark leading-relaxed text-body-lg mb-5 marker:text-camp-red";

export default function PrivacyPolicyPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Privacy Policy & Terms and Conditions"
        subtitle="Your privacy is our priority"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <Section id="privacy-policy" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <article className="bg-white rounded-3xl shadow-sm p-8 sm:p-10 lg:p-14">
              <p className={para}>
                Protecting your private information is our priority. This
                Statement of Privacy applies to{" "}
                <a
                  href="http://riverbend.campintouch.com"
                  className="text-camp-red underline underline-offset-2 hover:text-camp-red-light transition-colors"
                  rel="noopener noreferrer"
                >
                  http://riverbend.campintouch.com
                </a>{" "}
                and Camp Riverbend Inc. and governs data collection and usage.
                For the purposes of this Privacy Policy, unless otherwise noted,
                all references to Camp Riverbend Inc. include
                http://riverbend.campintouch.com and Camp Riverbend. The Camp
                Riverbend website is an informational site. By using the Camp
                Riverbend website, you consent to the data practices described in
                this statement.
              </p>

              <h2 className={heading}>Collection of your Personal Information</h2>
              <p className={para}>
                In order to better provide you with products and services offered
                on our Site, Camp Riverbend may collect personally identifiable
                information, such as your:
              </p>
              <ul className={list}>
                <li>First and Last Name</li>
                <li>Mailing Address</li>
                <li>E-mail Address</li>
                <li>Phone Number</li>
              </ul>
              <p className={para}>
                Camp Riverbend may also collect anonymous demographic
                information, which is not unique to you, such as your:
              </p>
              <ul className={list}>
                <li>Age</li>
                <li>Gender</li>
              </ul>
              <p className={para}>
                We do not collect any personal information about you unless you
                voluntarily provide it to us. However, you may be required to
                provide certain personal information to us when you elect to use
                certain products or services available on the Site. These may
                include: (a) registering for an account on our Site; (b) entering
                a sweepstakes or contest sponsored by us or one of our partners;
                (c) signing up for special offers from selected third parties;
                (d) sending us an email message; (e) submitting your credit card
                or other payment information when ordering and purchasing products
                and services on our Site. To wit, we will use your information
                for, but not limited to, communicating with you in relation to
                services and/or products you have requested from us. We also may
                gather additional personal or non-personal information in the
                future.
              </p>

              <h2 className={heading}>Use of your Personal Information</h2>
              <p className={para}>
                Camp Riverbend collects and uses your personal information to
                operate its website(s) and deliver the services you have
                requested.
              </p>
              <p className={para}>
                Camp Riverbend may also use your personally identifiable
                information to inform you of other products or services available
                from Camp Riverbend and its affiliates.
              </p>

              <h2 className={heading}>Sharing Information with Third Parties</h2>
              <p className={para}>
                Camp Riverbend does not sell, rent or lease its customer lists or
                mobile data to third parties. We only share mobile data with third
                parties when it is strictly necessary to deliver our service and
                only under binding agreements that ensure confidentiality.
              </p>
              <p className={para}>
                Camp Riverbend may share data with trusted partners to help
                perform statistical analysis, send you email or postal mail,
                provide customer support, or arrange for deliveries. All such
                third parties are prohibited from using your personal information
                except to provide these services to Camp Riverbend, and they are
                required to maintain the confidentiality of your information.
              </p>
              <p className={para}>
                Camp Riverbend may disclose your personal information, without
                notice, if required to do so by law or in the good faith belief
                that such action is necessary to: (a) conform to the edicts of the
                law or comply with legal process served on Camp Riverbend or the
                site; (b) protect and defend the rights or property of Camp
                Riverbend; and/or (c) act under exigent circumstances to protect
                the personal safety of users of Camp Riverbend, or the public.
              </p>

              <h2 className={heading}>Mobile Terms and Conditions</h2>
              <p className={para}>
                Messages will be used by Camp to send both customer care
                (non-marketing) and marketing/promotional messages to parents of
                enrolled campers and camp staff. Message types will include camper
                transportation updates, schedule changes, registration reminders,
                promotional announcements, required form notifications, and
                important camp and staff-related information.
              </p>
              <p className={para}>
                <strong className="text-charcoal font-semibold">
                  Opt-out instructions:
                </strong>{" "}
                Reply <strong className="text-charcoal font-semibold">STOP</strong>{" "}
                to unsubscribe. Reply{" "}
                <strong className="text-charcoal font-semibold">START</strong> to
                re-subscribe.
              </p>
              <p className={para}>
                Message frequency varies. &ldquo;Message and data rates may
                apply&rdquo; disclaimer.
              </p>

              <h2 className={heading}>Tracking User Behavior</h2>
              <p className={para}>
                Camp Riverbend may keep track of the websites and pages our users
                visit within Camp Riverbend, in order to determine what Camp
                Riverbend services are the most popular. This data is used to
                deliver customized content and advertising within Camp Riverbend
                to customers whose behavior indicates that they are interested in
                a particular subject area.
              </p>

              <h2 className={heading}>Automatically Collected Information</h2>
              <p className={para}>
                Information about your computer hardware and software may be
                automatically collected by Camp Riverbend. This information can
                include: your IP address, browser type, domain names, access times
                and referring website addresses. This information is used for the
                operation of the service, to maintain quality of the service, and
                to provide general statistics regarding use of the Camp Riverbend
                website.
              </p>

              <h2 className={heading}>Use of Cookies</h2>
              <p className={para}>
                The Camp Riverbend website may use &ldquo;cookies&rdquo; to help
                you personalize your online experience. A cookie is a text file
                that is placed on your hard disk by a web page server. Cookies
                cannot be used to run programs or deliver viruses to your computer.
                Cookies are uniquely assigned to you, and can only be read by a web
                server in the domain that issued the cookie to you.
              </p>
              <p className={para}>
                One of the primary purposes of cookies is to provide a convenience
                feature to save you time. The purpose of a cookie is to tell the
                Web server that you have returned to a specific page. For example,
                if you personalize Camp Riverbend pages, or register with Camp
                Riverbend site or services, a cookie helps Camp Riverbend to recall
                your specific information on subsequent visits. This simplifies the
                process of recording your personal information, such as billing
                addresses, shipping addresses, and so on. When you return to the
                same Camp Riverbend website, the information you previously provided
                can be retrieved, so you can easily use the Camp Riverbend features
                that you customized.
              </p>
              <p className={para}>
                You have the ability to accept or decline cookies. Most Web
                browsers automatically accept cookies, but you can usually modify
                your browser setting to decline cookies if you prefer. If you
                choose to decline cookies, you may not be able to fully experience
                the interactive features of the Camp Riverbend services or websites
                you visit.
              </p>

              <h2 className={heading}>Links</h2>
              <p className={para}>
                This website contains links to other sites. Please be aware that we
                are not responsible for the content or privacy practices of such
                other sites. We encourage our users to be aware when they leave our
                site and to read the privacy statements of any other site that
                collects personally identifiable information.
              </p>

              <h2 className={heading}>Security of your Personal Information</h2>
              <p className={para}>
                Camp Riverbend secures your personal information from unauthorized
                access, use, or disclosure. Camp Riverbend uses the following
                methods for this purpose:
              </p>
              <ul className={list}>
                <li>SSL Protocol</li>
              </ul>
              <p className={para}>
                When personal information (such as a credit card number) is
                transmitted to other websites, it is protected through the use of
                encryption, such as the Secure Sockets Layer (SSL) protocol.
              </p>
              <p className={para}>
                We strive to take appropriate security measures to protect against
                unauthorized access to or alteration of your personal information.
                Unfortunately, no data transmission over the Internet or any
                wireless network can be guaranteed to be 100% secure. As a result,
                while we strive to protect your personal information, you
                acknowledge that: (a) there are security and privacy limitations
                inherent to the Internet which are beyond our control; and (b)
                security, integrity, and privacy of any and all information and
                data exchanged between you and us through this Site cannot be
                guaranteed.
              </p>

              <h2 className={heading}>Children Under Thirteen</h2>
              <p className={para}>
                Camp Riverbend does not knowingly collect personally identifiable
                information from children under the age of thirteen. If you are
                under the age of thirteen, you must ask your parent or guardian for
                permission to use this website.
              </p>

              <h2 className={heading}>E-mail Communications</h2>
              <p className={para}>
                From time to time, Camp Riverbend may contact you via email for the
                purpose of providing announcements, promotional offers, alerts,
                confirmations, surveys, and/or other general communication. In
                order to improve our Services, we may receive a notification when
                you open an email from Camp Riverbend or click on a link therein.
              </p>
              <p className={para}>
                If you would like to stop receiving marketing or promotional
                communications via email from Camp Riverbend, you may opt out of
                such communications by clicking on the UNSUBSCRIBE button.
              </p>

              <h2 className={heading}>External Data Storage Sites</h2>
              <p className={para}>
                We may store your data on servers provided by third party hosting
                vendors with whom we have contracted.
              </p>

              <h2 className={heading}>Changes to this Statement</h2>
              <p className={para}>
                Camp Riverbend reserves the right to change this Privacy Policy from
                time to time. We will notify you about significant changes in the
                way we treat personal information by sending a notice to the primary
                email address specified in your account, by placing a prominent
                notice on our site, and/or by updating any privacy information on
                this page. Your continued use of the Site and/or Services available
                through this Site after such modifications will constitute your: (a)
                acknowledgment of the modified Privacy Policy; and (b) agreement to
                abide and be bound by that Policy.
              </p>

              <h2 className={heading}>Contact Information</h2>
              <p className={para}>
                Camp Riverbend welcomes your questions or comments regarding this
                Statement of Privacy. If you believe that Camp Riverbend has not
                adhered to this Statement, please contact Camp Riverbend at:
              </p>

              <div className="mt-6 rounded-2xl bg-cream border border-bark/10 p-6 sm:p-8">
                <p className="font-camp text-lg font-bold text-charcoal mb-1">
                  Camp Riverbend Inc.
                </p>
                <address className="not-italic text-bark leading-relaxed">
                  116 Hillcrest Road
                  <br />
                  Warren, New Jersey 07059
                </address>
                <p className="mt-4 text-bark">
                  <span className="font-semibold text-charcoal">
                    Telephone number:
                  </span>
                  <br />
                  <a
                    href="tel:9085802267"
                    className="text-camp-red underline underline-offset-2 hover:text-camp-red-light transition-colors"
                  >
                    908-580-2267
                  </a>
                </p>
              </div>

              <p className="mt-10 pt-6 border-t border-bark/10 text-sm text-bark-light">
                Effective as of July 14, 2018
              </p>
            </article>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
