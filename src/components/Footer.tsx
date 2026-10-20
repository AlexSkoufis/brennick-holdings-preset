import { ArrowUpRight, Plus } from 'lucide-react';
import { company, nav, resources } from '../data/site';
import { photoCredits } from '../data/credits';
import { onAnchorClick } from './Header';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <p className="display footer__brand">
          {company.shortName} <em>Holding Company</em>
        </p>

        <div className="footer__cols">
          <div className="footer__col">
            <h2 className="label">On this page</h2>
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => onAnchorClick(e, item.id)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="label">Headquarters</h2>
            <address>
              <a href={company.hq.map} target="_blank" rel="noopener noreferrer">
                {company.hq.line1}, {company.hq.line2}
              </a>
              <a href={company.phoneHref}>{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span style={{ color: 'var(--on-dark-soft)' }}>{company.hours}</span>
            </address>
          </div>

          <div className="footer__col">
            <h2 className="label">Field office</h2>
            <address>
              <a href={company.office.map} target="_blank" rel="noopener noreferrer">
                {company.office.line1}, {company.office.line2}
              </a>
            </address>
          </div>

          <div className="footer__col">
            <h2 className="label">Resources</h2>
            <ul>
              {resources.map((r) => (
                <li key={r.label}>
                  <a href={r.href}>
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="footer__credits">
          <summary className="label">
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Photography credits
          </summary>
          <p style={{ margin: '1rem 0 0', fontSize: '0.9375rem', color: 'var(--on-dark-soft)', maxWidth: '52rem' }}>
            Photographs are licensed from Wikimedia Commons and Unsplash and are illustrative placeholders.
          </p>
          <ul>
            {photoCredits.map((c) => (
              <li key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-line">
                  {c.what}
                </a>
                . {c.who}. {c.license}.
              </li>
            ))}
          </ul>
        </details>

        <div className="footer__bottom">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <a className="credit-link" href="https://coreconcepts.design/" target="_blank" rel="noopener noreferrer">
            <span className="link-line">Designed by CoreConcepts Design</span>
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
