export function BlogHero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-indigo-500/20 to-transparent opacity-90 blur-3xl" />
      <div className="absolute -right-16 top-10 hidden h-72 w-72 rounded-full bg-blue-500/30 blur-3xl sm:block lg:h-96 lg:w-96" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          {/* Left content */}
          <div className="space-y-10 text-white">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 shadow-lg shadow-blue-600/30 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Fresh insights for 2025 creators
              <a
                href="#articles"
                className="ml-3 text-emerald-300 underline-offset-4 hover:underline"
              >
                See the latest →
              </a>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Grow faster with{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  no-fluff tech reviews & playbooks
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-200">
                PickPoynt curates deep-dive reviews, experimentation logs, and practical frameworks
                for modern builders. Every guide is battle tested on real products, not written by AI
                on autopilot.
              </p>
            </div>

            <ul className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
              {[
                'Independent testing across AI, SaaS, and creator tools',
                'Playbooks for shipping content, workflows, and revenue faster',
                'Weekly benchmarks & teardowns of high-performing campaigns',
                'Actionable checklists you can run with your team today'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#articles"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
              >
                Dive into the library
              </a>
              <a
                href="/about"
                className="text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                How we test products →
              </a>
            </div>

            <div className="flex flex-wrap gap-8 text-center text-sm text-slate-200/80">
              <div>
                <p className="text-3xl font-semibold text-white">12K+</p>
                <p>operators subscribe weekly</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">187</p>
                <p>playbooks shipped this year</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">92%</p>
                <p>open rate on launch alerts</p>
              </div>
            </div>
          </div>

          {/* Newsletter card */}
          <div className="rounded-3xl bg-white/95 p-8 shadow-2xl shadow-blue-900/20 backdrop-blur dark:bg-slate-900/80">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900 dark:bg-blue-900/40 dark:text-blue-100">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Free Newsletter
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Get the Monday Signals briefing
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              One actionable teardown, two AI workflows, and a monetization benchmark delivered every
              Monday. No spam, only experiments that moved our own metrics.
            </p>

            <form className="mt-8 space-y-4" action="https://app.convertkit.com/forms" method="POST">
              <div>
                <label
                  htmlFor="subscriber-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  First name
                </label>
                <input
                  id="subscriber-name"
                  name="name"
                  type="text"
                  placeholder="Avery"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="subscriber-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Work email
                </label>
                <input
                  id="subscriber-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Subscribe & get the latest teardown
              </button>
            </form>

            <div className="mt-6 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ✓
                </span>
                Zero spam. Unsubscribe anytime with one click.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ✓
                </span>
                12,000+ founders, PMs, and growth leads already onboard.
              </p>
              <p className="text-[11px]">
                By subscribing you agree to receive PickPoynt updates. We respect your inbox and only
                send value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
