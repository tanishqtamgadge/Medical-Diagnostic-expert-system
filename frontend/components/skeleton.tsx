import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card";
}

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const baseClass = "animate-pulse bg-stone-200 dark:bg-stone-700";
  let variantClass = "";

  if (variant === "text") {
    variantClass = "rounded-md h-4 w-3/4";
  } else if (variant === "circle") {
    variantClass = "rounded-full h-10 w-10";
  } else if (variant === "card") {
    variantClass = "rounded-2xl h-32 w-full";
  }

  return <div className={`${baseClass} ${variantClass} ${className}`} />;
}
