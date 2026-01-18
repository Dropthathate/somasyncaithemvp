import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary Meta Tags */}
        <title>SomaSync AI - AI-Powered Postural Assessment Documentation for Physical Therapists in the Central Valley, CA</title>
        <meta
          name="description"
          content="SomaSync AI is a hands-free, AI-powered assistant for physical therapists in the Central Valley, CA throughout Fresno and Sacramento to Stanislaus and surrounding counties. Real-time SOAP note generation, postural assessment documentation, and anatomical mapping for musculoskeletal therapy."
        />
        <meta
          name="keywords"
          content="physical therapy Fresno, postural assessment documentation, SOAP notes automation, manual therapy AI, musculoskeletal assessment, clinical documentation software, physical therapy Central Valley, therapist assistant AI, anatomical mapping, PT documentation Fresno CA"
        />
        <meta name="author" content="SomaSync AI" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://somasync.app/" />
        <meta property="og:title" content="SomaSync AI - AI-Powered Postural Assessment for Physical Therapists" />
        <meta
          property="og:description"
          content="Hands-free AI assistant for physical therapists in Central Valley and surrounding. Real-time SOAP notes, postural assessment, and anatomical documentation for musculoskeletal therapy."
        />
        <meta
          property="og:image"
          content="https://files.manuscdn.com/user_upload_by_module/session_file/310519663283219909/HGtdIPEzHAYBEhSm.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="SomaSync AI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://somasync.app/" />
        <meta name="twitter:title" content="SomaSync AI - AI-Powered Postural Assessment for Physical Therapists" />
        <meta
          name="twitter:description"
          content="Hands-free AI assistant for physical therapists. Real-time SOAP notes and anatomical documentation."
        />
        <meta
          name="twitter:image"
          content="https://files.manuscdn.com/user_upload_by_module/session_file/310519663283219909/HGtdIPEzHAYBEhSm.png"
        />

        {/* Apple Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SomaSync AI" />

        {/* Microsoft Meta Tags */}
        <meta name="msapplication-TileColor" content="#E6F4FE" />
        <meta name="theme-color" content="#E6F4FE" />

        {/* Geo Targeting - Fresno, Sacramento, Modesto, Los Banos California & Central Valley */}
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Fresno, California" />
        <meta name="geo.position" content="36.7378;-119.7871" />
        <meta name="ICBM" content="36.7378, -119.7871" />
        <meta name="coverage" content="Fresno, Clovis, Madera, Visalia, Central Valley, California" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://somasync.app/" />

        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="en" href="https://somasync.app/" />
        <link rel="alternate" hrefLang="x-default" href="https://somasync.app/" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://files.manuscdn.com" />
        <link rel="dns-prefetch" href="https://files.manuscdn.com" />

        {/* Structured Data - Medical Software Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SomaSync AI",
              applicationCategory: "HealthApplication",
              applicationSubCategory: "Medical Documentation Software",
              operatingSystem: "iOS, Android, Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "AI-powered postural assessment and clinical documentation assistant for physical therapists. Real-time SOAP note generation with anatomical mapping for musculoskeletal therapy.",
              image:
                "https://files.manuscdn.com/user_upload_by_module/session_file/310519663283219909/HGtdIPEzHAYBEhSm.png",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "50",
              },
              featureList: [
                "Real-time SOAP note generation",
                "Anatomical entity recognition",
                "Postural assessment documentation",
                "Hands-free voice recording",
                "Musculoskeletal mapping",
                "BLE earbud integration",
              ],
            }),
          }}
        />

        {/* Structured Data - Local Business (Sacramento, CA) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "SomaSync AI",
              url: "https://somasync.app",
              logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663283219909/HGtdIPEzHAYBEhSm.png",
              description:
                "AI-powered clinical documentation solutions for physical therapists and manual therapy clinicians in Central Valley, California and surrounding from Fresno to Los Banos",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Fresno",
                addressRegion: "CA",
                addressCountry: "US",
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Fresno",
                  "@id": "https://en.wikipedia.org/wiki/Fresno,_California",
                },
                {
                  "@type": "City",
                  name: "Clovis",
                },
                {
                  "@type": "City",
                  name: "Madera",
                },
                {
                  "@type": "City",
                  name: "Visalia",
                },
                {
                  "@type": "Place",
                  name: "Central Valley, California",
                },
              ],
              medicalSpecialty: ["PhysicalTherapy", "Rehabilitation", "Orthopedics"],
            }),
          }}
        />

        {/* Structured Data - Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "SomaSync AI",
              description:
                "Hands-free AI assistant for physical therapists that generates structured SOAP notes from real-time postural assessment observations",
              brand: {
                "@type": "Brand",
                name: "SomaSync",
              },
              category: "Medical Software",
              audience: {
                "@type": "PeopleAudience",
                audienceType: "Physical Therapists, Manual Therapy Clinicians",
              },
            }),
          }}
        />

        <ScrollViewStyleReset />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}
`;
