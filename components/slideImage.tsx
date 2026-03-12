import { useState } from 'react';
import Image from 'next/image';

export default function SlideImage({ imageUrl, alt, priority,className ,} : { imageUrl: string; alt: string; priority?: boolean, className?: string }) {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
        // What shows when the image is broken
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <span className="text-lg font-semibold">{alt}</span>
                {/* Or put an SVG icon like a camera with a slash through it */}
            </div>
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            fill
            className={className}
            priority={priority}
            quality={100}
            sizes="100vw"
            onError={() => setImgError(true)}
        />
    );
}