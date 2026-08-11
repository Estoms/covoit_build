import React from "react";

export default function Page({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h1>{title}</h1>
      {children ?? <p>Contenu à implémenter.</p>}
    </div>
  );
}
