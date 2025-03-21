import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import {
  CheckIcon,
  MapIcon,
  PaintbrushIcon,
  HeadphonesIcon,
  BoxIcon,
  RectangleHorizontalIcon,
  TextCursorInputIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Basic",
    id: "basic",
    price: "$0",
    description: "Everything you need to get started with Mapform.",
    features: [
      {
        text: "Beautiful maps",
        icon: MapIcon,
      },
      {
        text: "100 dataset rows",
        icon: RectangleHorizontalIcon,
      },
      {
        text: "10 MB storage",
        icon: BoxIcon,
      },
      {
        text: "Map customization",
        icon: PaintbrushIcon,
      },
      {
        text: "Basic support",
        icon: HeadphonesIcon,
      },
    ],
    cta: "Get started",
    href: "/app/signup",
  },
  {
    name: "Pro",
    id: "pro",
    price: "$12",
    period: "/month",
    description: "Advanced features for power users and teams.",
    features: [
      {
        text: "Everything in Basic",
        icon: CheckIcon,
      },
      {
        text: "1,000 dataset rows",
        icon: RectangleHorizontalIcon,
      },
      {
        text: "100 MB storage",
        icon: BoxIcon,
      },
      {
        text: "Forms",
        icon: TextCursorInputIcon,
      },
      {
        text: "Priority support",
        icon: HeadphonesIcon,
      },
      {
        text: "Early backer",
        icon: TrophyIcon,
      },
    ],
    cta: "Get started",
    href: "/app/signup?plan=pro",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h3 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Mapform Pricing
          </h3>
          <p className="text-muted-foreground mt-4 text-xl leading-8">
            Choose the plan that works for you.{" "}
            <br className="hidden sm:block" />
            (More plans coming soon!)
          </p>
        </div>

        <div className="mt-16 flex justify-center gap-8 max-md:flex-col">
          {tiers.map((tier) => (
            <div
              className={cn("w-full rounded-xl p-4 max-md:border md:max-w-60", {
                "bg-gray-100": tier.featured,
              })}
              key={tier.id}
            >
              <div>
                <h3 className="text-base text-gray-600">{tier.name}</h3>
              </div>
              <p className="text-primary my-2 text-2xl font-semibold">
                <span>{tier.price}</span>
                {tier.period && <span>{tier.period}</span>}
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                {tier.description}
              </p>
              <Link href={tier.href}>
                <Button variant={tier.featured ? "default" : "outline"}>
                  {tier.cta}
                </Button>
              </Link>
              <ul className="mt-4 flex flex-col gap-3 border-t pt-4 text-gray-600">
                {tier.features.map((feature) => (
                  <li
                    className="flex items-center gap-2 text-sm"
                    key={feature.text}
                  >
                    <feature.icon className="size-4" aria-hidden="true" />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
