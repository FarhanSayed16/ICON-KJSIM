'use client';

import Image from 'next/image';
import { HiOutlineMail } from 'react-icons/hi';
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { TEAM_MEMBERS } from '@/lib/data';
import styles from './TeamPage.module.css';

export default function TeamClient() {
  // Group team members by their 'team' category and sort by 'order'
  const groupedTeam = TEAM_MEMBERS.reduce((acc, member) => {
    if (!acc[member.team]) {
      acc[member.team] = [];
    }
    acc[member.team].push(member);
    return acc;
  }, {});

  // Define the order of categories to render
  const categoryOrder = [
    'Faculty',
    'Organizing Committee',
    'Core Committee',
    'Development Team',
    'Marketing & PR',
    'Logistics & Operations',
  ];

  // Extract keys that exist in data but not in categoryOrder to append them at the end
  const existingCategories = Object.keys(groupedTeam);
  const orderedCategories = [
    ...categoryOrder.filter(cat => existingCategories.includes(cat)),
    ...existingCategories.filter(cat => !categoryOrder.includes(cat))
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        
        {/* Page Header */}
        <ScrollReveal>
          <div className={styles.header}>
            <h1 className={styles.title}>Team <span>ICON</span></h1>
            <p className={styles.subtitle}>
              Meet the passionate minds behind ICON 2026. A dedicated group of faculty, organizers, and developers working tirelessly to build the ultimate techfest experience.
            </p>
          </div>
        </ScrollReveal>

        {/* Dynamic Category Sections */}
        {orderedCategories.map((category) => {
          // Sort members in this category by 'order'
          const members = groupedTeam[category].sort((a, b) => (a.order || 99) - (b.order || 99));

          return (
            <div key={category} className={styles.categorySection}>
              <ScrollReveal>
                <h2 className={styles.categoryHeading}>{category}</h2>
              </ScrollReveal>

              <div className={styles.grid}>
                {members.map((member, index) => {
                  const getInitials = (name) => {
                    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  };

                  return (
                    <ScrollReveal key={index} delay={0.1 + (index % 4) * 0.1}>
                      <div className={styles.card} tabIndex={0}>
                        {/* Static Image / Placeholder */}
                        <div className={styles.imageWrap}>
                          {member.photo ? (
                            <Image
                              src={member.photo}
                              alt={member.name}
                              fill
                              className={styles.image}
                              style={{
                                objectPosition: member.objectPosition || 'center',
                                '--image-scale': member.scale || '1',
                              }}
                              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          ) : (
                            <div className={styles.placeholderImage}>
                              {getInitials(member.name)}
                            </div>
                          )}
                        </div>

                        {/* Static Info */}
                        <div className={styles.info}>
                          <h3 className={styles.name}>{member.name}</h3>
                          <span className={styles.role}>{member.role}</span>
                        </div>

                        {/* Hover Reveal Overlay */}
                        <div className={styles.revealOverlay}>
                          <h3 className={styles.name}>{member.name}</h3>
                          <span className={styles.role} style={{ marginBottom: '1rem' }}>{member.role}</span>
                          <p className={styles.bio}>
                            {member.bio || `Part of the ${member.team} ensuring everything runs smoothly.`}
                          </p>
                          <div className={styles.socialLinks}>
                            {member.linkedin && member.linkedin !== '#' && (
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${member.name} LinkedIn`}>
                                <FaLinkedinIn size={22} />
                              </a>
                            )}
                            {member.email && (
                              <a href={`mailto:${member.email}`} className={styles.socialIcon} aria-label={`Email ${member.name}`}>
                                <HiOutlineMail size={24} />
                              </a>
                            )}
                            {member.instagram && member.instagram !== '#' && (
                              <a href={member.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${member.name} Instagram`}>
                                <FaInstagram size={22} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
