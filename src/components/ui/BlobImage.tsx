import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlobImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

export function BlobImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority = false,
  className,
  imgClassName,
}: BlobImageProps) {
  // Handle both full Blob URLs and /assets/ paths
  const imageSrc = src.startsWith("/") ? src : src;

  if (fill) {
    return (
      <div className={cn("relative", className)}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
      priority={priority}
      className={cn(className, imgClassName)}
    />
  );
}
