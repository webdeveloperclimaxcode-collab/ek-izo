"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type LoadingStatus = "loading" | "loaded" | "error";

type OptimizedImageProps = ImageProps & {
  fallbackSrc?: string;
  loaderClassName?: string;
};

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  fallbackSrc = "/assets/images/ourproduts/p1.png",
  loaderClassName,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [status, setStatus] = useState<LoadingStatus>("loading");
  const [currentSrc, setCurrentSrc] = useState<ImageProps["src"]>(src);

  const handleLoad: NonNullable<ImageProps["onLoad"]> = (event) => {
    setStatus("loaded");
    onLoad?.(event);
  };

  const handleError: NonNullable<ImageProps["onError"]> = (event) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    setStatus("error");
    onError?.(event);
  };

  return (
    <div
      className={`relative overflow-hidden ${fill ? "w-full h-full" : ""}`}
      style={!fill ? ({ width, height } as React.CSSProperties) : undefined}
    >
      {status === "loading" && (
        <div
          className={`absolute inset-0 z-10 bg-slate-200 dark:bg-slate-800 ${
            loaderClassName ?? ""
          }`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/10" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-300">
          Failed to load image
        </div>
      )}

      <Image
        src={currentSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ease-in-out ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
