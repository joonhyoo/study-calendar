import { Link } from "react-router-dom";

const LAST_UPDATED = "March 13, 2026";

const sections = [
  {
    id: "overview",
    num: "01",
    title: "Overview",
    content: `Shuu is a habit tracking application. This policy explains what data we collect, why we collect it, and how it is handled. We collect only what is necessary to make the app work.`,
  },
  {
    id: "data-collected",
    num: "02",
    title: "What We Collect",
    content: `When you sign in with Google, we receive your name, email address, and profile picture. We store this alongside the habit data you create — habit names, completion records, etc. We do not collect payment info, location data, or anything beyond what is needed to run your account.`,
  },
  {
    id: "how-used",
    num: "03",
    title: "How We Use It",
    content: `Your data is used solely to provide Shuu: authenticating your account, saving your habits, and showing your progress. We do not sell your data, use it for advertising, or share it with third parties beyond the infrastructure required to run the app (Supabase for database and authentication).`,
  },
  {
    id: "google",
    num: "04",
    title: "Google OAuth",
    content: `Shuu uses Google OAuth for sign-in only. We do not access Gmail, Drive, Contacts, or any other Google service. The only scopes requested are your basic profile and email. Our use of Google user data complies with the Google API Services User Data Policy, including Limited Use requirements.`,
  },
  {
    id: "storage",
    num: "05",
    title: "Data Storage",
    content: `Your data is stored on Supabase-managed infrastructure. If you wish to delete your account, please contact the email below.`,
  },
  {
    id: "contact",
    num: "06",
    title: "Contact",
    content: `Questions? Email joonhyoo@keio.jp and I'll respond within a reasonable timeframe.`,
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#0e0e0d] text-[#e8e4dc] flex flex-col w-full items-center">
    {/* Nav */}
    <nav className="flex justify-between items-center px-10 py-6 border-b border-[#232320] w-full">
      <Link to="/" className="text-xl text-[#e8e4dc] no-underline">
        Shu<em className="italic text-[#c8622a]">u</em>
      </Link>
      <Link
        to="/"
        className="text-[0.7rem] tracking-widest uppercase text-[#5a5a52] no-underline hover:text-[#e8e4dc] transition-colors"
      >
        ← Home
      </Link>
    </nav>

    {/* Content */}
    <main className="flex-1 max-w-xl px-10 py-20">
      {/* Header */}
      <header className="mb-16">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c8622a] mb-4">
          Legal — shuu.xyz
        </p>
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-tight tracking-tight text-[#e8e4dc] mb-3">
          Privacy <em className="italic text-[#c8622a]">Policy.</em>
        </h1>
        <p className="text-[0.68rem] tracking-wider text-[#5a5a52]">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      {/* Sections */}
      {sections.map(({ id, num, title, content }) => (
        <section key={id} id={id} className="py-8 border-t border-[#232320]">
          <p className="text-[0.6rem] tracking-[0.15em] uppercase text-[#5a5a52] mb-2">
            §{num}
          </p>
          <h2 className="italic text-[1.3rem] text-[#e8e4dc] mb-3">{title}</h2>
          <p className="text-[0.8rem] leading-loose text-[#5a5a52] ">
            {content}
          </p>
        </section>
      ))}
      {/* Google disclosure */}
      <div className="mt-10 p-5 border border-[#232320] text-[0.75rem] leading-relaxed text-[#5a5a52]">
        <strong className="text-[#e8e4dc] ">Google API Limited Use — </strong>
        Shuu's use of information received from Google APIs adheres to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noreferrer"
          className="text-[#c8622a] no-underline hover:underline"
        >
          Google API Services User Data Policy
        </a>
        , including Limited Use requirements. We only use Google account data to
        authenticate users and do not transfer it to any other party.
      </div>
    </main>

    {/* Footer */}
    <footer className="border-t border-[#232320] px-10 py-5 flex justify-between text-[0.65rem] tracking-wider text-[#5a5a52] w-full">
      <span>© {new Date().getFullYear()} Shuu</span>
      <Link
        to="/"
        className="text-[#5a5a52] no-underline hover:text-[#c8622a] transition-colors"
      >
        ← Home
      </Link>
    </footer>
  </div>
);

export default PrivacyPolicy;
