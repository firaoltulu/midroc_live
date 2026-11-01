import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  id,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-80px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className || ''}`.trim()}
      id={id}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` }}
    >
      {children}
    </Tag>
  );
}
