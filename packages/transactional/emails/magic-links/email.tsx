import { Text, Heading, Link } from "@react-email/components";
import { Root } from "../../components/root";

export interface EmailProps {
  link: string;
}

export default function Email({ link }: EmailProps) {
  return (
    <Root preview="Magic link email preview">
      <Heading as="h1" className="mt-0 text-2xl">
        Your login request to Mapform
      </Heading>
      <Link href={link} target="_blank">
        Click here to log in with this magic link
      </Link>
      <Text className="!mb-0 !mt-10 text-sm text-gray-500">
        If you didn&apos;t try to login, you can safely ignore this email.
      </Text>
    </Root>
  );
}

Email.PreviewProps = {
  link: "https://example.com",
} as EmailProps;
