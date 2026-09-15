import { copy } from "@/lib/copy";

const trustIcons = {
  verified: (
    <svg viewBox="0 0 22 22" width={20} height={20} fill="none" aria-hidden="true" overflow="visible">
      <path
        d="M11 3l1.8 3.6L18 7.2l-2.8 2.7.7 4.1L11 12.4 6.1 14l.7-4.1L4 7.2l5.2-.6L11 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  direct: (
    <svg viewBox="0 0 22 22" width={20} height={20} fill="none" aria-hidden="true" overflow="visible">
      <path d="M4 11h14M11 4v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  salary: (
    <svg viewBox="0 0 22 22" width={20} height={20} fill="none" aria-hidden="true" overflow="visible">
      <rect x="3.5" y="5" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9h8M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export function TrustStrip() {
  const items = [
    { title: copy.home.trust1Title, body: copy.home.trust1Body, icon: trustIcons.verified },
    { title: copy.home.trust2Title, body: copy.home.trust2Body, icon: trustIcons.direct },
    { title: copy.home.trust3Title, body: copy.home.trust3Body, icon: trustIcons.salary },
  ];
  return (
    <section className="trust-strip" aria-labelledby="trust">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="trust">
            {copy.employers.sectionWhy}
          </h2>
        </div>
        <div className="trust-grid">
          {items.map((item) => (
            <div className="trust-item" key={item.title}>
              <span className="trust-well" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
