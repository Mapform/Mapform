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
          title: "Welcome!",
          description: (
            <>
              <p>
                You&apos;re about to try an early version of Mapform. In this
                version you will be able to:
              </p>
              <ul>
                <li>Create maps and locations</li>
                <li>Modify location properties</li>
                <li>Chat with your maps</li>
              </ul>
              <p>
                Additional features like table views, data imports, and sharing
                are coming soon. As always, I would love to hear your feedback.
              </p>
              <p>— Nic</p>
            </>
          ),
          url: welcomeImage,
        },
      ]}
      className={className}
    />
  );
}

export { TourTrigger as WelcomeTourTrigger, Tour as WelcomeTour };
