'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { HiOutlineUser, HiOutlineMail, HiOutlineChatAlt2 } from 'react-icons/hi';
import { submitContact } from '@/app/actions/submitContact';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (formDataObj) => {
    if (!formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    try {
      // Call the Server Action
      const result = await submitContact(null, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        setFormData({ name: '', email: '', message: '' }); // Clear form on success
      } else {
        if (result.errors) {
          // Display the first validation error found
          const firstError = Object.values(result.errors)[0];
          toast.error(firstError);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.section} id="contact">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Got an Idea?</h2>
            <p>Reach out to us for collaborations or queries</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.formContainer}>
            <form action={handleAction} className={styles.form}>
              
              <div className={styles.inputGroup}>
                <div className={styles.iconWrap}>
                  <HiOutlineUser size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name (Optional)"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.iconWrap}>
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.iconWrapTop}>
                  <HiOutlineChatAlt2 size={20} />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  required
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>

              <button 
                type="submit" 
                className={`btn-primary ${styles.submitBtn}`}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>

            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
