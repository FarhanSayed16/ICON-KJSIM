'use client';

import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { HiOutlineCalendar, HiOutlineLightBulb, HiOutlineAcademicCap } from 'react-icons/hi';
import styles from './About.module.css';

const aboutBlocks = [
  {
    icon: <HiOutlineCalendar size={32} />,
    title: 'About the Event',
    description:
      'The official techfest of KJSIM\'s Department of Data Science & Technology. A two-day celebration of innovation, bringing Mumbai\'s brightest minds together for coding, gaming, and tech competitions.',
  },
  {
    icon: <HiOutlineLightBulb size={32} />,
    title: 'About DATATRON',
    description:
      'The Core of Tomorrow\'s Digital Revolution. Dive into the intersection of data science, automation, and AI. DATATRON is the engine driving the next era of technological transformation.',
  },
  {
    icon: <HiOutlineAcademicCap size={32} />,
    title: 'About KJSIM',
    description:
      'A premier management institute under Somaiya Vidyavihar University, Mumbai. KJSIM is known for academic excellence and preparing the next generation of future-ready data professionals.',
  },
];

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>About Us</h2>
            <p>Know what makes ICON special</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {aboutBlocks.map((block, i) => (
            <ScrollReveal key={block.title} delay={i * 0.15}>
              <div className={`glass-card ${styles.card}`}>
                <div className={styles.iconWrap}>{block.icon}</div>
                <h3 className={styles.cardTitle}>{block.title}</h3>
                <p className={styles.cardDesc}>{block.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
