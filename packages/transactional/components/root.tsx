import {
  Img,
  Tailwind,
  Font,
  Head,
  Html,
  Body,
  Preview,
  Container,
} from "@react-email/components";
import { env } from "#env.mjs";

const baseUrl = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "http://localhost:3000";

export function Root({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview: string;
}) {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="Verdana"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
            format: "woff2",
          }}
        />
        <Preview>{preview}</Preview>
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#17171c",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 px-4 py-10">
          <Container>
            {/* <Img
              alt="Mapform Logo"
              className="h-8"
              src={`${baseUrl}/static/images/mapform.svg`}
            /> */}
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
