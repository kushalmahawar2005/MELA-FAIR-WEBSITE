"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RefreshCw, Save, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useContentStore } from "@/stores/content-store";
import { CloudinaryUploadButton } from "@/components/admin/cloudinary-upload-button";
import type { ActiveMela, EventPackage, HomeContent } from "@/lib/content";

type ContentEditorSection = keyof HomeContent;

const contentEditorSections: Array<{
  key: ContentEditorSection;
  label: string;
  metric: (draft: HomeContent) => string;
}> = [
  {
    key: "hero",
    label: "Hero",
    metric: (draft) => `${draft.hero.stats.length} stats`,
  },
  {
    key: "portfolio",
    label: "Portfolio",
    metric: (draft) => `${draft.portfolio.experiences.length} cards`,
  },
  {
    key: "planVisit",
    label: "Plan Visit",
    metric: (draft) => `${draft.planVisit.steps.length} steps`,
  },
  {
    key: "rides",
    label: "Rides Section",
    metric: () => "Section copy",
  },
  {
    key: "activeLocations",
    label: "Active Locations",
    metric: (draft) => `${draft.activeLocations.locations.length} locations`,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    metric: (draft) => `${draft.testimonials.reviews.length} reviews`,
  },
  {
    key: "tour",
    label: "Tour Marquee",
    metric: () => "2 rows",
  },
  {
    key: "gallery",
    label: "Gallery",
    metric: (draft) => `${draft.gallery.rows.length} rows`,
  },
  {
    key: "chronicles",
    label: "Chronicles",
    metric: () => "CTA block",
  },
  {
    key: "eventPackages",
    label: "Event Packages",
    metric: (draft) => `${draft.eventPackages.packages.length} packages`,
  },
  {
    key: "ctaStrip",
    label: "CTA Strip",
    metric: () => "CTA block",
  },
  {
    key: "facilities",
    label: "Facilities",
    metric: (draft) => `${draft.facilities.rows.length} rows`,
  },
  {
    key: "faq",
    label: "FAQ",
    metric: (draft) => `${draft.faq.items.length} items`,
  },
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-yellow focus:outline-none";
const labelClass = "text-[11px] uppercase tracking-widest text-white/50";
const sectionCardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Compact, list-style editable row used across every section.
 * Shows a clean one-line summary (optional thumbnail + title + subtitle) with
 * Edit / Remove actions. The full edit fields only appear when "Edit" is clicked.
 */
function ItemRow({
  title,
  subtitle,
  thumb,
  hasThumb = false,
  onRemove,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  thumb?: string;
  hasThumb?: boolean;
  onRemove?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-3 px-3 py-2.5">
        {hasThumb ? (
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {title || "Untitled"}
          </p>
          {subtitle ? (
            <p className="truncate text-[11px] text-white/40">{subtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
            open
              ? "border-accent-yellow/60 bg-accent-yellow/10 text-accent-yellow"
              : "border-white/10 text-white/70 hover:border-accent-yellow hover:text-white"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          {open ? "Close" : "Edit"}
        </button>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/10 p-1.5 text-red-300 transition hover:border-red-400/50 hover:text-red-200"
            aria-label="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="border-t border-white/5 bg-white/[0.01] p-4">{children}</div>
      ) : null}
    </div>
  );
}

function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs font-medium text-accent-yellow transition hover:border-accent-yellow hover:bg-accent-yellow/5"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function ContentManager() {
  const { content, fetchContent, updateContent, isLoading } = useContentStore();
  const [draft, setDraft] = useState<HomeContent>(content);
  const [activeContentSection, setActiveContentSection] =
    useState<ContentEditorSection>("hero");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDraft(content), 0);
    return () => window.clearTimeout(timer);
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateContent(draft);
    setIsSaving(false);
    toast.success("Content updated successfully.");
  };

  const updateSection = <K extends keyof HomeContent>(
    section: K,
    value: HomeContent[K]
  ) => {
    setDraft((prev) => ({ ...prev, [section]: value }));
  };

  const activeSectionMeta =
    contentEditorSections.find((section) => section.key === activeContentSection) ??
    contentEditorSections[0];
  const getSectionCardClass = (section: ContentEditorSection) =>
    activeContentSection === section ? sectionCardClass : "hidden";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-yellow">
            Content Management
          </p>
          <h2 className="mt-2 font-display text-2xl text-white">
            Edit Homepage Sections
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchContent(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-display tracking-widest text-white transition hover:border-accent-yellow disabled:opacity-60"
            disabled={isLoading}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            REFRESH
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-yellow px-4 py-2 text-xs font-display tracking-widest text-deep-purple transition hover:bg-accent-yellow/90 disabled:opacity-60"
            disabled={isSaving || isLoading}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "SAVING..." : "SAVE ALL"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              Sections
            </p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              {contentEditorSections.length}
            </span>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {contentEditorSections.map((section) => {
              const isActive = activeContentSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveContentSection(section.key)}
                  className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-accent-yellow bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/10"
                      : "border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-xs uppercase tracking-wider">
                      {section.label}
                    </span>
                    <span
                      className={`mt-1 block text-[10px] ${
                        isActive ? "text-deep-purple/70" : "text-white/45"
                      }`}
                    >
                      {section.metric(draft)}
                    </span>
                  </span>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      isActive ? "bg-deep-purple" : "bg-white/20"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                Now Editing
              </p>
              <h3 className="mt-1 font-display text-lg text-white">
                {activeSectionMeta.label}
              </h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">
              {activeSectionMeta.metric(draft)}
            </span>
          </div>

      {/* HERO */}
      <section className={getSectionCardClass("hero")}>
        <h3 className="font-display text-lg text-white">Hero</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Offer Enabled</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="checkbox"
                checked={draft.hero.offer.enabled}
                onChange={(event) =>
                  updateSection("hero", {
                    ...draft.hero,
                    offer: { ...draft.hero.offer, enabled: event.target.checked },
                  })
                }
              />
              <span className="text-xs text-white/70">Show offer banner</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Offer Eyebrow</label>
            <input
              className={inputClass}
              value={draft.hero.offer.eyebrow}
              onChange={(event) =>
                updateSection("hero", {
                  ...draft.hero,
                  offer: { ...draft.hero.offer, eyebrow: event.target.value },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Offer Title</label>
            <input
              className={inputClass}
              value={draft.hero.offer.title}
              onChange={(event) =>
                updateSection("hero", {
                  ...draft.hero,
                  offer: { ...draft.hero.offer, title: event.target.value },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Offer CTA</label>
            <input
              className={inputClass}
              value={draft.hero.offer.cta}
              onChange={(event) =>
                updateSection("hero", {
                  ...draft.hero,
                  offer: { ...draft.hero.offer, cta: event.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          <div>
            <label className={labelClass}>Body Copy</label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={draft.hero.body}
              onChange={(event) =>
                updateSection("hero", { ...draft.hero, body: event.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={draft.hero.description}
              onChange={(event) =>
                updateSection("hero", {
                  ...draft.hero,
                  description: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Stats</p>
            <AddButton
              label="Add Stat"
              onClick={() =>
                updateSection("hero", {
                  ...draft.hero,
                  stats: [
                    ...draft.hero.stats,
                    { endValue: 0, suffix: "", label: "New Stat" },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.hero.stats.map((stat, index) => (
              <ItemRow
                key={`${stat.label}-${index}`}
                title={stat.label || "New Stat"}
                subtitle={`${stat.endValue}${stat.suffix}`}
                onRemove={() => {
                  const next = draft.hero.stats.filter((_, i) => i !== index);
                  updateSection("hero", { ...draft.hero, stats: next });
                }}
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={stat.endValue}
                      onChange={(event) => {
                        const next = [...draft.hero.stats];
                        next[index] = {
                          ...stat,
                          endValue: Number(event.target.value),
                        };
                        updateSection("hero", { ...draft.hero, stats: next });
                      }}
                      placeholder="Value"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Suffix</label>
                    <input
                      className={inputClass}
                      value={stat.suffix}
                      onChange={(event) => {
                        const next = [...draft.hero.stats];
                        next[index] = { ...stat, suffix: event.target.value };
                        updateSection("hero", { ...draft.hero, stats: next });
                      }}
                      placeholder="Suffix"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      className={inputClass}
                      value={stat.label}
                      onChange={(event) => {
                        const next = [...draft.hero.stats];
                        next[index] = { ...stat, label: event.target.value };
                        updateSection("hero", { ...draft.hero, stats: next });
                      }}
                      placeholder="Label"
                    />
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className={getSectionCardClass("portfolio")}>
        <h3 className="font-display text-lg text-white">Portfolio</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.portfolio.eyebrow}
              onChange={(event) =>
                updateSection("portfolio", {
                  ...draft.portfolio,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.portfolio.heading}
              onChange={(event) =>
                updateSection("portfolio", {
                  ...draft.portfolio,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Experiences</p>
            <AddButton
              label="Add Experience"
              onClick={() =>
                updateSection("portfolio", {
                  ...draft.portfolio,
                  experiences: [
                    ...draft.portfolio.experiences,
                    {
                      num: "00",
                      title: "New Experience",
                      tagline: "",
                      image: "/p1.jpg",
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.portfolio.experiences.map((exp, index) => (
              <ItemRow
                key={`${exp.title}-${index}`}
                hasThumb
                thumb={exp.image}
                title={exp.title || "New Experience"}
                subtitle={exp.tagline}
                onRemove={() => {
                  const next = draft.portfolio.experiences.filter((_, i) => i !== index);
                  updateSection("portfolio", { ...draft.portfolio, experiences: next });
                }}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Number</label>
                    <input
                      className={inputClass}
                      value={exp.num}
                      onChange={(event) => {
                        const next = [...draft.portfolio.experiences];
                        next[index] = { ...exp, num: event.target.value };
                        updateSection("portfolio", { ...draft.portfolio, experiences: next });
                      }}
                      placeholder="01"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      value={exp.title}
                      onChange={(event) => {
                        const next = [...draft.portfolio.experiences];
                        next[index] = { ...exp, title: event.target.value };
                        updateSection("portfolio", { ...draft.portfolio, experiences: next });
                      }}
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tagline</label>
                    <input
                      className={inputClass}
                      value={exp.tagline}
                      onChange={(event) => {
                        const next = [...draft.portfolio.experiences];
                        next[index] = { ...exp, tagline: event.target.value };
                        updateSection("portfolio", { ...draft.portfolio, experiences: next });
                      }}
                      placeholder="Tagline"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Image</label>
                    <div className="flex min-w-0 gap-2">
                      <input
                        className={inputClass}
                        value={exp.image}
                        onChange={(event) => {
                          const next = [...draft.portfolio.experiences];
                          next[index] = { ...exp, image: event.target.value };
                          updateSection("portfolio", { ...draft.portfolio, experiences: next });
                        }}
                        placeholder="/image.jpg"
                      />
                      <CloudinaryUploadButton
                        folder="naaz-amusement/portfolio"
                        onUploaded={(url) => {
                          const next = [...draft.portfolio.experiences];
                          next[index] = { ...exp, image: url };
                          updateSection("portfolio", { ...draft.portfolio, experiences: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN VISIT */}
      <section className={getSectionCardClass("planVisit")}>
        <h3 className="font-display text-lg text-white">Plan Visit</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.planVisit.eyebrow}
              onChange={(event) =>
                updateSection("planVisit", {
                  ...draft.planVisit,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.planVisit.heading}
              onChange={(event) =>
                updateSection("planVisit", {
                  ...draft.planVisit,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Steps</p>
            <AddButton
              label="Add Step"
              onClick={() =>
                updateSection("planVisit", {
                  ...draft.planVisit,
                  steps: [
                    ...draft.planVisit.steps,
                    {
                      num: "00",
                      title: "New Step",
                      body: "",
                      image: "/p1.jpg",
                      numColor: "text-accent-yellow",
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.planVisit.steps.map((step, index) => (
              <ItemRow
                key={`${step.title}-${index}`}
                hasThumb
                thumb={step.image}
                title={step.title || "New Step"}
                subtitle={`Step ${step.num}`}
                onRemove={() => {
                  const next = draft.planVisit.steps.filter((_, i) => i !== index);
                  updateSection("planVisit", { ...draft.planVisit, steps: next });
                }}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Step Number</label>
                    <input
                      className={inputClass}
                      value={step.num}
                      onChange={(event) => {
                        const next = [...draft.planVisit.steps];
                        next[index] = { ...step, num: event.target.value };
                        updateSection("planVisit", { ...draft.planVisit, steps: next });
                      }}
                      placeholder="01"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      value={step.title}
                      onChange={(event) => {
                        const next = [...draft.planVisit.steps];
                        next[index] = { ...step, title: event.target.value };
                        updateSection("planVisit", { ...draft.planVisit, steps: next });
                      }}
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Image</label>
                    <div className="flex min-w-0 gap-2">
                      <input
                        className={inputClass}
                        value={step.image}
                        onChange={(event) => {
                          const next = [...draft.planVisit.steps];
                          next[index] = { ...step, image: event.target.value };
                          updateSection("planVisit", { ...draft.planVisit, steps: next });
                        }}
                        placeholder="/image.jpg"
                      />
                      <CloudinaryUploadButton
                        folder="naaz-amusement/plan-visit"
                        onUploaded={(url) => {
                          const next = [...draft.planVisit.steps];
                          next[index] = { ...step, image: url };
                          updateSection("planVisit", { ...draft.planVisit, steps: next });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Body Copy</label>
                    <input
                      className={inputClass}
                      value={step.body}
                      onChange={(event) => {
                        const next = [...draft.planVisit.steps];
                        next[index] = { ...step, body: event.target.value };
                        updateSection("planVisit", { ...draft.planVisit, steps: next });
                      }}
                      placeholder="Body"
                    />
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* RIDES */}
      <section className={getSectionCardClass("rides")}>
        <h3 className="font-display text-lg text-white">Rides Section</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.rides.eyebrow}
              onChange={(event) =>
                updateSection("rides", { ...draft.rides, eyebrow: event.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading Lead</label>
            <input
              className={inputClass}
              value={draft.rides.headingLead}
              onChange={(event) =>
                updateSection("rides", {
                  ...draft.rides,
                  headingLead: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading Accent</label>
            <input
              className={inputClass}
              value={draft.rides.headingAccent}
              onChange={(event) =>
                updateSection("rides", {
                  ...draft.rides,
                  headingAccent: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading Trail</label>
            <input
              className={inputClass}
              value={draft.rides.headingTrail}
              onChange={(event) =>
                updateSection("rides", {
                  ...draft.rides,
                  headingTrail: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Subtext</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={draft.rides.subtext}
            onChange={(event) =>
              updateSection("rides", { ...draft.rides, subtext: event.target.value })
            }
          />
        </div>
      </section>

      {/* ACTIVE LOCATIONS */}
      <section className={getSectionCardClass("activeLocations")}>
        <h3 className="font-display text-lg text-white">Active Locations</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.activeLocations.eyebrow}
              onChange={(event) =>
                updateSection("activeLocations", {
                  ...draft.activeLocations,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.activeLocations.heading}
              onChange={(event) =>
                updateSection("activeLocations", {
                  ...draft.activeLocations,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Subtext</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={draft.activeLocations.subtext}
            onChange={(event) =>
              updateSection("activeLocations", {
                ...draft.activeLocations,
                subtext: event.target.value,
              })
            }
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Locations</p>
            <AddButton
              label="Add Location"
              onClick={() =>
                updateSection("activeLocations", {
                  ...draft.activeLocations,
                  locations: [
                    ...draft.activeLocations.locations,
                    {
                      id: "new-location",
                      name: "New Location",
                      city: "",
                      venue: "",
                      status: "UPCOMING",
                      dates: "",
                      details: "",
                      lat: 0,
                      lng: 0,
                      installedRides: [],
                      gmapsLink: "",
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.activeLocations.locations.map((loc, index) => (
              <LocationEditor
                key={`${loc.id}-${index}`}
                location={loc}
                onChange={(next) => {
                  const updated = [...draft.activeLocations.locations];
                  updated[index] = next;
                  updateSection("activeLocations", {
                    ...draft.activeLocations,
                    locations: updated,
                  });
                }}
                onRemove={() => {
                  const updated = draft.activeLocations.locations.filter((_, i) => i !== index);
                  updateSection("activeLocations", {
                    ...draft.activeLocations,
                    locations: updated,
                  });
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Preset Cities</p>
            <AddButton
              label="Add City"
              onClick={() =>
                updateSection("activeLocations", {
                  ...draft.activeLocations,
                  presetCities: [
                    ...draft.activeLocations.presetCities,
                    { name: "New City", lat: 0, lng: 0 },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.activeLocations.presetCities.map((city, index) => (
              <ItemRow
                key={`${city.name}-${index}`}
                title={city.name || "New City"}
                subtitle={`${city.lat}, ${city.lng}`}
                onRemove={() => {
                  const updated = draft.activeLocations.presetCities.filter((_, i) => i !== index);
                  updateSection("activeLocations", {
                    ...draft.activeLocations,
                    presetCities: updated,
                  });
                }}
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>City Name</label>
                    <input
                      className={inputClass}
                      value={city.name}
                      onChange={(event) => {
                        const updated = [...draft.activeLocations.presetCities];
                        updated[index] = { ...city, name: event.target.value };
                        updateSection("activeLocations", {
                          ...draft.activeLocations,
                          presetCities: updated,
                        });
                      }}
                      placeholder="City Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={city.lat}
                      onChange={(event) => {
                        const updated = [...draft.activeLocations.presetCities];
                        updated[index] = { ...city, lat: Number(event.target.value) };
                        updateSection("activeLocations", {
                          ...draft.activeLocations,
                          presetCities: updated,
                        });
                      }}
                      placeholder="Latitude"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={city.lng}
                      onChange={(event) => {
                        const updated = [...draft.activeLocations.presetCities];
                        updated[index] = { ...city, lng: Number(event.target.value) };
                        updateSection("activeLocations", {
                          ...draft.activeLocations,
                          presetCities: updated,
                        });
                      }}
                      placeholder="Longitude"
                    />
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={getSectionCardClass("testimonials")}>
        <h3 className="font-display text-lg text-white">Testimonials</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.testimonials.eyebrow}
              onChange={(event) =>
                updateSection("testimonials", {
                  ...draft.testimonials,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.testimonials.heading}
              onChange={(event) =>
                updateSection("testimonials", {
                  ...draft.testimonials,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Reviews</p>
            <AddButton
              label="Add Review"
              onClick={() =>
                updateSection("testimonials", {
                  ...draft.testimonials,
                  reviews: [
                    ...draft.testimonials.reviews,
                    {
                      name: "New Guest",
                      quote: "",
                      narrative: "",
                      image: "/p1.jpg",
                      rating: 5,
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.testimonials.reviews.map((review, index) => (
              <ItemRow
                key={`${review.name}-${index}`}
                hasThumb
                thumb={review.image}
                title={review.name}
                subtitle={`★ ${review.rating} · ${review.quote}`}
                onRemove={() => {
                  const updated = draft.testimonials.reviews.filter((_, i) => i !== index);
                  updateSection("testimonials", {
                    ...draft.testimonials,
                    reviews: updated,
                  });
                }}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Guest Name</label>
                    <input
                      className={inputClass}
                      value={review.name}
                      onChange={(event) => {
                        const updated = [...draft.testimonials.reviews];
                        updated[index] = { ...review, name: event.target.value };
                        updateSection("testimonials", {
                          ...draft.testimonials,
                          reviews: updated,
                        });
                      }}
                      placeholder="Guest Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Guest Image</label>
                    <div className="flex min-w-0 gap-2">
                      <input
                        className={inputClass}
                        value={review.image}
                        onChange={(event) => {
                          const updated = [...draft.testimonials.reviews];
                          updated[index] = { ...review, image: event.target.value };
                          updateSection("testimonials", {
                            ...draft.testimonials,
                            reviews: updated,
                          });
                        }}
                        placeholder="/image.jpg"
                      />
                      <CloudinaryUploadButton
                        folder="naaz-amusement/testimonials"
                        onUploaded={(url) => {
                          const updated = [...draft.testimonials.reviews];
                          updated[index] = { ...review, image: url };
                          updateSection("testimonials", {
                            ...draft.testimonials,
                            reviews: updated,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Quote</label>
                    <input
                      className={inputClass}
                      value={review.quote}
                      onChange={(event) => {
                        const updated = [...draft.testimonials.reviews];
                        updated[index] = { ...review, quote: event.target.value };
                        updateSection("testimonials", {
                          ...draft.testimonials,
                          reviews: updated,
                        });
                      }}
                      placeholder="Quote"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Rating (1-5)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={review.rating}
                      onChange={(event) => {
                        const updated = [...draft.testimonials.reviews];
                        updated[index] = {
                          ...review,
                          rating: Number(event.target.value),
                        };
                        updateSection("testimonials", {
                          ...draft.testimonials,
                          reviews: updated,
                        });
                      }}
                      min={1}
                      max={5}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Narrative</label>
                    <input
                      className={inputClass}
                      value={review.narrative}
                      onChange={(event) => {
                        const updated = [...draft.testimonials.reviews];
                        updated[index] = { ...review, narrative: event.target.value };
                        updateSection("testimonials", {
                          ...draft.testimonials,
                          reviews: updated,
                        });
                      }}
                      placeholder="Narrative"
                    />
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR */}
      <section className={getSectionCardClass("tour")}>
        <h3 className="font-display text-lg text-white">Tour Marquee</h3>
        <div className="mt-5 grid gap-4">
          <div>
            <label className={labelClass}>Row 1 Text</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              value={draft.tour.row1Text}
              onChange={(event) =>
                updateSection("tour", { ...draft.tour, row1Text: event.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Row 2 Text</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              value={draft.tour.row2Text}
              onChange={(event) =>
                updateSection("tour", { ...draft.tour, row2Text: event.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className={getSectionCardClass("gallery")}>
        <h3 className="font-display text-lg text-white">Gallery</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.gallery.eyebrow}
              onChange={(event) =>
                updateSection("gallery", {
                  ...draft.gallery,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.gallery.heading}
              onChange={(event) =>
                updateSection("gallery", {
                  ...draft.gallery,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {draft.gallery.rows.map((row, rowIndex) => (
            <ItemRow
              key={`row-${rowIndex}`}
              title={`Row ${rowIndex + 1}`}
              subtitle={`${row.length} image${row.length === 1 ? "" : "s"}`}
              onRemove={() => {
                const updated = draft.gallery.rows.filter((_, i) => i !== rowIndex);
                updateSection("gallery", { ...draft.gallery, rows: updated });
              }}
            >
              <div className="space-y-2">
                {row.map((image, imageIndex) => (
                  <ItemRow
                    key={`${image.src}-${imageIndex}`}
                    hasThumb
                    thumb={image.src}
                    title={image.alt || `Image ${imageIndex + 1}`}
                    subtitle={image.src}
                    onRemove={() => {
                      const updated = [...draft.gallery.rows];
                      updated[rowIndex] = updated[rowIndex].filter((_, idx) => idx !== imageIndex);
                      updateSection("gallery", { ...draft.gallery, rows: updated });
                    }}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Image URL</label>
                        <div className="flex min-w-0 gap-2">
                          <input
                            className={inputClass}
                            value={image.src}
                            onChange={(event) => {
                              const updated = [...draft.gallery.rows];
                              updated[rowIndex] = updated[rowIndex].map((item, idx) =>
                                idx === imageIndex ? { ...item, src: event.target.value } : item
                              );
                              updateSection("gallery", { ...draft.gallery, rows: updated });
                            }}
                            placeholder="Image URL"
                          />
                          <CloudinaryUploadButton
                            folder="naaz-amusement/gallery"
                            onUploaded={(url) => {
                              const updated = [...draft.gallery.rows];
                              updated[rowIndex] = updated[rowIndex].map((item, idx) =>
                                idx === imageIndex ? { ...item, src: url } : item
                              );
                              updateSection("gallery", { ...draft.gallery, rows: updated });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Alt Text (SEO)</label>
                        <input
                          className={inputClass}
                          value={image.alt}
                          onChange={(event) => {
                            const updated = [...draft.gallery.rows];
                            updated[rowIndex] = updated[rowIndex].map((item, idx) =>
                              idx === imageIndex ? { ...item, alt: event.target.value } : item
                            );
                            updateSection("gallery", { ...draft.gallery, rows: updated });
                          }}
                          placeholder="Alt text"
                        />
                      </div>
                    </div>
                  </ItemRow>
                ))}
                <AddButton
                  label="Add Image"
                  onClick={() => {
                    const updated = [...draft.gallery.rows];
                    updated[rowIndex] = [...updated[rowIndex], { src: "", alt: "" }];
                    updateSection("gallery", { ...draft.gallery, rows: updated });
                  }}
                />
              </div>
            </ItemRow>
          ))}
          <AddButton
            label="Add Row"
            onClick={() =>
              updateSection("gallery", {
                ...draft.gallery,
                rows: [...draft.gallery.rows, []],
              })
            }
          />
        </div>
      </section>

      {/* CHRONICLES */}
      <section className={getSectionCardClass("chronicles")}>
        <h3 className="font-display text-lg text-white">Chronicles</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.chronicles.eyebrow}
              onChange={(event) =>
                updateSection("chronicles", {
                  ...draft.chronicles,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.chronicles.heading}
              onChange={(event) =>
                updateSection("chronicles", {
                  ...draft.chronicles,
                  heading: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CTA Label</label>
            <input
              className={inputClass}
              value={draft.chronicles.ctaLabel}
              onChange={(event) =>
                updateSection("chronicles", {
                  ...draft.chronicles,
                  ctaLabel: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CTA Href</label>
            <input
              className={inputClass}
              value={draft.chronicles.ctaHref}
              onChange={(event) =>
                updateSection("chronicles", {
                  ...draft.chronicles,
                  ctaHref: event.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* EVENT PACKAGES */}
      <section className={getSectionCardClass("eventPackages")}>
        <h3 className="font-display text-lg text-white">Event Packages</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.eventPackages.eyebrow}
              onChange={(event) =>
                updateSection("eventPackages", {
                  ...draft.eventPackages,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.eventPackages.heading}
              onChange={(event) =>
                updateSection("eventPackages", {
                  ...draft.eventPackages,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Subtext</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={draft.eventPackages.subtext}
            onChange={(event) =>
              updateSection("eventPackages", {
                ...draft.eventPackages,
                subtext: event.target.value,
              })
            }
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Packages</p>
            <AddButton
              label="Add Package"
              onClick={() =>
                updateSection("eventPackages", {
                  ...draft.eventPackages,
                  packages: [
                    ...draft.eventPackages.packages,
                    {
                      id: "new-package",
                      name: "New Package",
                      tagline: "",
                      price: "",
                      duration: "",
                      iconKey: "zap",
                      themeColor:
                        "text-accent-yellow border-accent-yellow/20 hover:border-accent-yellow/50",
                      shadowColor: "rgba(238, 167, 39, 0.15)",
                      highlightText: "",
                      features: [],
                      bestFor: "",
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.eventPackages.packages.map((pkg, index) => (
              <PackageEditor
                key={`${pkg.id}-${index}`}
                pkg={pkg}
                onChange={(next) => {
                  const updated = [...draft.eventPackages.packages];
                  updated[index] = next;
                  updateSection("eventPackages", {
                    ...draft.eventPackages,
                    packages: updated,
                  });
                }}
                onRemove={() => {
                  const updated = draft.eventPackages.packages.filter((_, i) => i !== index);
                  updateSection("eventPackages", {
                    ...draft.eventPackages,
                    packages: updated,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className={getSectionCardClass("ctaStrip")}>
        <h3 className="font-display text-lg text-white">CTA Strip</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.ctaStrip.eyebrow}
              onChange={(event) =>
                updateSection("ctaStrip", {
                  ...draft.ctaStrip,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.ctaStrip.heading}
              onChange={(event) =>
                updateSection("ctaStrip", {
                  ...draft.ctaStrip,
                  heading: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Highlight</label>
            <input
              className={inputClass}
              value={draft.ctaStrip.highlight}
              onChange={(event) =>
                updateSection("ctaStrip", {
                  ...draft.ctaStrip,
                  highlight: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CTA Label</label>
            <input
              className={inputClass}
              value={draft.ctaStrip.ctaLabel}
              onChange={(event) =>
                updateSection("ctaStrip", {
                  ...draft.ctaStrip,
                  ctaLabel: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CTA Href</label>
            <input
              className={inputClass}
              value={draft.ctaStrip.ctaHref}
              onChange={(event) =>
                updateSection("ctaStrip", {
                  ...draft.ctaStrip,
                  ctaHref: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Body</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={draft.ctaStrip.body}
            onChange={(event) =>
              updateSection("ctaStrip", {
                ...draft.ctaStrip,
                body: event.target.value,
              })
            }
          />
        </div>
      </section>

      {/* FACILITIES */}
      <section className={getSectionCardClass("facilities")}>
        <h3 className="font-display text-lg text-white">Facilities</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.facilities.eyebrow}
              onChange={(event) =>
                updateSection("facilities", {
                  ...draft.facilities,
                  eyebrow: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.facilities.heading}
              onChange={(event) =>
                updateSection("facilities", {
                  ...draft.facilities,
                  heading: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {draft.facilities.rows.map((row, rowIndex) => (
            <ItemRow
              key={`facility-row-${rowIndex}`}
              title={`Row ${rowIndex + 1}`}
              subtitle={`${row.length} item${row.length === 1 ? "" : "s"}`}
              onRemove={() => {
                const updated = draft.facilities.rows.filter((_, i) => i !== rowIndex);
                updateSection("facilities", { ...draft.facilities, rows: updated });
              }}
            >
              <div className="space-y-2">
                {row.map((item, itemIndex) => (
                  <ItemRow
                    key={`${item.label}-${itemIndex}`}
                    title={`${item.icon ? `${item.icon} ` : ""}${item.label || `Item ${itemIndex + 1}`}`}
                    onRemove={() => {
                      const updated = [...draft.facilities.rows];
                      updated[rowIndex] = updated[rowIndex].filter((_, idx) => idx !== itemIndex);
                      updateSection("facilities", { ...draft.facilities, rows: updated });
                    }}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Facility Label</label>
                        <input
                          className={inputClass}
                          value={item.label}
                          onChange={(event) => {
                            const updated = [...draft.facilities.rows];
                            updated[rowIndex] = updated[rowIndex].map((cell, idx) =>
                              idx === itemIndex ? { ...cell, label: event.target.value } : cell
                            );
                            updateSection("facilities", { ...draft.facilities, rows: updated });
                          }}
                          placeholder="Label"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Emoji / Icon</label>
                        <input
                          className={inputClass}
                          value={item.icon}
                          onChange={(event) => {
                            const updated = [...draft.facilities.rows];
                            updated[rowIndex] = updated[rowIndex].map((cell, idx) =>
                              idx === itemIndex ? { ...cell, icon: event.target.value } : cell
                            );
                            updateSection("facilities", { ...draft.facilities, rows: updated });
                          }}
                          placeholder="Emoji"
                        />
                      </div>
                    </div>
                  </ItemRow>
                ))}
                <AddButton
                  label="Add Facility"
                  onClick={() => {
                    const updated = [...draft.facilities.rows];
                    updated[rowIndex] = [
                      ...updated[rowIndex],
                      { label: "New Facility", icon: "" },
                    ];
                    updateSection("facilities", { ...draft.facilities, rows: updated });
                  }}
                />
              </div>
            </ItemRow>
          ))}
          <AddButton
            label="Add Row"
            onClick={() =>
              updateSection("facilities", {
                ...draft.facilities,
                rows: [...draft.facilities.rows, []],
              })
            }
          />
        </div>
      </section>

      {/* FAQ */}
      <section className={getSectionCardClass("faq")}>
        <h3 className="font-display text-lg text-white">FAQ</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.faq.eyebrow}
              onChange={(event) =>
                updateSection("faq", { ...draft.faq, eyebrow: event.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.faq.heading}
              onChange={(event) =>
                updateSection("faq", { ...draft.faq, heading: event.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Items</p>
            <AddButton
              label="Add Item"
              onClick={() =>
                updateSection("faq", {
                  ...draft.faq,
                  items: [...draft.faq.items, { q: "New question", a: "" }],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.faq.items.map((item, index) => (
              <ItemRow
                key={`${item.q}-${index}`}
                title={item.q || "New question"}
                subtitle={item.a}
                onRemove={() => {
                  const updated = draft.faq.items.filter((_, i) => i !== index);
                  updateSection("faq", { ...draft.faq, items: updated });
                }}
              >
                <div className="grid gap-3">
                  <div>
                    <label className={labelClass}>Question</label>
                    <input
                      className={inputClass}
                      value={item.q}
                      onChange={(event) => {
                        const updated = [...draft.faq.items];
                        updated[index] = { ...item, q: event.target.value };
                        updateSection("faq", { ...draft.faq, items: updated });
                      }}
                      placeholder="Question"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Answer</label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={item.a}
                      onChange={(event) => {
                        const updated = [...draft.faq.items];
                        updated[index] = { ...item, a: event.target.value };
                        updateSection("faq", { ...draft.faq, items: updated });
                      }}
                      placeholder="Answer"
                    />
                  </div>
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT PACKAGES */}
      <section className={getSectionCardClass("eventPackages")}>
        <h3 className="font-display text-lg text-white">Event Packages</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              className={inputClass}
              value={draft.eventPackages.eyebrow}
              onChange={(event) =>
                updateSection("eventPackages", { ...draft.eventPackages, eyebrow: event.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              value={draft.eventPackages.heading}
              onChange={(event) =>
                updateSection("eventPackages", { ...draft.eventPackages, heading: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Subtext</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              value={draft.eventPackages.subtext}
              onChange={(event) =>
                updateSection("eventPackages", { ...draft.eventPackages, subtext: event.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Packages</p>
            <AddButton
              label="Add Package"
              onClick={() =>
                updateSection("eventPackages", {
                  ...draft.eventPackages,
                  packages: [
                    ...draft.eventPackages.packages,
                    {
                      id: "new-pkg-" + Date.now(),
                      name: "New Package",
                      tagline: "",
                      price: "₹ 0",
                      duration: "per day",
                      iconKey: "zap",
                      themeColor: "text-accent-yellow border-accent-yellow/20 hover:border-accent-yellow/50",
                      shadowColor: "rgba(238, 167, 39, 0.15)",
                      features: ["Feature 1", "Feature 2"],
                      bestFor: "Events",
                    },
                  ],
                })
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {draft.eventPackages.packages.map((pkg, index) => (
              <PackageEditor
                key={`${pkg.id}-${index}`}
                pkg={pkg}
                onChange={(next) => {
                  const updated = [...draft.eventPackages.packages];
                  updated[index] = next;
                  updateSection("eventPackages", { ...draft.eventPackages, packages: updated });
                }}
                onRemove={() => {
                  const updated = draft.eventPackages.packages.filter((_, i) => i !== index);
                  updateSection("eventPackages", { ...draft.eventPackages, packages: updated });
                }}
              />
            ))}
          </div>
        </div>
      </section>

        </div>
      </div>
    </div>
  );
}

function LocationEditor({
  location,
  onChange,
  onRemove,
}: {
  location: ActiveMela;
  onChange: (next: ActiveMela) => void;
  onRemove: () => void;
}) {
  const handleInstalledRides = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <ItemRow
      title={location.name || "New Location"}
      subtitle={[location.city, location.status].filter(Boolean).join(" · ")}
      onRemove={onRemove}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelClass}>Location ID</label>
          <input
            className={inputClass}
            value={location.id}
            onChange={(event) => onChange({ ...location, id: event.target.value })}
            placeholder="id"
          />
        </div>
        <div>
          <label className={labelClass}>Name</label>
          <input
            className={inputClass}
            value={location.name}
            onChange={(event) => onChange({ ...location, name: event.target.value })}
            placeholder="Name"
          />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input
            className={inputClass}
            value={location.city}
            onChange={(event) => onChange({ ...location, city: event.target.value })}
            placeholder="City"
          />
        </div>
        <div>
          <label className={labelClass}>Venue</label>
          <input
            className={inputClass}
            value={location.venue}
            onChange={(event) => onChange({ ...location, venue: event.target.value })}
            placeholder="Venue"
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={location.status}
            onChange={(event) =>
              onChange({ ...location, status: event.target.value as ActiveMela["status"] })
            }
          >
            <option value="LIVE NOW">LIVE NOW</option>
            <option value="UPCOMING">UPCOMING</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Dates</label>
          <input
            className={inputClass}
            value={location.dates}
            onChange={(event) => onChange({ ...location, dates: event.target.value })}
            placeholder="Dates"
          />
        </div>
        <div>
          <label className={labelClass}>Latitude</label>
          <input
            type="number"
            className={inputClass}
            value={location.lat}
            onChange={(event) => onChange({ ...location, lat: Number(event.target.value) })}
            placeholder="Latitude"
          />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input
            type="number"
            className={inputClass}
            value={location.lng}
            onChange={(event) => onChange({ ...location, lng: Number(event.target.value) })}
            placeholder="Longitude"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Google Maps Link</label>
          <input
            className={inputClass}
            value={location.gmapsLink}
            onChange={(event) => onChange({ ...location, gmapsLink: event.target.value })}
            placeholder="Google Maps link"
          />
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <div>
          <label className={labelClass}>Details</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={location.details}
            onChange={(event) => onChange({ ...location, details: event.target.value })}
            placeholder="Details"
          />
        </div>
        <div>
          <label className={labelClass}>Installed Rides (Slugs, comma-separated)</label>
          <input
            className={inputClass}
            value={location.installedRides.join(", ")}
            onChange={(event) =>
              onChange({ ...location, installedRides: handleInstalledRides(event.target.value) })
            }
            placeholder="Installed ride slugs (comma separated)"
          />
        </div>
      </div>
    </ItemRow>
  );
}

function PackageEditor({
  pkg,
  onChange,
  onRemove,
}: {
  pkg: EventPackage;
  onChange: (next: EventPackage) => void;
  onRemove: () => void;
}) {
  return (
    <ItemRow
      title={pkg.name || "New Package"}
      subtitle={[pkg.price, pkg.duration].filter(Boolean).join(" · ")}
      onRemove={onRemove}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelClass}>Package Name</label>
          <input
            className={inputClass}
            value={pkg.name}
            onChange={(event) => onChange({ ...pkg, name: event.target.value })}
            placeholder="Name"
          />
        </div>
        <div>
          <label className={labelClass}>Price</label>
          <input
            className={inputClass}
            value={pkg.price}
            onChange={(event) => onChange({ ...pkg, price: event.target.value })}
            placeholder="Price"
          />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input
            className={inputClass}
            value={pkg.duration}
            onChange={(event) => onChange({ ...pkg, duration: event.target.value })}
            placeholder="Duration"
          />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input
            className={inputClass}
            value={pkg.tagline}
            onChange={(event) => onChange({ ...pkg, tagline: event.target.value })}
            placeholder="Tagline"
          />
        </div>
        <div>
          <label className={labelClass}>Best For</label>
          <input
            className={inputClass}
            value={pkg.bestFor}
            onChange={(event) => onChange({ ...pkg, bestFor: event.target.value })}
            placeholder="Best for"
          />
        </div>
        <div>
          <label className={labelClass}>Highlight Text</label>
          <input
            className={inputClass}
            value={pkg.highlightText || ""}
            onChange={(event) => onChange({ ...pkg, highlightText: event.target.value })}
            placeholder="Highlight text"
          />
        </div>
        <div>
          <label className={labelClass}>Icon</label>
          <select
            className={inputClass}
            value={pkg.iconKey}
            onChange={(event) =>
              onChange({ ...pkg, iconKey: event.target.value as EventPackage["iconKey"] })
            }
          >
            <option value="zap">Zap</option>
            <option value="shield-check">Shield Check</option>
            <option value="users">Users</option>
          </select>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <div>
          <label className={labelClass}>Features (One per line)</label>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={pkg.features.join("\n")}
            onChange={(event) =>
              onChange({ ...pkg, features: splitLines(event.target.value) })
            }
            placeholder="Features (one per line)"
          />
        </div>
      </div>
    </ItemRow>
  );
}
