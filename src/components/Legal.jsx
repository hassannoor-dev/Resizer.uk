import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'
import Footer from './Footer'
import Nav from './Nav'
import usePageMeta from '../utils/usePageMeta'
import { legalPages } from '../data/meta.js'
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '../data/platforms'

const domain = SITE_URL.replace(/^https?:\/\//, '')
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
const ext = (href, label) => <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>

// TIP: every clause is one row: [number, bold lead-in word(s), text, optional (a)(b)(c) list]. Edit the text here, add a row to add a clause.
// Renumber by hand if you add or remove clauses.
function Clauses({ rows }) {
  return rows.map(([n, lead, body, items]) => (
    <div key={n}>
      <p className={`cl${n.endsWith('.1') ? ' cl-first' : ''}`}>
        <b className="no">{n}</b>
        {lead && <b className="lead">{lead}. </b>}
        {body}
      </p>
      {items && (
        <ol className="cl-list">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      )}
    </div>
  ))
}

const privacy = [
  ['1.1', 'Scope', <>This Privacy Policy (the “Policy”) describes how {SITE_NAME} (the “Company”, “we”, “us” or “our”), the operator of {domain} and the tools, content and features made available through it (together, the “Service”), collects, uses, discloses and protects personal data relating to individuals who access or use the Service (“you” or “User”).</>],
  ['1.2', 'Acceptance', 'By accessing or using the Service, you acknowledge that you have read and understood this Policy. If you do not agree with its terms, you must discontinue use of the Service.'],
  ['1.3', 'Controller', <>For the purposes of applicable data protection laws, including the UK General Data Protection Regulation, the Data Protection Act 2018 and the General Data Protection Regulation (EU) 2016/679 (together, “Data Protection Laws”), the Company acts as the controller of the personal data described in this Policy. The Company may be contacted at {mail}.</>],

  ['2.1', 'Personal data processed', 'The Company processes the following categories of personal data:', [
    'waitlist data, being the email address you submit to join the Pro waitlist and the date of submission;',
    'correspondence data, being the content of any message you send to the Company and the email address from which it is sent;',
    'technical data, being your IP address, browser type and version, device type, operating system, referring page, pages requested, and the date and time of access, which is generated automatically when you access the Service; and',
    'advertising and cookie data, being identifiers and related information collected by third-party advertising partners through cookies and similar technologies, as described in clause 5.',
  ]],
  ['2.2', 'Images', 'Images that you select or drop into the Service are processed locally within your browser and the memory of your device. They are not transmitted to, received by or stored on the Company’s servers, and the Company has no access to them. Accordingly, such images are not personal data processed by the Company.'],

  ['3.1', 'Purposes and legal bases', 'The Company processes personal data for the following purposes, on the following legal bases:', [
    'to administer the Pro waitlist and to notify you when Pro becomes available, on the basis of your consent;',
    'to respond to your enquiries, on the basis of our legitimate interests and, where applicable, to take steps at your request;',
    'to provide, secure, maintain and improve the Service and to detect, prevent and address fraud, abuse and technical issues, on the basis of our legitimate interests;',
    'to display advertising, including personalised advertising where permitted, on the basis of your consent where required by law and otherwise on the basis of our legitimate interests; and',
    'to comply with legal obligations and to establish, exercise or defend legal claims, on the basis of legal obligation or our legitimate interests.',
  ]],
  ['3.2', 'Consent', 'Where the Company relies on your consent, you may withdraw it at any time by contacting the Company, without affecting the lawfulness of processing carried out before withdrawal.'],
  ['3.3', 'Automated decisions', 'The Company does not carry out automated decision-making that produces legal or similarly significant effects on you.'],

  ['4.1', 'Disclosure', 'The Company discloses personal data only as follows:', [
    'to service providers that process personal data on the Company’s behalf, including providers of hosting, content delivery, domain name services, security and email routing (Cloudflare, Inc.) and providers of database services (Supabase, Inc.), each of which is bound by contractual obligations regarding the processing of personal data;',
    'to Google LLC and its affiliates in connection with web fonts and advertising, as described in clause 5;',
    'to professional advisers, courts, regulators and law enforcement authorities where required by law or reasonably necessary to protect rights, property or safety; and',
    'to a successor entity in connection with a merger, acquisition, financing, reorganisation or sale of all or part of the Company’s assets or business.',
  ]],
  ['4.2', 'Fonts', 'The Service loads web fonts from Google Fonts. As a result, your browser sends a request to servers operated by Google, which receives your IP address.'],
  ['4.3', 'No sale for money', 'The Company does not sell personal data in exchange for monetary consideration. The advertising technologies described in clause 5 may nonetheless constitute a “sale” or “sharing” of personal data under certain laws, in which case the opt-out mechanisms in clause 5.4 apply.'],

  ['5.1', 'Advertising', 'The Service displays advertisements provided by third-party advertising networks, including Google AdSense. Third-party vendors, including Google, use cookies or similar technologies to serve advertisements based on a user’s prior visits to the Service and to other websites.'],
  ['5.2', 'Google', 'Google’s use of advertising cookies enables it and its partners to serve advertisements to you based on your visit to the Service and/or other sites on the internet.'],
  ['5.3', 'Consent', 'Where you access the Service from the United Kingdom, the European Economic Area or Switzerland, you will be presented with a consent message and may accept or reject the use of cookies and similar technologies for advertising before they are used. Personalised advertising is displayed only where you have consented.'],
  ['5.4', 'Opt-out', <>You may manage personalised advertising through {ext('https://adssettings.google.com', 'Google Ad Settings')}, review {ext('https://policies.google.com/technologies/partner-sites', 'how Google uses information from sites that use its services')}, or opt out of many third-party advertising networks at {ext('https://optout.aboutads.info', 'optout.aboutads.info')}. You may also block or delete cookies through your browser settings, although parts of the Service may then not function as intended.</>],
  ['5.5', 'Analytics', 'The Company may use analytics tools that measure visits to the Service without the use of cookies. The privacy practices of third-party providers are governed by their own policies.'],

  ['6.1', 'International transfers', 'The Company’s service providers may process personal data in countries outside the United Kingdom and the European Economic Area, including the United States, which may not offer the same level of data protection as your country.'],
  ['6.2', 'Safeguards', 'Where required by Data Protection Laws, such transfers are made subject to appropriate safeguards, such as adequacy decisions, standard contractual clauses, the UK International Data Transfer Addendum or another lawful transfer mechanism.'],

  ['7.1', 'Retention', 'The Company retains personal data only for as long as necessary for the purposes for which it was collected, as follows:', [
    'waitlist data is retained until you withdraw your consent, you request its deletion, or the Company closes the waitlist, whichever occurs first;',
    'correspondence data is retained for as long as necessary to deal with your enquiry and for a reasonable period afterwards; and',
    'technical data is retained by the Company’s hosting provider in accordance with that provider’s retention schedule.',
  ]],
  ['7.2', 'Deletion', 'Once retention is no longer required, personal data is deleted or anonymised, unless the law requires it to be kept.'],

  ['8.1', 'Your rights', 'Subject to the conditions and exceptions in Data Protection Laws, you have the right to:', [
    'request access to the personal data the Company holds about you;',
    'request rectification of inaccurate or incomplete personal data;',
    'request erasure of your personal data;',
    'request restriction of, or object to, the processing of your personal data;',
    'receive your personal data in a structured, commonly used and machine-readable format;',
    'withdraw consent at any time where processing is based on consent; and',
    'lodge a complaint with a supervisory authority, including the UK Information Commissioner’s Office.',
  ]],
  ['8.2', 'Exercising rights', <>To exercise any of these rights, contact the Company at {mail}. The Company may require information to verify your identity and will respond within the period required by Data Protection Laws. No fee is normally charged.</>],
  ['8.3', 'Other jurisdictions', 'Residents of other jurisdictions, including certain states of the United States, may have additional rights, such as the right to know, correct and delete personal data and to opt out of its sale or sharing. These may be exercised in the same manner.'],

  ['9.1', 'Security', 'The Company implements appropriate technical and organisational measures to protect personal data, including encryption in transit, restricted access to its systems and storage of confidential credentials on the server side only.'],
  ['9.2', 'No guarantee', 'No method of transmission or storage is completely secure, and the Company does not warrant the absolute security of personal data. Where required by law, the Company will notify affected persons and the competent authorities of a personal data breach.'],

  ['10.1', 'Children', 'The Service is not directed at children under the age of 13, or such higher age as applies in your jurisdiction. The Company does not knowingly collect personal data from children. If you believe that a child has provided personal data to the Company, please contact the Company so that it may be deleted.'],

  ['11.1', 'Third-party websites', 'The Service may contain links to third-party websites and services. The Company is not responsible for their content or privacy practices.'],

  ['12.1', 'Changes', 'The Company may amend this Policy from time to time. Amendments take effect on publication on the Service, and the date stated above indicates when this Policy was last revised. Where an amendment materially affects how personal data is processed, the Company will provide notice through the Service. Continued use of the Service constitutes acceptance of the amended Policy.'],

  ['13.1', 'Contact', <>Questions, requests and complaints regarding this Policy may be sent to {mail}.</>],
]

const terms = [
  ['1.1', 'Agreement', <>These Terms of Use (the “Terms”) constitute a legally binding agreement between you (“you” or “User”) and {SITE_NAME} (the “Company”, “we”, “us” or “our”) governing your access to and use of {domain} and the tools, content, guides and features made available through it (together, the “Service”). By accessing, browsing or using the Service, you acknowledge that you have read, understood and agree to be bound by these Terms and by the <Link to="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference. If you do not agree, you must not access or use the Service.</>],
  ['1.2', 'Eligibility', 'You must be at least 13 years of age to use the Service. If you are under the age of majority in your jurisdiction, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. If you use the Service on behalf of an entity, you represent that you have authority to bind that entity to these Terms.'],
  ['1.3', 'Amendments', 'The Company may amend these Terms at any time. Amendments take effect on publication on the Service, and the date stated above indicates when these Terms were last revised. Continued use of the Service after publication constitutes acceptance of the amended Terms.'],

  ['2.1', 'The Service', 'The Service provides browser-based image resizing tools and related informational guidance.'],
  ['2.2', 'Licence', 'Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable and revocable licence to access and use the Service for your personal or internal business purposes.'],
  ['2.3', 'Availability', 'The Company may modify, suspend, restrict or discontinue the Service or any part of it at any time, with or without notice, and shall have no liability to you or any third party for doing so.'],
  ['2.4', 'Pre-release features', 'Features designated as “Pro”, “beta” or “coming soon” are subject to change or withdrawal and may be offered on different terms.'],

  ['3.1', 'Ownership', 'As between you and the Company, you retain all rights in the images you use with the Service (“User Content”). Because User Content is processed locally on your device and is not transmitted to the Company, the Company does not obtain any licence or other right in it.'],
  ['3.2', 'Responsibility', 'You are solely responsible for User Content and for your use of any output generated through the Service. You represent and warrant that you own, or hold all rights, licences, consents and permissions necessary to use, edit and publish, the User Content, and that its use does not infringe or violate any law or any right of a third party.'],
  ['3.3', 'No review', 'The Company does not monitor, review, store or endorse User Content and assumes no responsibility for it.'],

  ['4.1', 'Restrictions', 'You shall not, and shall not permit any third party to:', [
    'use the Service for any unlawful purpose or to process unlawful content;',
    'infringe or violate the intellectual property, privacy or other rights of any person;',
    'interfere with, disrupt, overload or impair the Service or the systems that support it;',
    'attempt to gain unauthorised access to the Service, probe or test its vulnerabilities, or circumvent any security measure or usage limit;',
    'scrape, harvest or extract data from the Service by automated means, other than by search engines in accordance with the Service’s robots.txt file;',
    'copy, modify, distribute, decompile or reverse engineer any part of the Service, except to the extent such restriction is prohibited by law; or',
    'submit false, misleading or automated entries, including to the Pro waitlist or the Company’s contact address.',
  ]],
  ['4.2', 'Enforcement', 'The Company may investigate any suspected breach of this clause 4 and may take any action it considers appropriate, including blocking access to the Service.'],

  ['5.1', 'Ownership of the Service', 'The Service, including its design, source code, software, text, graphics, guides, logos and the name “Resizer”, is owned by the Company or its licensors and is protected by intellectual property laws. Except for the licence in clause 2.2, no right, title or interest is granted to you.'],
  ['5.2', 'Third-party marks', 'LinkedIn, Facebook, YouTube, Instagram, X and other names are trademarks of their respective owners. The Company is not affiliated with, endorsed by or sponsored by any of them.'],
  ['5.3', 'Feedback', 'Any suggestion or feedback you provide may be used by the Company without restriction, compensation or obligation to you.'],

  ['6.1', 'Informational content', 'Recommended image dimensions, specifications and guidance made available through the Service are compiled from public platform documentation and general practice. They are provided for general information only, may be changed by the relevant platforms without notice, and do not constitute professional advice.'],
  ['6.2', 'No assurance', 'The Company makes no representation that such information is accurate, complete or current, or that any platform will accept or display an image as intended. You are responsible for verifying requirements with the relevant platform.'],

  ['7.1', 'Third-party services', 'The Service displays advertisements provided by third parties and may contain links to, or integrations with, third-party websites and services. The Company does not control and is not responsible for their content, products, services or practices. Your dealings with them are solely between you and them and are governed by their own terms.'],
  ['7.2', 'No endorsement', 'The inclusion of an advertisement or link does not constitute an endorsement by the Company.'],

  ['8.1', 'Pro waitlist', 'Joining the Pro waitlist is voluntary and does not create a contract, licence or obligation on either party. The Company makes no commitment as to whether, when or on what terms Pro will be launched, including its features or price.'],
  ['8.2', 'Communications', 'By joining the waitlist you consent to receive emails from the Company about Pro. You may withdraw that consent at any time by contacting the Company.'],

  ['9.1', 'Disclaimer', 'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.'],
  ['9.2', 'No warranty of results', 'WITHOUT LIMITING CLAUSE 9.1, THE COMPANY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE, THAT ANY DEFECT WILL BE CORRECTED, THAT ANY OUTPUT WILL BE OF A PARTICULAR QUALITY OR MEET YOUR REQUIREMENTS, OR THAT THE SERVICE WILL BE COMPATIBLE WITH YOUR DEVICE OR BROWSER.'],
  ['9.3', 'Your risk', 'YOU USE THE SERVICE AT YOUR OWN RISK AND ARE RESPONSIBLE FOR RETAINING A COPY OF YOUR ORIGINAL IMAGES.'],

  ['10.1', 'Exclusion of damages', 'TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS OWNERS, OFFICERS, EMPLOYEES, CONTRACTORS, AFFILIATES, LICENSORS OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, AND EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.'],
  ['10.2', 'Cap', 'TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY’S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID TO THE COMPANY FOR USE OF THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, WHICH THE PARTIES ACKNOWLEDGE IS ZERO WHERE THE SERVICE IS PROVIDED FREE OF CHARGE.'],
  ['10.3', 'Exceptions', 'Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law, including liability for fraud or fraudulent misrepresentation or for death or personal injury caused by negligence, nor does it affect any statutory consumer rights that cannot lawfully be waived.'],
  ['10.4', 'Allocation of risk', 'The parties acknowledge that the limitations in this clause 10 reflect a reasonable allocation of risk, that they form an essential basis of the bargain, and that the Company would not provide the Service free of charge without them.'],

  ['11.1', 'Indemnity', 'To the extent permitted by applicable law, you shall defend, indemnify and hold harmless the Company and its owners, officers, employees, contractors, affiliates and licensors from and against any claim, liability, damage, loss, cost and expense (including reasonable legal fees) arising out of or relating to:', [
    'your User Content;',
    'your use or misuse of the Service;',
    'your breach of these Terms or of any applicable law; or',
    'your infringement or violation of any right of a third party.',
  ]],
  ['11.2', 'Conduct of claims', 'The Company may assume the exclusive defence and control of any matter subject to indemnification, at your expense, and you shall cooperate with the Company and shall not settle any such matter without the Company’s prior written consent.'],

  ['12.1', 'Termination', 'The Company may suspend or terminate your access to the Service at any time, with or without cause or notice. You may stop using the Service at any time.'],
  ['12.2', 'Survival', 'Clauses 3, 5, 9, 10, 11, 14 and 15, and any other provision which by its nature should survive, shall survive termination.'],

  ['13.1', 'Force majeure', 'The Company shall not be liable for any failure or delay in providing the Service caused by events beyond its reasonable control, including failures of hosting, telecommunications or internet infrastructure, cyber attacks, acts of God, war, terrorism, strikes, or governmental action.'],

  ['14.1', 'Governing law', 'These Terms and any dispute arising out of or in connection with them or the Service are governed by and construed in accordance with the laws of the jurisdiction in which the Company is established, without regard to its conflict of law rules.'],
  ['14.2', 'Informal resolution', 'Before commencing any proceedings, you agree to notify the Company in writing of the dispute and to attempt in good faith to resolve it for at least thirty (30) days.'],
  ['14.3', 'Courts', 'Subject to clause 14.4, the courts of that jurisdiction have exclusive jurisdiction to settle any such dispute.'],
  ['14.4', 'Consumers', 'Nothing in this clause 14 affects any mandatory consumer protection rights you may have, or any right you may have under the law of your country of residence to bring proceedings before your local courts, which cannot lawfully be waived.'],

  ['15.1', 'Entire agreement', 'These Terms, together with the Privacy Policy, constitute the entire agreement between you and the Company regarding the Service and supersede all prior understandings on that subject.'],
  ['15.2', 'Severability', 'If any provision of these Terms is held to be invalid or unenforceable, that provision shall be enforced to the maximum extent permissible and the remaining provisions shall remain in full force and effect.'],
  ['15.3', 'No waiver', 'A failure or delay by the Company in exercising any right shall not operate as a waiver of that right.'],
  ['15.4', 'Assignment', 'You may not assign or transfer these Terms or any right under them without the Company’s prior written consent. The Company may assign these Terms without restriction.'],
  ['15.5', 'Notices', <>The Company may give notice to you by posting on the Service or by email to an address you have provided. Notices to the Company must be sent to {mail}.</>],
  ['15.6', 'Language', 'These Terms are drafted in English, and the English version prevails over any translation.'],

  ['16.1', 'Contact', <>Questions regarding these Terms may be sent to {mail}.</>],
]

export default function Legal({ kind }) {
  const navigate = useNavigate()
  const page = legalPages.find((p) => p.path === `/${kind}/`)
  usePageMeta(page)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav />
      <div className="shell slim" />
      <main className="legal">
        <Link to="/" className="back"><FaArrowLeft /> Back to {SITE_NAME}</Link>
        <h1>{kind === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}</h1>
        <p className="muted">Last updated November 2026</p>
        <Clauses rows={kind === 'privacy' ? privacy : terms} />
      </main>
      <Footer onPick={() => navigate('/')} />
    </>
  )
}