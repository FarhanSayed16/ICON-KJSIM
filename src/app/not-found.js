import Link from 'next/link';
import { HiOutlineEmojiSad } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      color: 'var(--text-white)',
      padding: 'var(--space-2xl) var(--space-xl)',
      textAlign: 'center'
    }}>
      <HiOutlineEmojiSad size={80} style={{ color: 'var(--crimson)', marginBottom: 'var(--space-lg)' }} />
      <h1 style={{ 
        fontFamily: 'var(--font-outfit), sans-serif', 
        fontSize: '4rem', 
        lineHeight: 1,
        marginBottom: 'var(--space-md)' 
      }}>404</h1>
      <h2 style={{ 
        fontFamily: 'var(--font-outfit), sans-serif', 
        fontSize: '1.5rem', 
        marginBottom: 'var(--space-xl)',
        color: 'rgba(255,255,255,0.7)'
      }}>Page Not Found</h2>
      
      <p style={{ maxWidth: '400px', marginBottom: 'var(--space-2xl)', color: 'rgba(255,255,255,0.5)' }}>
        The data you are looking for has been corrupted or moved to a different node in the Datatron.
      </p>

      <Link href="/" className="btn-primary">
        Return to Core (Home)
      </Link>
    </div>
  );
}
