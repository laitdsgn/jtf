'use client';

import {useState} from 'react';

type ImageDetails = {
    url: string;
    nazwa: string;
};

export default function Gallery({images}: { images: ImageDetails[] }) {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>

                <button onClick={prev}
                        style={{
                            fontSize: '2rem',
                            cursor: 'pointer',

                            border: 'none',
                            color: 'white'
                        }}
                        className={"hover:scale-110 transition-transform rounded-full duration-300 h-10 text-center w-10 ease-in-out bg-blue-500"}>

                </button>

                <div style={{position: 'relative', width: '600px', height: '400px'}}>
                    <img
                        src={images[index].url}
                        alt={images[index].nazwa}
                        style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}}
                    />
                </div>
                <button onClick={next} style={{
                    fontSize: '2rem',
                    cursor: 'pointer',

                    border: 'none',
                    color: 'white'
                }}
                        className={"hover:scale-110 transition-transform rounded-full duration-300 h-10 text-center w-10 ease-in-out bg-blue-500"}>
                </button>

            </div>


        </>

    );
}
