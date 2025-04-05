import guideImage from "public/static/images/guide.png";
import projectPagesVideo from "videos/project-pages.mp4.json";
import { Tour, TourTrigger, TourContent } from "../tour-guide";
import type { Asset } from "next-video/dist/assets.js";

interface ProjectTourProps {
  className?: string;
}

export function ProjectTourContent({ className }: ProjectTourProps) {
  return (
    <TourContent
      steps={[
        {
          id: "welcome",
          title: "Welcome to your first project",
          description:
            "Projects are the main building blocks of Mapform. They combine maps, content, data and forms across multiple pages.",
          video: projectPagesVideo as Asset,
        },
        {
          id: "pages",
          title: "Pages",
          description: "Project pages are  ",
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

export { TourTrigger as ProjectTourTrigger, Tour as ProjectTour };
