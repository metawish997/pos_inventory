import React, { useState } from 'react';
import styles from './Accordion.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordion}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        <button className={styles.toggleBtn} type="button">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
