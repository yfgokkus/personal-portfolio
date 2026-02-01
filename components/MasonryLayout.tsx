"use client";

import Masonry from "react-masonry-css";

export default function MasonryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  // Cast Masonry to 'any' to fix the TypeScript JSX element type error
  const MasonryComponent = Masonry as any;

  return (
    <MasonryComponent
      breakpointCols={breakpointColumnsObj}
      className="flex gap-5"
      columnClassName="bg-clip-padding flex flex-col gap-5"
    >
      {children}
    </MasonryComponent>
  );
}
