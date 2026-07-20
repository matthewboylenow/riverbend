/**
 * Server-side loader that turns the raw page_content blocks for the
 * homepage into a typed object the client components can consume.
 *
 * Done as a single function so (public)/page.tsx hands one prop down
 * to HomepageContent and we don't pollute every client component with
 * block-reading boilerplate.
 */
import { getPageContent, readBlock, type ReadMode } from "@/lib/page-content";
import { HOME_DEFAULTS as D, type ProgramCardDefault } from "@/lib/page-defaults/home";

export const HOME_PAGE_SLUG = "home";

export interface HeroContent {
  overline: string;
  headline1: string;
  headline2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  fallbackImageUrl: string;
  fallbackImageAlt: string;
  videoUrl: string;
}

export interface AnnouncementContent {
  message: string;
  linkText: string;
  linkHref: string;
}

export interface BentoCardContent {
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
  cta: string;
}

export interface BentoCountdownContent {
  label: string;
  targetIso: string;
  href: string;
}

export interface BentoStatContent {
  number: string;
  label: string;
  href: string;
}

export interface BentoContent {
  card0: BentoCardContent;
  card1: BentoCardContent;
  countdown: BentoCountdownContent;
  stat: BentoStatContent;
  card4: BentoCardContent;
  card5: BentoCardContent;
  card6: BentoCardContent;
  card7: BentoCardContent;
  card8: BentoCardContent;
  card9: BentoCardContent;
  card10: BentoCardContent;
  /** Optional full-width promo card — hidden when its title is empty. */
  card11: BentoCardContent;
}

export interface PhilosophyContent {
  caption: string;
  headingHtml: string;
  body: string;
  storyLabel: string;
  storyHref: string;
  tourLabel: string;
}

export interface ProgramCardContent {
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link1Label: string;
  link1Href: string;
  link2Label: string;
  link2Href: string;
  reversed: boolean;
}

export interface HomeContent {
  hero: HeroContent;
  announcement: AnnouncementContent;
  bento: BentoContent;
  philosophy: PhilosophyContent;
  programsCaption: string;
  programsHeading: string;
  programs: [ProgramCardContent, ProgramCardContent, ProgramCardContent];
}

export async function loadHomeContent(mode: ReadMode = "published"): Promise<HomeContent> {
  let blocks: Awaited<ReturnType<typeof getPageContent>> = {};
  try {
    blocks = await getPageContent(HOME_PAGE_SLUG, mode);
  } catch (err) {
    console.error("home: page content load failed, using defaults:", err);
  }

  const t = (key: string, fallback: string) =>
    readBlock<{ value: string }>(blocks, key, { value: fallback }).value;
  const r = (key: string, fallbackHtml: string) =>
    readBlock<{ html: string }>(blocks, key, { html: fallbackHtml }).html;
  const i = (key: string, fallbackUrl: string, fallbackAlt = "") =>
    readBlock<{ url: string; alt?: string }>(blocks, key, {
      url: fallbackUrl,
      alt: fallbackAlt,
    });

  const bentoCard = (
    n: number,
    defaults: { title: string; subtitle: string; href: string; image_url: string; cta: string }
  ): BentoCardContent => {
    const img = i(`bento_card_${n}_image`, defaults.image_url, defaults.title);
    return {
      title: t(`bento_card_${n}_title`, defaults.title),
      subtitle: t(`bento_card_${n}_subtitle`, defaults.subtitle),
      href: t(`bento_card_${n}_href`, defaults.href),
      imageUrl: img.url || defaults.image_url,
      cta: t(`bento_card_${n}_cta`, defaults.cta),
    };
  };

  const programCard = (n: 1 | 2 | 3, fallback: ProgramCardDefault): ProgramCardContent => {
    const img = i(`program_${n}_image`, fallback.image_url, fallback.image_alt);
    return {
      badge: t(`program_${n}_badge`, fallback.badge),
      title: t(`program_${n}_title`, fallback.title),
      description: r(`program_${n}_description`, `<p>${fallback.description}</p>`),
      imageUrl: img.url || fallback.image_url,
      imageAlt: img.alt || fallback.image_alt,
      link1Label: t(`program_${n}_link_1_label`, fallback.link_1_label),
      link1Href: t(`program_${n}_link_1_href`, fallback.link_1_href),
      link2Label: t(`program_${n}_link_2_label`, fallback.link_2_label),
      link2Href: t(`program_${n}_link_2_href`, fallback.link_2_href),
      reversed: !!fallback.reversed,
    };
  };

  const heroBg = i("hero_fallback_image", D.hero_fallback_image_url, D.hero_fallback_image_alt);

  return {
    hero: {
      overline: t("hero_overline", D.hero_overline),
      headline1: t("hero_headline_1", D.hero_headline_1),
      headline2: t("hero_headline_2", D.hero_headline_2),
      subtitle: t("hero_subtitle", D.hero_subtitle),
      primaryCtaLabel: t("hero_primary_cta_label", D.hero_primary_cta_label),
      primaryCtaHref: t("hero_primary_cta_href", D.hero_primary_cta_href),
      secondaryCtaLabel: t("hero_secondary_cta_label", D.hero_secondary_cta_label),
      fallbackImageUrl: heroBg.url || D.hero_fallback_image_url,
      fallbackImageAlt: heroBg.alt || D.hero_fallback_image_alt,
      videoUrl: D.hero_video_url, // not currently editable
    },
    announcement: {
      message: t("announcement_message", D.announcement_message),
      linkText: t("announcement_link_text", D.announcement_link_text),
      linkHref: t("announcement_link_href", D.announcement_link_href),
    },
    bento: {
      card0: bentoCard(0, D.bento_card_0),
      card1: bentoCard(1, D.bento_card_1),
      countdown: {
        label: t("bento_countdown_label", D.bento_countdown_label),
        targetIso: t("bento_countdown_target", D.bento_countdown_target),
        href: t("bento_countdown_href", D.bento_countdown_href),
      },
      stat: {
        number: t("bento_stat_number", D.bento_stat_number),
        label: t("bento_stat_label", D.bento_stat_label),
        href: t("bento_stat_href", D.bento_stat_href),
      },
      card4: bentoCard(4, D.bento_card_4),
      card5: bentoCard(5, D.bento_card_5),
      card6: bentoCard(6, D.bento_card_6),
      card7: bentoCard(7, D.bento_card_7),
      card8: bentoCard(8, D.bento_card_8),
      card9: bentoCard(9, D.bento_card_9),
      card10: bentoCard(10, D.bento_card_10),
      card11: bentoCard(11, D.bento_card_11),
    },
    philosophy: {
      caption: t("philosophy_caption", D.philosophy_caption),
      headingHtml: r("philosophy_heading", D.philosophy_heading_html),
      body: t("philosophy_body", D.philosophy_body),
      storyLabel: t("philosophy_story_label", D.philosophy_story_label),
      storyHref: t("philosophy_story_href", D.philosophy_story_href),
      tourLabel: t("philosophy_tour_label", D.philosophy_tour_label),
    },
    programsCaption: t("programs_caption", D.programs_caption),
    programsHeading: t("programs_heading", D.programs_heading),
    programs: [
      programCard(1, D.programs[0]),
      programCard(2, D.programs[1]),
      programCard(3, D.programs[2]),
    ],
  };
}
