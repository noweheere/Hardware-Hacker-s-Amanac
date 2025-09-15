import React, { useState } from 'react';
import { StarIcon, HeartIcon } from './Icons';

interface ProjectFeedbackProps {
  onFeedbackSubmitted?: (feedback: ProjectFeedback) => void;
}

interface ProjectFeedback {
  rating: number;
  comment: string;
  category: 'useful' | 'innovative' | 'easy-to-use' | 'documentation' | 'general';
  userType: 'hardware-hacker' | 'student' | 'professional' | 'hobbyist';
}

const ProjectFeedback = ({ onFeedbackSubmitted }: ProjectFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<ProjectFeedback['category']>('general');
  const [userType, setUserType] = useState<ProjectFeedback['userType']>('hobbyist');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const feedback: ProjectFeedback = {
      rating,
      comment,
      category,
      userType
    };

    onFeedbackSubmitted?.(feedback);
    setIsSubmitted(true);

    // Store feedback locally
    const existingFeedback = JSON.parse(localStorage.getItem('projectFeedback') || '[]');
    existingFeedback.push({
      ...feedback,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('projectFeedback', JSON.stringify(existingFeedback));

    // Reset form after 3 seconds
    setTimeout(() => {
      setRating(0);
      setComment('');
      setCategory('general');
      setUserType('hobbyist');
      setIsSubmitted(false);
    }, 3000);
  };

  const categories = [
    { value: 'useful', label: 'Nützlichkeit' },
    { value: 'innovative', label: 'Innovation' },
    { value: 'easy-to-use', label: 'Benutzerfreundlichkeit' },
    { value: 'documentation', label: 'Dokumentation' },
    { value: 'general', label: 'Allgemein' }
  ] as const;

  const userTypes = [
    { value: 'hardware-hacker', label: 'Hardware Hacker' },
    { value: 'student', label: 'Student/in' },
    { value: 'professional', label: 'Professional' },
    { value: 'hobbyist', label: 'Hobbyist' }
  ] as const;

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successMessage}>
          <HeartIcon />
          <h3 style={styles.successTitle}>Vielen Dank für Ihr Feedback!</h3>
          <p style={styles.successText}>
            Ihre Bewertung hilft uns, das Hardware Hacker's Almanac zu verbessern.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Wie findest du dieses Projekt?</h3>
        <p style={styles.subtitle}>Teile deine Meinung über das Hardware Hacker's Almanac mit uns</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.ratingSection}>
          <label style={styles.label}>Bewertung</label>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{
                  ...styles.star,
                  color: star <= (hoveredRating || rating) ? 'var(--primary-color)' : 'var(--border-color)'
                }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <StarIcon />
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectFeedback['category'])}
            style={styles.select}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ich bin ein/e</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as ProjectFeedback['userType'])}
            style={styles.select}
          >
            {userTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Kommentar (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Was gefällt dir besonders gut? Was könnte verbessert werden?"
            style={styles.textarea}
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={rating === 0}
          style={{
            ...styles.submitButton,
            opacity: rating === 0 ? 0.5 : 1,
            cursor: rating === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Feedback senden
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--foreground-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  header: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'var(--primary-color)',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-color-secondary)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  ratingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-color)',
  },
  stars: {
    display: 'flex',
    gap: '0.25rem',
  },
  star: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    transition: 'background-color 0.2s',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    fontSize: '0.9rem',
  },
  textarea: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    fontSize: '0.9rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  successMessage: {
    textAlign: 'center',
    padding: '1rem',
    color: 'var(--primary-color)',
  },
  successTitle: {
    margin: '0.5rem 0',
    fontSize: '1.1rem',
  },
  successText: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--text-color-secondary)',
  },
};

export default ProjectFeedback;