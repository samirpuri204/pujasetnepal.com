import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { nav, site } from "@/lib/site";

const EXTERNAL = [
  { href: site.links.github, label: "This website's source" },
  { href: site.links.issues, label: "Issues" },
  { href: site.links.weights, label: "Jaynepal 1.1 on Hugging Face" },
  { href: site.links.creator, label: `${site.creator.name} (${site.creator.handle})` },
];

const IN_PAGE = [
  { href: "/docs#model", label: "Model card" },
  { href: "/docs#api", label: "API reference" },
  { href: "/docs#access", label: "Access and status" },
  { href: "/docs#limits", label: "Limits and roadmap" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[72rem] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size={22} />
              <span className="font-mono text-[14px] font-semibold tracking-tight">
                {site.name}
              </span>
              <span className="rounded border border-[var(--border-strong)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]">
                {site.model.version}
              </span>
            </div>
            <p className="mt-3 max-w-[44ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
              {site.model.name} is a Nepali language model made in Nepal and
              served from a hosted, OpenAI-compatible endpoint at{" "}
              {site.domain}.
            </p>
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--faint)]">
              Made in Nepal · {site.creator.place}
            </p>
          </div>

          <nav aria-label="Site">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
              Site
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--accent-text)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Project">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
              Project
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {EXTERNAL.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--accent-text)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-[var(--faint)]">
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {IN_PAGE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[12.5px] text-[var(--faint)] transition-colors duration-150 hover:text-[var(--muted)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
