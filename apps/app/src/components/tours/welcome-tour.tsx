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
                You&apos;re about to try an early version of Mapform. After
                running an initial beta earlier this summer, I decided to
                simplify the tool and explore how AI might be used the enhance
                the mapping experience. I&apos;ve also temporarily disabled
                features like forms, sharing, and mobile-support in an effort to
                get something out sooner. (I&apos;ll add them back in later.)
              </p>
              <p>
                Hope you enjoy the change in direction and as always I would
                love to hear your feedback.
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
