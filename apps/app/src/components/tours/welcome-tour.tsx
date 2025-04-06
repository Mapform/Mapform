import welcomeImage from "public/static/images/welcome.jpeg";
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
          title: "Founder's Note",
          description: (
            <>
              <p>How do you describe a place?</p>
              <p>
                For most of us, it&apos;s not by sending a Google Maps link or a
                spreadsheet — it&apos;s by telling a story.
              </p>
              <p>
                But most mapping tools miss that. The story gets lost amongst
                maps that are too simple or purely data-driven. I built Mapform
                in an attempt to bridge that gap: to bring maps and data
                together with rich content and user input.
              </p>
              <p>
                The project is still young, but I hope you find it useful. Happy
                mapping!
              </p>
              <p>— Nic</p>
            </>
          ),
          imageUrl: welcomeImage,
        },
      ]}
      className={className}
    />
  );
}

export { TourTrigger as WelcomeTourTrigger, Tour as WelcomeTour };
