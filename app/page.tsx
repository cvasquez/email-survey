import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      {/* Nav */}
      <nav className="border-b border-[#262626]">
        <div className="mx-auto max-w-5xl flex items-center justify-between h-14 px-6">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Image src="/backtalk-icon.svg" alt="Backtalk" width={28} height={28} />
            Backtalk
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-[#A1A1A1] hover:text-[#EDEDED] transition-colors"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="text-sm font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            Your emails deserve a conversation.
          </h1>
          <p className="mt-6 text-lg text-[#A1A1A1] max-w-2xl mx-auto leading-relaxed">
            Backtalk lets your audience respond to emails with one click. Create
            a survey, drop links in your email, and hear what people actually
            think.
          </p>
          <div className="mt-10">
            <a
              href="/signup"
              className="inline-block bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: 1,
                title: "Create a survey",
                description:
                  "Give it a title. That\u2019s it. No forms to configure, no questions to write.",
              },
              {
                step: 2,
                title: "Add links to your email",
                description:
                  "Each link carries an answer value. \u2018Satisfied\u2019, \u2018Not satisfied\u2019 \u2014 whatever you want to ask.",
              },
              {
                step: 3,
                title: "See what people think",
                description:
                  "Responses stream in as people click. View analytics, filter by answer, export to CSV.",
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6] font-semibold text-sm">
                  {step}
                </div>
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-[#A1A1A1] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bot filtering",
                description:
                  "Automatic detection of email scanners and bots so your data stays clean.",
              },
              {
                title: "Real-time analytics",
                description:
                  "Answer breakdowns, geographic heatmaps, and comment filtering \u2014 all live.",
              },
              {
                title: "Team collaboration",
                description:
                  "Invite your team. Share surveys across your organization.",
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="bg-[#141414] border border-[#262626] rounded-lg p-6"
              >
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-[#A1A1A1] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to hear back?
          </h2>
          <p className="mt-4 text-[#A1A1A1]">
            Start collecting feedback from your email audience in minutes.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="inline-block bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#262626]">
        <div className="mx-auto max-w-5xl flex items-center justify-between h-14 px-6">
          <span className="text-sm font-medium">Backtalk</span>
          <span className="text-sm text-[#666666]">
            &copy; {new Date().getFullYear()} Backtalk
          </span>
        </div>
      </footer>
    </div>
  );
}
