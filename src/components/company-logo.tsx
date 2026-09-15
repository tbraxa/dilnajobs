type CompanyLogoProps = {
  companyName: string;
  className?: string;
};

function NovakLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <rect x="2" y="5" width="52" height="52" rx="8" fill="#143251" />
      <path d="M14 45V17h8l13 17V17h8v28h-8L22 28v17z" fill="#fff" />
      <path d="M14 50h29" stroke="#ffd84d" strokeWidth="4" />
      <text x="67" y="31" fill="#143251" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif">
        NOVÁK
      </text>
      <text x="67" y="46" fill="#667386" fontSize="8.5" fontWeight="700" letterSpacing="1.6" fontFamily="Arial, sans-serif">
        KOVOVÝROBA
      </text>
    </svg>
  );
}

function MoravaLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <path d="M4 49 20 13h20l16 36H44l-4-10H20l-4 10zm20-20h12l-6-14z" fill="#0d6b54" />
      <path d="M19 36h22" stroke="#f3c94f" strokeWidth="4" />
      <text x="68" y="34" fill="#153d35" fontSize="23" fontWeight="900" letterSpacing="-1" fontFamily="Arial, sans-serif">
        TKM
      </text>
      <text x="69" y="47" fill="#5f746f" fontSize="8.5" fontWeight="700" letterSpacing="2.1" fontFamily="Arial, sans-serif">
        MORAVA
      </text>
    </svg>
  );
}

function PlastFormLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <path d="M28 7c14 11 22 20 22 32a22 22 0 1 1-44 0C6 27 14 18 28 7z" fill="#6845d9" />
      <path d="M16 39c7-9 15-9 24 0-7 10-15 10-24 0z" fill="#b9a9ff" />
      <text x="62" y="37" fill="#35245e" fontSize="20" fontWeight="800" fontFamily="Arial, sans-serif">
        plast
      </text>
      <text x="108" y="37" fill="#6845d9" fontSize="20" fontWeight="500" fontFamily="Arial, sans-serif">
        form
      </text>
    </svg>
  );
}

function EnergoLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <rect x="4" y="6" width="50" height="50" rx="25" fill="#fff0c8" />
      <path d="m31 11-16 25h12l-3 17 17-27H29z" fill="#f05a32" />
      <text x="66" y="31" fill="#17263c" fontSize="17" fontWeight="900" fontFamily="Arial, sans-serif">
        ENERGO
      </text>
      <text x="66" y="46" fill="#f05a32" fontSize="11" fontWeight="700" letterSpacing="1.8" fontFamily="Arial, sans-serif">
        SERVIS
      </text>
    </svg>
  );
}

function AccountingLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <circle cx="29" cy="32" r="25" fill="#d9f4e5" />
      <path d="M17 43V24M29 43V18M41 43V29" stroke="#087a5b" strokeWidth="5" />
      <text x="66" y="31" fill="#163c35" fontSize="15" fontWeight="900" fontFamily="Arial, sans-serif">
        ÚČETNÍ SERVIS
      </text>
      <text x="67" y="46" fill="#5d756f" fontSize="8.5" fontWeight="700" letterSpacing="2" fontFamily="Arial, sans-serif">
        PRAHA
      </text>
    </svg>
  );
}

function LogiTransLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <rect x="4" y="9" width="51" height="46" rx="8" fill="#e1eaff" />
      <path d="M13 37h24l-7 8M46 27H22l7-8" fill="none" stroke="#0057e7" strokeWidth="5" />
      <circle cx="16" cy="49" r="4" fill="#ffd84d" />
      <circle cx="43" cy="49" r="4" fill="#ffd84d" />
      <text x="66" y="33" fill="#12335d" fontSize="18" fontWeight="900" letterSpacing="-.7" fontFamily="Arial, sans-serif">
        LOGITRANS
      </text>
      <text x="67" y="47" fill="#66768b" fontSize="8" fontWeight="700" letterSpacing="2.2" fontFamily="Arial, sans-serif">
        JIH
      </text>
    </svg>
  );
}

function SoftForgeLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <rect x="4" y="7" width="50" height="50" rx="9" fill="#122238" />
      <path d="m24 19-9 13 9 13M35 19l9 13-9 13" fill="none" stroke="#8fb3ff" strokeWidth="4" />
      <circle cx="30" cy="32" r="4" fill="#ffd84d" />
      <text x="66" y="33" fill="#14233a" fontSize="18" fontWeight="900" letterSpacing="-.8" fontFamily="Arial, sans-serif">
        SOFTFORGE
      </text>
      <text x="67" y="47" fill="#66768b" fontSize="8" fontWeight="700" letterSpacing="1.7" fontFamily="Arial, sans-serif">
        CZECH
      </text>
    </svg>
  );
}

function DefaultLogo({ companyName, className }: CompanyLogoProps) {
  return (
    <svg viewBox="0 0 190 64" role="img" aria-label={`Logo ${companyName}`} className={className}>
      <rect x="4" y="6" width="50" height="50" rx="9" fill="#e4eaff" />
      <path d="M16 45V23l13-8 13 8v22M22 45V32h14v13" fill="none" stroke="#1649d8" strokeWidth="3" />
      <text x="66" y="30" fill="#14233a" fontSize="12" fontWeight="800" fontFamily="Arial, sans-serif">
        {companyName.slice(0, 18).toUpperCase()}
      </text>
      <text x="66" y="45" fill="#627083" fontSize="8" fontWeight="700" letterSpacing="1.4" fontFamily="Arial, sans-serif">
        ZAMĚSTNAVATEL
      </text>
    </svg>
  );
}

export function CompanyLogo({ companyName, className = "" }: CompanyLogoProps) {
  const normalized = companyName.toLocaleLowerCase("cs");
  const props = { companyName, className };

  if (normalized.includes("novák") || normalized.includes("novak")) return <NovakLogo {...props} />;
  if (normalized.includes("morava") || normalized.includes("konstrukce")) return <MoravaLogo {...props} />;
  if (normalized.includes("plast")) return <PlastFormLogo {...props} />;
  if (normalized.includes("energo")) return <EnergoLogo {...props} />;
  if (normalized.includes("účetní") || normalized.includes("ucetni")) return <AccountingLogo {...props} />;
  if (normalized.includes("logitrans")) return <LogiTransLogo {...props} />;
  if (normalized.includes("softforge")) return <SoftForgeLogo {...props} />;
  return <DefaultLogo {...props} />;
}
