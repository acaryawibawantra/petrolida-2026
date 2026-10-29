export const getMetadataItems = (
  templateTitle = "",
  templateDescription = "",
  slug = "",
) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.petrolida.com"
      : "http://localhost:3000";

  const formattedSlug = slug && slug !== "/" ? slug : "";
  const pathname = `${baseUrl}${formattedSlug ? `/${formattedSlug}` : ""}`;

  const title = templateTitle
    ? `${templateTitle} | Petrolida 2026`
    : "Petrolida 2026";

  const description =
    templateDescription ||
    "Empowering future leaders in the oil and gas industry.";

  const ogUrl = new URL(
    `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
    baseUrl,
  ).href;

  return {
    title,
    description,
    pathname,
    ogUrl,
  };
};

export const generateTemplateMetadata = (
  templateTitle = "",
  templateDescription = "",
  slug = "",
) => {
  const metadataItems = getMetadataItems(
    templateTitle,
    templateDescription,
    slug,
  );
  return {
    title: metadataItems.title,
    alternates: {
      canonical: metadataItems.pathname,
    },
    openGraph: {
      url: metadataItems.pathname,
      images: metadataItems.ogUrl,
    },
    twitter: {
      images: metadataItems.ogUrl,
    },
  };
};
