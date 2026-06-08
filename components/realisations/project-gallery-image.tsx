import { ProjectImage } from "@/components/project-image";
import type { GalleryImageAspect } from "@/lib/content/portfolio";
import { cn } from "@/lib/utils";

const ASPECT_CLASS: Record<GalleryImageAspect, string> = {
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

type ProjectGalleryImageProps = {
  src: string;
  alt: string;
  aspect: GalleryImageAspect;
  sizes: string;
  priority?: boolean;
};

export function ProjectGalleryImage({
  src,
  alt,
  aspect,
  sizes,
  priority = false,
}: ProjectGalleryImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg",
        ASPECT_CLASS[aspect],
      )}
    >
      <ProjectImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
