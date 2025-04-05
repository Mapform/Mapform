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
          title: "Welcome to your first project",
          description:
            "Projects are the main building blocks of Mapform. They combine maps, content, data and forms across multiple pages.",
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
