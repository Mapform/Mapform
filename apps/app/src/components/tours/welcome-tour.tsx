import welcomeImage from "public/static/images/welcome.jpeg";
import aiDemoVideo from "videos/ai-demo.mp4.json";
import saveDemoVideo from "videos/save-demo.mp4.json";
import propertiesDemoVideo from "videos/properties-demo.mp4.json";
import semanticSearchDemoVideo from "videos/semantic-search-demo.mp4.json";
import { Tour, TourTrigger, TourContent } from "../tour-guide";
import type { Asset } from "next-video/dist/assets.js";

interface WelcomeTourProps {
  className?: string;
}

export function WelcomeTourContent({ className }: WelcomeTourProps) {
  return (
    <TourContent
      steps={[
        {
          id: "welcome",
          title: "Welcome!",
          description:
            "Thanks for trying the Mapform beta. This is an early version of the app, and you may experience some bugs or missing features. Click through to see what's new.",
          url: welcomeImage,
        },
        {
          id: "ai",
          title: "Talk to your maps",
          description:
            "The Mapform map assistant can help you find locations and mark them directly on the map. Use it to plan trips, discover nearby places, and more.",
          video: aiDemoVideo as Asset,
        },
        {
          id: "save",
          title: "Your data",
          description:
            "Mapform is built on open data. Save places to create your own copy that you are free to modify, share, or move to other platforms. ",
          video: saveDemoVideo as Asset,
        },
        {
          id: "properties",
          title: "Properties",
          description:
            "Properties allow you to add context to your saved places. Soon, you will be able to use them sort, filter, and search your saved places.",
          video: propertiesDemoVideo as Asset,
        },
        {
          id: "semantic-search",
          title: "Power search",
          description:
            "As you save places to your private workspace, Mapform will learn more about them. Easily find places you've saved by name, descriptions, or other properties.",
          video: semanticSearchDemoVideo as Asset,
        },
      ]}
      className={className}
    />
  );
}

export { TourTrigger as WelcomeTourTrigger, Tour as WelcomeTour };
