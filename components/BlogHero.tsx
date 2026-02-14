export function BlogHero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/40 via-red-500/20 to-transparent opacity-90 blur-3xl" />
      <div className="absolute -right-16 top-10 hidden h-72 w-72 rounded-full bg-orange-500/30 blur-3xl sm:block lg:h-96 lg:w-96" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          {/* Left content */}
          <div className="space-y-10 text-white">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-100 shadow-lg shadow-orange-600/30 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Fresh recipes for 2025
              <a
                href="#articles"
                className="ml-3 text-emerald-300 underline-offset-4 hover:underline"
              >
                See the latest →
              </a>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Master the art of cooking with{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  expert recipes & culinary guides
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-200">
                foodPoynt curates inspired recipes, kitchen tips, and practical
                cooking guides for modern home chefs. Every dish is hand-tested by culinary experts
                to help you elevate your meals.
              </p>
            </div>

            <ul className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
              {[
                'Expert cooking tips for every skill level',
                'Step-by-step recipes and meal prep guides',
                'Curated kitchen gadget recommendations',
                'Seasonal ingredient guides and flavor pairings'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 text-amber-200">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#articles"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-600/40 transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
              >
                Browse Recipes
              </a>
              <a
                href="/about"
                className="text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                Our cooking philosophy →
              </a>
            </div>

            <div className="flex flex-wrap gap-8 text-center text-sm text-slate-200/80">
              <div>
                <p className="text-3xl font-semibold text-white">12K+</p>
                <p>chefs subscribe weekly</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">187</p>
                <p>recipes published this year</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">92%</p>
                <p>success rate on first try</p>
              </div>
            </div>
          </div>

          {/* Newsletter card */}
          <div className="rounded-3xl bg-white/95 p-8 shadow-2xl shadow-orange-900/20 backdrop-blur dark:bg-slate-900/80">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-900 dark:bg-orange-900/40 dark:text-orange-100">
              <span className="h-2 w-2 rounded-full bg-orange-600" />
              Free Newsletter
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Get the Weekly Flavor briefing
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              One new recipe, two kitchen hacks, and a seasonal ingredient spotlight delivered
              every Monday. No spam, only delicious inspiration to fuel your week.
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
                  placeholder="Sarah"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="subscriber-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email address
                </label>
                <input
                  id="subscriber-email"
                  name="email"
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500"
              >
                Subscribe to get recipes
              </button>
            </form>

            <div className="mt-6 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ✓
                </span>
                Zero spam. Delicious recipes delivered weekly.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ✓
                </span>
                12,000+ home cooks already onboard.
              </p>
              <p className="text-[11px]">
                By subscribing you agree to receive foodPoynt updates. We respect your inbox and only
                send value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
