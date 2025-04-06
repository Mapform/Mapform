import guideImage from "public/static/images/guide.png";
import { Tour, TourTrigger, TourContent } from "../tour-guide";

interface WelcomeTourProps {
  className?: string;
}

export function WelcomeTourContent({ className }: WelcomeTourProps) {
  return (
    <TourContent
      steps={[
        {
          id: "welcome",
          title: "Welcome to Mapform!",
          description:
            "Mapform is a platform for creating maps and data visualizations. It's designed to be easy to use and to help you create beautiful maps quickly.",
          imageUrl: guideImage,
        },
        {
          id: "pages",
          title: "Pages",
          description: "This is a description",
          imageUrl: guideImage,
        },
        {
          id: "layers",
          title: "Layers",
          description: "This is a description",
          imageUrl: guideImage,
        },
        {
          id: "sharing",
          title: "Sharing",
          description: "This is a description",
          imageUrl: guideImage,
        },
      ]}
      className={className}
    />
  );
}

export { TourTrigger as WelcomeTourTrigger, Tour as WelcomeTour };
