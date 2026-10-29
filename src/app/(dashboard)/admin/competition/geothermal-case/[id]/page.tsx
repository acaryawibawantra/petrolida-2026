"use client";

import React from "react";

import CompetitionAdminDetailPage from "../../_components/competition-admin-detail-page";

export default function GeothermalCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <CompetitionAdminDetailPage slug="geothermal-case" teamId={id} />;
}
