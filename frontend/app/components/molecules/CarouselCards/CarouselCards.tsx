"use client";
import React, { useState } from 'react';
import './CarouselCards.css';

interface Card {
  imgSrc: string;
  alt: string;
}

const cards: Card[] = [
  { imgSrc: '/conv1.svg', alt: 'Convocatoria 1' },
  { imgSrc: '/conv2.svg', alt: 'Convocatoria 2' },
  { imgSrc: '/conv3.svg', alt: 'Convocatoria 3' },
  { imgSrc: '/conv4.svg', alt: 'Convocatoria 4' },
  { imgSrc: '/conv5.svg', alt: 'Convocatoria 5' },
  { imgSrc: '/conv6.svg', alt: 'Convocatoria 6' },
  // … añade más si quieres
];

export default function CarouselCards() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const maxPage = Math.ceil(cards.length / perPage) - 1;

  const prev = () => setPage(p => Math.max(p - 1, 0));
  const next = () => setPage(p => Math.min(p + 1, maxPage));

  // slice del grupo actual
  const visible = cards.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="carousel">
      <button className="arrow" onClick={prev} disabled={page === 0}>&lt;</button>
      <div className="cards-wrapper">
        {visible.map((c, i) => (
          <img
            key={i}
            src={c.imgSrc}
            alt={c.alt}
            className="card"
          />
        ))}
      </div>
      <button className="arrow" onClick={next} disabled={page === maxPage}>&gt;</button>
    </div>
  );
}
