# FairJobs COPY PACK (v1.3)

Brand lock: **FairJobs** (display). Cílová doména: fairjobs.cz (soft). Infra/repo: dilnajobs.cz.
Produkt: národní job marketplace, všechny profese, CZ-first.
Auth: magic link. Registrace: ARES + jméno, příjmení, DIČ.
Oddělovač: ·   Zakázané v copy: — –

Tone: viz `docs/copy-rules.md`

Path lock (SoT: enterprise-mvp/PATH-LOCKS.md):
- `/` homepage
- `/nabidky` výpis
- `/nabidka/[slug]` detail + apply
- `/pro-firmy`
- `/firma/prihlaseni` · `/firma/registrace`
- `/firma/...` manage / post / applications

---

## 1) Homepage `/`

| Klíč | Text |
|---|---|
| meta_title | FairJobs · nabídky práce |
| meta_description | Nabídky práce v Česku. Hledejte podle pozice, místa a mzdy. Odpovězte přímo firmě. |
| claim | Práce v Česku. Od firem. |
| helper | Všechny obory. Filtrujte podle pozice, místa a mzdy. |
| label_query | Pozice nebo klíčové slovo |
| label_place | Místo |
| placeholder_query | např. účetní, řidič, vývojář |
| placeholder_place | např. Praha, Brno |
| cta_search | Hledat |
| cta_employers | Pro firmy |
| nav_nabidky | Nabídky |
| nav_pro_firmy | Pro firmy |
| nav_login | Přihlášení firem |
| section_latest | Aktuální nabídky |
| footer | © 2026 FairJobs · nabídky práce |

---

## 2) Nabídky `/nabidky`

| Klíč | Text |
|---|---|
| meta_title | Nabídky práce · FairJobs |
| meta_description | Procházejte nabídky práce. Filtrujte podle pozice, místa, úvazku a mzdy. |
| claim | Všechny nabídky |
| helper | Upravte filtry podle pozice, místa a mzdy. |
| label_query | Pozice nebo klíčové slovo |
| label_place | Místo |
| cta_search | Hledat |
| cta_show_filters | Zobrazit filtry |
| cta_filters | Filtry |
| cta_filters_close | Zavřít |
| cta_filters_done | Hotovo |
| section_results | Výsledky |
| filters_place | Místo |
| filters_contract | Úvazek |
| filters_salary | Mzda od |
| filters_salary_any | Bez minima |
| filters_seniority | Seniorita |
| filters_mode | Režim |
| filter_mode_all | Vše |
| filter_mode_onsite | Na místě |
| filter_mode_hybrid | Hybrid |
| filter_mode_remote | Na dálku |
| cta_all_jobs | Zobrazit všechny nabídky |
| section_fields | Všechny obory |
| footer | © 2026 FairJobs · nabídky práce |

### Empty states

| Klíč | Text |
|---|---|
| empty_no_results_title | Žádné nabídky pro tyto filtry |
| empty_no_results_body | Upravte pozici, místo nebo mzdu a zkuste to znovu. |
| empty_no_results_cta | Zrušit filtry |
| empty_no_query_title | Zadejte pozici nebo místo |
| empty_no_query_body | Například účetní v Brně, nebo řidič Praha. |
| empty_error_title | Nabídky se nepodařilo načíst |
| empty_error_body | Zkuste to znovu. Když problém zůstane, napište nám. |
| empty_error_cta | Zkusit znovu |

---

## 3) Job card

| Klíč | Text |
|---|---|
| label_salary | Mzda |
| label_place | Místo |
| label_contract | Úvazek |
| label_seniority | Seniorita |
| label_published | Zveřejněno |
| badge_new | Nové |
| badge_featured | Zvýrazněné |
| salary_range | {from} až {to} Kč |
| salary_from | od {from} Kč |
| contract_hpp | HPP |
| contract_dpp | DPP |
| contract_dpc | DPČ |
| contract_ico | IČO / živnost |
| cta_open | Zobrazit nabídku |
| meta_company | {company} |
| badge_verified | Ověřeno |
| salary_negotiable | mzda dohodou |
| work_mode_label | Režim |
| work_mode_onsite | Na místě |
| work_mode_hybrid | Hybrid |
| work_mode_remote | Na dálku |
| published_today | Zveřejněno dnes |
| published_yesterday | Zveřejněno včera |
| published_days_ago | Zveřejněno před {n} dny |
| label_field | Obor |

---

## 4) Detail + apply `/nabidka/[slug]`

| Klíč | Text |
|---|---|
| cta_apply | Odpovědět na nabídku |
| cta_back | Zpět na nabídky |
| section_about | O pozici |
| section_requirements | Požadavky |
| section_offer | Co nabízíme |
| section_company | O firmě |
| helper_no_account | Bez účtu. Telefon stačí. Údaje uvidí jen {company}. |
| consent_gdpr | Souhlasím se zpracováním údajů za účelem kontaktování k této nabídce. |
| preview_note | Náhled. Odpověď zatím neodesíláme. |
| apply_claim | Odpovědět na nabídku |
| apply_helper | Údaje uvidí jen {company}. |
| label_name | Jméno a příjmení |
| label_phone | Telefon |
| label_email | E-mail (nepovinné) |
| label_cv | Životopis (nepovinné) |
| label_note | Zpráva firmě (nepovinné) |
| cta_submit | Odeslat firmě |
| success_title | Odpověď je odeslaná |
| success_body | Ozvou se vám z firmy. |
| error_required | Doplňte povinná pole. |
| error_phone | Zkontrolujte telefonní číslo. |

---

## 5) Pro firmy `/pro-firmy`

| Klíč | Text |
|---|---|
| meta_title | Pro firmy · FairJobs |
| meta_description | Inzerujte nabídky práce na FairJobs. Odpovědi od uchazečů na jednom místě. |
| claim | Inzerce nabídek práce |
| helper | Zveřejněte pozici. Uchazeči odpoví přímo vám. |
| cta_primary | Založit účet firmy |
| cta_secondary | Přihlásit se |
| cta_post | Vystavit nabídku |
| section_why | Proč FairJobs |
| why_1_title | Jasný inzerát |
| why_1_body | Mzda, místo a úvazek hned vidět. Méně zbytečných odpovědí. |
| why_2_title | Odpovědi na jednom místě |
| why_2_body | Telefon, e-mail a životopis u každé žádosti. |
| why_3_title | Rychlé spuštění |
| why_3_body | Účet firmy a první nabídka během pár minut. |
| bottom_helper | Založte účet firmy a zveřejněte první nabídku. |
| footer | © 2026 FairJobs · nabídky práce |

---

## 6) Přihlášení `/firma/prihlaseni`

| Klíč | Text |
|---|---|
| meta_title | Přihlášení firmy · FairJobs |
| meta_description | Přihlaste se k účtu firmy odkazem z e-mailu. |
| claim | Přihlášení firmy |
| helper | Na e-mail pošleme odkaz pro přihlášení. |
| label_email | Pracovní e-mail |
| placeholder_email | jmeno@firma.cz |
| cta_primary | Poslat přihlašovací odkaz |
| helper_after_send | Odkaz jsme poslali. Podívejte se do schránky. |
| helper_secondary | Nemáte účet? |
| cta_secondary | Zaregistrujte firmu |
| preview_note | Náhled. Odkaz zatím neodesíláme. |
| footer | © 2026 FairJobs · nabídky práce |

---

## 7) Registrace `/firma/registrace`

| Klíč | Text |
|---|---|
| meta_title | Registrace firmy · FairJobs |
| meta_description | Založte účet firmy. Přihlašovací odkaz přijde na e-mail. |
| claim | Registrace firmy |
| helper | Doplňte firmu a kontakt. Přihlašovací odkaz přijde na e-mail. |
| label_company | Název firmy |
| label_ico | IČO |
| label_dic | DIČ (nepovinné) |
| label_city | Město |
| label_first_name | Jméno |
| label_last_name | Příjmení |
| label_email | Pracovní e-mail |
| helper_ares | Údaje firmy doplníme z ARES podle IČO. |
| placeholder_company | např. Acme s.r.o. |
| placeholder_ico | 12345678 |
| placeholder_city | Praha |
| placeholder_email | personalista@firma.cz |
| cta_primary | Založit účet a poslat odkaz |
| helper_after_send | Účet je založený. Odkaz pro přihlášení jsme poslali na e-mail. |
| helper_secondary | Už máte účet? |
| cta_secondary | Přihlaste se |
| preview_note | Náhled. Účet ani odkaz zatím neodesíláme. |
| footer | © 2026 FairJobs · nabídky práce |

---

## Společná navigace

| Klíč | Text |
|---|---|
| brand | FairJobs |
| domain | fairjobs.cz |
| nav_nabidky | Nabídky |
| nav_pro_firmy | Pro firmy |
| nav_login | Přihlášení firem |
| nav_register | Registrace firmy |
| aria_main | Hlavní |
| aria_menu | Menu |

---

## Poznámky

1. Display name: FairJobs. Cílová doména fairjobs.cz (soft). Technická dilnajobs.cz zatím OK. Neplést do UI copy jako brand.
2. Homepage claim drží směr: Práce v Česku. Od firem.
3. Žádná hesla. Po odeslání auth formuláře ukázat helper_after_send.
4. Pricing a e-mailové šablony: stand-by.
5. Auth cesty: jen `/firma/prihlaseni` a `/firma/registrace` (ne `/prihlaseni`).
6. Režim práce: Na místě / Hybrid / Na dálku. Nikdy „Remote“.
7. Trust badge: Ověřeno. Mzda bez čísla: mzda dohodou.
