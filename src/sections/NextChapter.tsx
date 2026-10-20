import { useRef } from 'react';
import { Mail } from 'lucide-react';
import { company, nextChapter } from '../data/site';
import { Img } from '../components/Img';
import { Magnetic } from '../components/Magnetic';
import { gsap, useGSAP, wireReveals, MOTION_OK } from '../animations/gsap';

export function NextChapter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = wireReveals(el);
      mm.add(MOTION_OK, () => {
        // The landscape surfaces slowly from the dark as the chapter opens.
        gsap.fromTo(
          '.next__media',
          { clipPath: 'inset(0% 0% 0% 100%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0.32, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 15%', scrub: true } },
        );
        gsap.fromTo('.next__media img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className="section next on-dark" tabIndex={-1} aria-labelledby="next-title">
      <div className="next__media" aria-hidden="true">
        <Img src={nextChapter.photo.key} alt="" sizes="62vw" />
      </div>

      <div className="wrap next__inner">
        <p className="label kicker" data-reveal="up">
          The next chapter
        </p>

        <div className="next__lead">
          <h2 id="next-title" className="display d-xl next__title" data-reveal="words">
            <span className="line">{nextChapter.title[0]}</span> <span className="line">{nextChapter.title[1]}</span>
          </h2>
          <Magnetic strength={0.35}>
            <a className="next__cta" href={`mailto:${company.email}?subject=${encodeURIComponent(nextChapter.subject)}`}>
              <span>
                <Mail size={20} strokeWidth={1.25} aria-hidden="true" />
                Begin a conversation
              </span>
            </a>
          </Magnetic>
        </div>

        <hr className="rule" data-reveal="line" />

        <div style={{ display: 'grid', gap: '1rem', maxWidth: '40rem' }} data-reveal="up">
          <p className="lede">{nextChapter.body}</p>
        </div>

        <div className="contact-grid" data-reveal="stagger">
          <div className="contact-item">
            <span className="label">Headquarters</span>
            <address className="contact-item__value" style={{ fontStyle: 'normal' }}>
              <a href={company.hq.map} target="_blank" rel="noopener noreferrer" className="link-line">
                {company.hq.line1}
                <br />
                {company.hq.line2}
              </a>
            </address>
            <p className="contact-item__note">Opens in Google Maps.</p>
          </div>
          <div className="contact-item">
            <span className="label">Telephone</span>
            <span className="contact-item__value">
              <a href={company.phoneHref} className="link-line">
                {company.phone}
              </a>
            </span>
            <p className="contact-item__note">{company.hours}.</p>
          </div>
          <div className="contact-item">
            <span className="label">Email</span>
            <span className="contact-item__value">
              <a href={`mailto:${company.email}`} className="link-line">
                {company.email}
              </a>
            </span>
            <p className="contact-item__note">{company.emailNote}</p>
          </div>
          <div className="contact-item">
            <span className="label">{nextChapter.officeLabel}</span>
            <address className="contact-item__value" style={{ fontStyle: 'normal' }}>
              <a href={company.office.map} target="_blank" rel="noopener noreferrer" className="link-line">
                {company.office.line1}
                <br />
                {company.office.line2}
              </a>
            </address>
            <p className="contact-item__note">{nextChapter.officeNote}</p>
          </div>
        </div>

        <p className="caption" style={{ margin: 0 }}>
          {nextChapter.photo.caption}
        </p>
      </div>
    </section>
  );
}
