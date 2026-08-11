import React from "react";

export default function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${padded ? "p-4 md:p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}
