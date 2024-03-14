"use client";
import { useOrganizationList } from "@clerk/nextjs";

export function OrgSelector() {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
}
