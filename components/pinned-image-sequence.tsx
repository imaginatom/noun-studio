"use client";

import { ProjectImage } from "@/components/project-image";
import type { GalleryImageAspect } from "@/lib/content/portfolio";
import { cn } from "@/lib/utils";

const ASPECT_CLASS: Record<GalleryImageAspect, string> = {
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

const MAX_WIDTH_CLASS: Record<GalleryImageAspect, string> = {
  "3/4": "max-w-[540px]",
  "4/3": "max-w-[700px]",
  "1/1": "max-w-[600px]",
};

const IMAGE_SIZES: Record<GalleryImageAspect, string> = {
  "3/4": "(max-width: 1024px) 100vw, 540px",
  "4/3": "(max-width: 1024px) 100vw, 700px",
  "1/1": "(max-width: 1024px) 100vw, 600px",
};

type SequenceImage = {
  src: string;
  alt: string;
  aspect?: GalleryImageAspect;
};

export function PinnedImageSequence({ images }: { images: SequenceImage[] }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[700px] overflow-hidden rounded-lg">
      {images.map((image, i) => {
        const aspect = image.aspect ?? "4/3";

        return (
          <div
            key={`${image.src}-${i}`}
            data-sequence-layer
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{ zIndex: i + 1 }}
          >
            <div
              className={cn(
                "relative w-full",
                ASPECT_CLASS[aspect],
                MAX_WIDTH_CLASS[aspect],
              )}
            >
              <ProjectImage
                src={image.src}
                alt={image.alt}
                fill
                fadeIn={false}
                loading="eager"
                sizes={IMAGE_SIZES[aspect]}
                className="object-cover"
                priority={i === 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
