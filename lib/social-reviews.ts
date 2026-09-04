export type SocialReview = {
  id: string;
  platform: "Instagram" | "TikTok";
  creator: string;
  title: string;
  postUrl: string;
  embedUrl: string;
};

export const socialReviews: SocialReview[] = [
  {
    id: "tiktok-fatima-tutorial",
    platform: "TikTok",
    creator: "@fatima_tariqft",
    title: "Chiffon hijab tutorial",
    postUrl: "https://www.tiktok.com/@hsbysaman/video/7517232691620711696",
    embedUrl:
      "https://www.tiktok.com/player/v1/7517232691620711696?autoplay=0&loop=1&music_info=0&description=0&rel=0&native_context_menu=0",
  },
  {
    id: "instagram-samra-style",
    platform: "Instagram",
    creator: "@samramirr_",
    title: "Summer hijab styling",
    postUrl: "https://www.instagram.com/samramirr_/reel/DJ64eg4IvBa/",
    embedUrl: "https://www.instagram.com/reel/DJ64eg4IvBa/embed/",
  },
  {
    id: "tiktok-georgette-lawn",
    platform: "TikTok",
    creator: "@hsbysaman",
    title: "Georgette chiffon or Turkish lawn",
    postUrl: "https://www.tiktok.com/@hsbysaman/video/7606327892338838804",
    embedUrl:
      "https://www.tiktok.com/player/v1/7606327892338838804?autoplay=0&loop=1&music_info=0&description=0&rel=0&native_context_menu=0",
  },
  {
    id: "instagram-fatima-reel",
    platform: "Instagram",
    creator: "@fatima_tariqft",
    title: "Everyday hijab look",
    postUrl: "https://www.instagram.com/fatima_tariqft/reel/DLAYmUhscP6/",
    embedUrl: "https://www.instagram.com/reel/DLAYmUhscP6/embed/",
  },
  {
    id: "tiktok-samra-recommendation",
    platform: "TikTok",
    creator: "@samramirr_",
    title: "Summer-friendly hijab picks",
    postUrl: "https://www.tiktok.com/@hsbysaman/video/7506931209956510977",
    embedUrl:
      "https://www.tiktok.com/player/v1/7506931209956510977?autoplay=0&loop=1&music_info=0&description=0&rel=0&native_context_menu=0",
  },
  {
    id: "instagram-ayesha-style",
    platform: "Instagram",
    creator: "@blogft._ayeshaa",
    title: "Styled in HS by Saman",
    postUrl: "https://www.instagram.com/blogft._ayeshaa/reel/DOLkMiFiMwG/",
    embedUrl: "https://www.instagram.com/reel/DOLkMiFiMwG/embed/",
  },
];
