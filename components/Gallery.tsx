'use client';

import { useState } from 'react';

type ImageDetails = {
    url: string;
    nazwa: string;
};

export default function Gallery({ images }: { images: ImageDetails[] }) {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={prev} style={{ fontSize: '2rem', cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}>
                &#8592;
            </button>

            <div style={{ position: 'relative', width: '600px', height: '400px' }}>
                <img
                    src={images[index].url}
                    alt={images[index].nazwa}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
            </div>

            <button onClick={next} style={{ fontSize: '2rem', cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}>
                &#8594;
            </button>
        </div>
    );
}
