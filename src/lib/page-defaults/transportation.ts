/**
 * Default content for /transportation.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export const TRANSPORTATION_DEFAULTS = {
  hero_title: "Transportation",
  hero_subtitle: "Safe, convenient bus service to and from camp",
  hero_bg_url: "/assets/site/DSC06927-scaled.jpg",
  hero_bg_alt: "",

  overview_html:
    "<p>All bus service is at neighborhood or centralized bus stops, with the exception of three-quarter day afternoon bus drop offs.</p><p>Camp tuition includes either bus transportation or a place in the extended day program. Campers travel in small or large yellow school buses; each bus has a riding counselor to supervise campers during the bus route and everyone wears a seat belt.</p><p>Bus transportation to and from Camp Riverbend is provided from many communities in Essex, Hudson, Morris, Somerset and Union counties. Contact us for information about specific towns.</p>",

  bus_service_heading: "Bus Service",
  bus_service_html:
    "<p>Every bus driver has a Commercial Driver&rsquo;s License with Passenger and School Bus endorsements. To earn this license, drivers must undergo a physical exam and have significant knowledge and on-road testing for safety. Bus drivers&rsquo; safety records are reviewed each season.</p><p>We try to arrange our bus routes so each camper&rsquo;s trip is as short as possible. Most bus routes begin around 8:00 am and arrive at Camp around 8:45 am. We dismiss at 4:00 pm and almost all buses have delivered their campers home by 4:45 pm.</p>",
  bus_service_image_url: "/assets/site/DSC06927-scaled.jpg",
  bus_service_image_alt: "Yellow school bus for Camp Riverbend transportation",

  three_quarter_heading: "Three-Quarter Day Transportation",
  three_quarter_html:
    "<p>For the 3 and 4 year old three-quarter day Clubhouse program, morning transportation to camp is included in tuition; Camp provides bus service back to Summit, New Providence, Berkeley Heights and Westfield at 2:00 pm. For campers in other towns, a parent or guardian must pick up three-quarter day Clubhouse campers at 2:00 pm.</p>",

  extended_day_heading: "Extended Day Program",
  extended_day_html:
    "<p>If the timing of the bus does not work for your schedule, we also offer an extended day option. You can bring your camper here as early as 8:00 am and pick up as late as 6:00 pm. Counselors supervise extended day campers in games, swimming, crafts, sports and quiet activities.</p><p>There is no extra fee for the extended day program if you use it instead of bus transportation. There is a small extra charge to use both extended day and bus service, or bus service to two different addresses.</p>",
};
