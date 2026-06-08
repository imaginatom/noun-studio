"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { BLUR_DATA_URL } from "@/lib/image-blur";
import { cn } from "@/lib/utils";

type ProjectImageProps = ImageProps & {
  fadeIn?: boolean;
};

export function ProjectImage({
  className,
  onLoad,
  fadeIn = true,
  ...props
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(!fadeIn);

  return (
    <Image
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      className={cn(
        fadeIn && "transition-opacity duration-700 ease-out",
        fadeIn && (loaded ? "opacity-100" : "opacity-0"),
        className,
      )}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...props}
    />
  );
}