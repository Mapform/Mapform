import projectPagesVideo from "videos/project-pages.mp4.json";
import projectIntroVideo from "videos/project-intro.mp4.json";
import projectLayersVideo from "videos/project-layers.mp4.json";
import projectShareVideo from "videos/project-share.mp4.json";
import { Tour, TourTrigger, TourContent } from "~/components/tour-guide";
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
          title: "Your First Project",
          description:
            "Projects are the bread and butter of Mapform. Fundamentally, they combine maps, content, and data across one or more pages.",
          video: projectIntroVideo as Asset,
        },
        {
          id: "pages",
          title: "Pages",
          description:
            "Like a book, Mapform pages flow sequentially. Content, map position, and data layers are all unique to each page.",
          video: projectPagesVideo as Asset,
        },
        {
          id: "layers",
          title: "Layers",
          description:
            "Layers are how you visual data on your map. At the moment, they can be used to show Markers or Points (with more types to come).",
          video: projectLayersVideo as Asset,
        },
        {
          id: "sharing",
          title: "Sharing",
          description:
            "Use the share Share button in the top right to change your project's visibility, or copy the public URL to share with others.",
          video: projectShareVideo as Asset,
        },
      ]}
      className={className}
    />
  );
}

export { TourTrigger as ProjectTourTrigger, Tour as ProjectTour };
