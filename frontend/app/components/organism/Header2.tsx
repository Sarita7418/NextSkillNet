'use client';

import Image from 'next/image';
import styles from './Header2.module.css'; 

export default function Header2() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/logo2.svg"
          alt="Logo SkillNet"
          width={120}
          height={40}
          priority
        />
      </header>
    </div>
  );
}

