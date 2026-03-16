export type Language = "en" | "da" | "no" | "sv";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
];

export type TranslationKey = keyof typeof translations.en;

export const translations = {
  en: {
    // Nav
    nav_for_brands: "For Brands",
    nav_browse_creators: "Browse Creators",
    nav_feed: "The Feed",
    nav_opportunities: "Opportunities",
    nav_community: "Community",
    nav_more: "More",
    nav_black: "Black",
    nav_join_creator: "Join as Creator",
    nav_for_brands_btn: "For Brands",
    nav_sign_out: "Sign out",
    nav_content_activation: "Content Activation",
    nav_analytics: "Analytics",
    nav_contracts: "Contracts",
    nav_matchmaker: "AI Matchmaker",
    nav_brief: "Brief Generator",
    nav_brand_os: "Brand OS",
    nav_pricing: "Pricing",
    nav_make_ads: "⚡ Make Ads in Minutes",

    // Home hero
    home_badge: "The Creator Platform for Scandinavian Brands",
    home_h1_line1: "Connect with",
    home_h1_line2: "Elite Creators",
    home_h1_line3: "Built for Growth",
    home_sub: "Lumeya connects forward-thinking Scandinavian brands with handpicked UGC creators, influencers, and content specialists.",
    home_cta_primary: "Find Your Creator",
    home_cta_secondary: "Browse Creators",
    home_stat_creators: "Active Creators",
    home_stat_brands: "Brands Onboarded",
    home_stat_campaigns: "Campaigns Delivered",
    home_stat_satisfaction: "Satisfaction Rate",

    // Creators page
    creators_title: "Creators",
    creators_subtitle: "Discover",
    creators_search: "Search by name, skill, or tag...",
    creators_filter_all: "All",
    creators_no_results: "No creators match your filters.",
    creators_view_profile: "View Profile",
    creators_followers: "followers",
    creators_engagement: "engagement",
    creators_campaigns: "campaigns",

    // Opportunities
    opp_title: "Opportunities",
    opp_subtitle: "Discover",
    opp_search: "Search opportunities...",
    opp_post: "Post Opportunity",
    opp_apply: "Apply",
    opp_no_results: "No opportunities found. Try adjusting your filters.",

    // Post opportunity
    post_opp_title: "Post an Opportunity",
    post_opp_subtitle: "For Brands",
    post_opp_desc: "Describe your project and find the perfect creator to collaborate with.",
    post_opp_publish: "Publish Opportunity",
    post_opp_success_title: "Opportunity Posted",
    post_opp_success_desc: "Your opportunity is now live. Creators will be able to discover and apply for it.",
    post_opp_post_another: "Post Another",

    // Brand management
    bm_title: "Creator-Run Brand Management",
    bm_subtitle: "Hand your Instagram to someone who lives it.",
    bm_tab_brands: "Brands Hiring",
    bm_tab_managers: "Available Managers",
    bm_apply: "Apply as Manager",
    bm_apply_send: "Send Application",
    bm_badge: "Lumeya Black — Exclusive Feature",

    // Community
    community_title: "Community",
    community_subtitle: "Connect",
    community_placeholder: "Share something with the community...",
    community_post: "Post",

    // Matchmaker
    matchmaker_title: "AI Matchmaker",
    matchmaker_subtitle: "Find Your Perfect Creator",
    matchmaker_find: "Find Creators",

    // Footer
    footer_tagline: "The creator platform for Scandinavian brands.",
    footer_rights: "All rights reserved.",

    // Common
    common_loading: "Loading...",
    common_save: "Save",
    common_cancel: "Cancel",
    common_close: "Close",
    common_edit: "Edit",
    common_delete: "Delete",
    common_back: "Back",
    common_next: "Next",
    common_submit: "Submit",
    common_search: "Search",
    common_filter: "Filters",
    common_view_all: "View all",
    common_read_more: "Read more",
    common_get_started: "Get Started",
    common_learn_more: "Learn More",
    common_contact: "Contact",
    common_budget: "Budget",
    common_deadline: "Deadline",
    common_location: "Location",
    common_by: "by",
  },

  da: {
    // Nav
    nav_for_brands: "For Brands",
    nav_browse_creators: "Find Skabere",
    nav_feed: "Feed",
    nav_opportunities: "Muligheder",
    nav_community: "Fællesskab",
    nav_more: "Mere",
    nav_black: "Black",
    nav_join_creator: "Bliv Skaber",
    nav_for_brands_btn: "For Brands",
    nav_sign_out: "Log ud",
    nav_content_activation: "Indholdsaktivering",
    nav_analytics: "Analyser",
    nav_contracts: "Kontrakter",
    nav_matchmaker: "AI Matchmaker",
    nav_brief: "Briefgenerator",
    nav_brand_os: "Brand OS",
    nav_pricing: "Priser",
    nav_make_ads: "⚡ Lav Annoncer på Minutter",

    // Home hero
    home_badge: "Skaberplatformen for Skandinaviske Brands",
    home_h1_line1: "Samarbejd med",
    home_h1_line2: "Elite Skabere",
    home_h1_line3: "Bygget til Vækst",
    home_sub: "Lumeya forbinder fremsynede skandinaviske brands med håndplukkede UGC-skabere, influencers og indholdsspecialister.",
    home_cta_primary: "Find Din Skaber",
    home_cta_secondary: "Udforsk Skabere",
    home_stat_creators: "Aktive Skabere",
    home_stat_brands: "Brands Ombord",
    home_stat_campaigns: "Kampagner Leveret",
    home_stat_satisfaction: "Tilfredshed",

    // Creators
    creators_title: "Skabere",
    creators_subtitle: "Opdag",
    creators_search: "Søg efter navn, færdighed eller tag...",
    creators_filter_all: "Alle",
    creators_no_results: "Ingen skabere matcher dine filtre.",
    creators_view_profile: "Se Profil",
    creators_followers: "følgere",
    creators_engagement: "engagement",
    creators_campaigns: "kampagner",

    // Opportunities
    opp_title: "Muligheder",
    opp_subtitle: "Opdag",
    opp_search: "Søg muligheder...",
    opp_post: "Opret Mulighed",
    opp_apply: "Ansøg",
    opp_no_results: "Ingen muligheder fundet. Prøv at justere dine filtre.",

    // Post opportunity
    post_opp_title: "Opret en Mulighed",
    post_opp_subtitle: "For Brands",
    post_opp_desc: "Beskriv dit projekt og find den perfekte skaber at samarbejde med.",
    post_opp_publish: "Publicer Mulighed",
    post_opp_success_title: "Mulighed Oprettet",
    post_opp_success_desc: "Din mulighed er nu live. Skabere kan opdage og ansøge om den.",
    post_opp_post_another: "Opret Endnu En",

    // Brand management
    bm_title: "Skaberledet Brand Management",
    bm_subtitle: "Overlad din Instagram til én, der lever det.",
    bm_tab_brands: "Brands søger",
    bm_tab_managers: "Tilgængelige Managere",
    bm_apply: "Ansøg som Manager",
    bm_apply_send: "Send Ansøgning",
    bm_badge: "Lumeya Black — Eksklusiv Funktion",

    // Community
    community_title: "Fællesskab",
    community_subtitle: "Forbind",
    community_placeholder: "Del noget med fællesskabet...",
    community_post: "Del",

    // Matchmaker
    matchmaker_title: "AI Matchmaker",
    matchmaker_subtitle: "Find Din Perfekte Skaber",
    matchmaker_find: "Find Skabere",

    // Footer
    footer_tagline: "Skaberplatformen for skandinaviske brands.",
    footer_rights: "Alle rettigheder forbeholdes.",

    // Common
    common_loading: "Indlæser...",
    common_save: "Gem",
    common_cancel: "Annuller",
    common_close: "Luk",
    common_edit: "Rediger",
    common_delete: "Slet",
    common_back: "Tilbage",
    common_next: "Næste",
    common_submit: "Indsend",
    common_search: "Søg",
    common_filter: "Filtre",
    common_view_all: "Se alle",
    common_read_more: "Læs mere",
    common_get_started: "Kom i gang",
    common_learn_more: "Lær mere",
    common_contact: "Kontakt",
    common_budget: "Budget",
    common_deadline: "Deadline",
    common_location: "Placering",
    common_by: "af",
  },

  no: {
    // Nav
    nav_for_brands: "For Merkevarer",
    nav_browse_creators: "Finn Skapere",
    nav_feed: "Feed",
    nav_opportunities: "Muligheter",
    nav_community: "Fellesskap",
    nav_more: "Mer",
    nav_black: "Black",
    nav_join_creator: "Bli Skaper",
    nav_for_brands_btn: "For Merkevarer",
    nav_sign_out: "Logg ut",
    nav_content_activation: "Innholdsaktivering",
    nav_analytics: "Analyser",
    nav_contracts: "Kontrakter",
    nav_matchmaker: "AI Matchmaker",
    nav_brief: "Briefgenerator",
    nav_brand_os: "Brand OS",
    nav_pricing: "Priser",
    nav_make_ads: "⚡ Lag Annonser på Minutter",

    // Home hero
    home_badge: "Skaperplattformen for Skandinaviske Merker",
    home_h1_line1: "Samarbeid med",
    home_h1_line2: "Elite Skapere",
    home_h1_line3: "Bygget for Vekst",
    home_sub: "Lumeya kobler fremtidsrettede skandinaviske merker med håndplukkede UGC-skapere, influencere og innholdsspesialister.",
    home_cta_primary: "Finn Din Skaper",
    home_cta_secondary: "Utforsk Skapere",
    home_stat_creators: "Aktive Skapere",
    home_stat_brands: "Merker Ombord",
    home_stat_campaigns: "Kampanjer Levert",
    home_stat_satisfaction: "Tilfredshet",

    // Creators
    creators_title: "Skapere",
    creators_subtitle: "Oppdag",
    creators_search: "Søk etter navn, ferdighet eller tag...",
    creators_filter_all: "Alle",
    creators_no_results: "Ingen skapere matcher filtrene dine.",
    creators_view_profile: "Se Profil",
    creators_followers: "følgere",
    creators_engagement: "engasjement",
    creators_campaigns: "kampanjer",

    // Opportunities
    opp_title: "Muligheter",
    opp_subtitle: "Oppdag",
    opp_search: "Søk muligheter...",
    opp_post: "Opprett Mulighet",
    opp_apply: "Søk",
    opp_no_results: "Ingen muligheter funnet. Prøv å justere filtrene.",

    // Post opportunity
    post_opp_title: "Opprett en Mulighet",
    post_opp_subtitle: "For Merker",
    post_opp_desc: "Beskriv prosjektet ditt og finn den perfekte skaperen å samarbeide med.",
    post_opp_publish: "Publiser Mulighet",
    post_opp_success_title: "Mulighet Opprettet",
    post_opp_success_desc: "Muligheten din er nå live. Skapere kan oppdage og søke på den.",
    post_opp_post_another: "Opprett En Til",

    // Brand management
    bm_title: "Skaperl edet Merkevareledelse",
    bm_subtitle: "Overlat Instagram til én som lever det.",
    bm_tab_brands: "Merker ansetter",
    bm_tab_managers: "Tilgjengelige Managere",
    bm_apply: "Søk som Manager",
    bm_apply_send: "Send Søknad",
    bm_badge: "Lumeya Black — Eksklusiv Funksjon",

    // Community
    community_title: "Fellesskap",
    community_subtitle: "Koble til",
    community_placeholder: "Del noe med fellesskapet...",
    community_post: "Del",

    // Matchmaker
    matchmaker_title: "AI Matchmaker",
    matchmaker_subtitle: "Finn Din Perfekte Skaper",
    matchmaker_find: "Finn Skapere",

    // Footer
    footer_tagline: "Skaperplattformen for skandinaviske merker.",
    footer_rights: "Alle rettigheter forbeholdt.",

    // Common
    common_loading: "Laster...",
    common_save: "Lagre",
    common_cancel: "Avbryt",
    common_close: "Lukk",
    common_edit: "Rediger",
    common_delete: "Slett",
    common_back: "Tilbake",
    common_next: "Neste",
    common_submit: "Send inn",
    common_search: "Søk",
    common_filter: "Filtre",
    common_view_all: "Se alle",
    common_read_more: "Les mer",
    common_get_started: "Kom i gang",
    common_learn_more: "Lær mer",
    common_contact: "Kontakt",
    common_budget: "Budsjett",
    common_deadline: "Frist",
    common_location: "Sted",
    common_by: "av",
  },

  sv: {
    // Nav
    nav_for_brands: "För Varumärken",
    nav_browse_creators: "Hitta Skapare",
    nav_feed: "Flöde",
    nav_opportunities: "Möjligheter",
    nav_community: "Gemenskap",
    nav_more: "Mer",
    nav_black: "Black",
    nav_join_creator: "Bli Skapare",
    nav_for_brands_btn: "För Varumärken",
    nav_sign_out: "Logga ut",
    nav_content_activation: "Innehållsaktivering",
    nav_analytics: "Analys",
    nav_contracts: "Kontrakt",
    nav_matchmaker: "AI Matchmaker",
    nav_brief: "Briefgenerator",
    nav_brand_os: "Brand OS",
    nav_pricing: "Priser",
    nav_make_ads: "⚡ Skapa Annonser på Minuter",

    // Home hero
    home_badge: "Skaparplattformen för Skandinaviska Varumärken",
    home_h1_line1: "Samarbeta med",
    home_h1_line2: "Elite Skapare",
    home_h1_line3: "Byggt för Tillväxt",
    home_sub: "Lumeya kopplar framåttänkande skandinaviska varumärken med handplockade UGC-skapare, influencers och innehållsspecialister.",
    home_cta_primary: "Hitta Din Skapare",
    home_cta_secondary: "Utforska Skapare",
    home_stat_creators: "Aktiva Skapare",
    home_stat_brands: "Varumärken Ombord",
    home_stat_campaigns: "Kampanjer Levererade",
    home_stat_satisfaction: "Nöjdhet",

    // Creators
    creators_title: "Skapare",
    creators_subtitle: "Utforska",
    creators_search: "Sök efter namn, färdighet eller tagg...",
    creators_filter_all: "Alla",
    creators_no_results: "Inga skapare matchar dina filter.",
    creators_view_profile: "Visa Profil",
    creators_followers: "följare",
    creators_engagement: "engagemang",
    creators_campaigns: "kampanjer",

    // Opportunities
    opp_title: "Möjligheter",
    opp_subtitle: "Utforska",
    opp_search: "Sök möjligheter...",
    opp_post: "Publicera Möjlighet",
    opp_apply: "Ansök",
    opp_no_results: "Inga möjligheter hittades. Prova att justera filtren.",

    // Post opportunity
    post_opp_title: "Publicera en Möjlighet",
    post_opp_subtitle: "För Varumärken",
    post_opp_desc: "Beskriv ditt projekt och hitta den perfekta skaparen att samarbeta med.",
    post_opp_publish: "Publicera Möjlighet",
    post_opp_success_title: "Möjlighet Publicerad",
    post_opp_success_desc: "Din möjlighet är nu live. Skapare kan hitta och ansöka om den.",
    post_opp_post_another: "Publicera En Till",

    // Brand management
    bm_title: "Skaparledd Varumärkeshantering",
    bm_subtitle: "Överlämna din Instagram till någon som lever det.",
    bm_tab_brands: "Varumärken söker",
    bm_tab_managers: "Tillgängliga Managers",
    bm_apply: "Ansök som Manager",
    bm_apply_send: "Skicka Ansökan",
    bm_badge: "Lumeya Black — Exklusiv Funktion",

    // Community
    community_title: "Gemenskap",
    community_subtitle: "Anslut",
    community_placeholder: "Dela något med gemenskapen...",
    community_post: "Dela",

    // Matchmaker
    matchmaker_title: "AI Matchmaker",
    matchmaker_subtitle: "Hitta Din Perfekta Skapare",
    matchmaker_find: "Hitta Skapare",

    // Footer
    footer_tagline: "Skaparplattformen för skandinaviska varumärken.",
    footer_rights: "Alla rättigheter förbehållna.",

    // Common
    common_loading: "Laddar...",
    common_save: "Spara",
    common_cancel: "Avbryt",
    common_close: "Stäng",
    common_edit: "Redigera",
    common_delete: "Ta bort",
    common_back: "Tillbaka",
    common_next: "Nästa",
    common_submit: "Skicka",
    common_search: "Sök",
    common_filter: "Filter",
    common_view_all: "Visa alla",
    common_read_more: "Läs mer",
    common_get_started: "Kom igång",
    common_learn_more: "Läs mer",
    common_contact: "Kontakt",
    common_budget: "Budget",
    common_deadline: "Deadline",
    common_location: "Plats",
    common_by: "av",
  },
};
