// Demo content for a fictional family holding company. Every name, date, figure
// and address is invented; photographs are illustrative (see credits.ts).
// House style: no em or en dashes in copy. Ranges are written with "to".

export const company = {
  name: 'Brennick Holding Company',
  short: 'BHC',
  shortName: 'Brennick',
  owner: 'Nathan Brennick',
  phone: '000-000-0000',
  phoneHref: 'tel:+10000000000',
  email: 'office@brennick.example',
  emailNote: 'General enquiries and business proposals.',
  hq: { line1: '400 River Road, Suite 1200', line2: 'Louisville, KY 40202', map: '#' },
  office: { line1: '210 Front Street', line2: 'Natchez, MS 39120', map: '#' },
  hours: 'Monday to Friday, 9:00 AM to 5:00 PM',
};

export const nav = [
  { id: 'top', label: 'Home' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'holdings', label: 'Our Holdings' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'contact', label: 'Contact' },
] as const;

/* ------------------------------------------------------------------ */
/* 01 Opening                                                          */

export const opening = {
  eyebrow: 'Louisville, Kentucky',
  established: 'Est. 1868',
  lede:
    'Brennick Holding Company oversees the assets of the Brennick family: real estate, agricultural acreage, timberland, oil and gas interests, renewable energy and financial accounts. The enterprise began with a single sawmill in 1868.',
  facts: [
    { value: '5', label: 'Generations of family ownership' },
    { value: '1868', label: 'Year the first mill opened' },
    { value: '6', label: 'Lines of business today' },
  ],
  photo: { key: 'longleaf', alt: 'Tall longleaf pines rising from a savanna of rust and green grasses under a pale blue sky.', caption: 'Longleaf pine savanna, Mississippi. Illustrative photograph.' },
};

/* ------------------------------------------------------------------ */
/* 02 The Passage of Time                                              */

export type Basis = 'company' | 'archive' | 'record';

export type Chapter = {
  id: string;
  era: string;
  year: string;
  name: string;
  title: string;
  body: string[];
  notes: { basis: Basis; text: string; href?: string }[];
  image: { key: string; alt: string; caption: string; kind: 'photo' | 'portrait' | 'document' };
};

export const passageIntro = {
  title: 'The Passage of Time',
  lede:
    'Five owners carry the family enterprise from a Mississippi sawmill to an office on the Ohio River. Each chapter notes where its facts come from: family records, the family archive or the public record.',
  candor:
    'Every generation inherited something different: a mill, a fleet, a field, an oil lease, a balance sheet. What carried through was the habit of buying land carefully and keeping it.',
};

export const chapters: Chapter[] = [
  {
    id: 'thomas',
    era: '1868 to 1894',
    year: '1868',
    name: 'Thomas Brennick',
    title: 'The first mill',
    body: [
      'Thomas Brennick, a millwright from Ohio, came south after the Civil War and bought a small sawmill and 600 acres of pine near the Homochitto River in 1868.',
      'By the 1880s the mill supplied lumber to river towns from Vicksburg to Baton Rouge, and Thomas had added another 4,000 acres of timberland.',
    ],
    notes: [
      { basis: 'archive', text: 'Mill ledger, 1868 to 1879, held in the family archive.' },
      { basis: 'record', text: 'Deed for the first 600 acres, recorded with the county in 1868.' },
    ],
    image: { key: 'pine-nara', alt: 'An archival index card with a mounted photograph of a stand of tall southern pines.', caption: 'Lumbering in the Gulf South. U.S. National Archives. Illustrative.', kind: 'document' },
  },
  {
    id: 'ada',
    era: '1894 to 1926',
    year: '1894',
    name: 'Ada Brennick',
    title: 'Down the river',
    body: [
      'Thomas’s daughter Ada took over in 1894 and moved the business onto the water, buying two packet boats to carry the family’s lumber and other growers’ cotton downriver.',
      'She also bought the first farmland in the family account, on the reasoning that cleared timberland was worth more planted than left idle.',
    ],
    notes: [
      { basis: 'company', text: 'Ada’s letters to her bank, 1894 to 1910, as kept by the family.' },
      { basis: 'record', text: 'Vessel registrations for the packet boats, 1897.' },
    ],
    image: { key: 'bluff-1864', alt: 'Nineteenth century photograph of a river landing below a steep bluff, with buildings on the shore.', caption: 'A river landing below the bluff, 1864. Library of Congress, public domain. Illustrative.', kind: 'photo' },
  },
  {
    id: 'walter',
    era: '1926 to 1968',
    year: '1931',
    name: 'Walter Brennick',
    title: 'Oil under the pines',
    body: [
      'Ada’s son Walter leased drilling rights on the family’s timberland in 1931. The first well came in that autumn, and royalties carried the business through the Depression.',
      'He kept the land when neighbours sold theirs, and by 1960 the family held more than 20,000 acres of timber, farmland and mineral rights.',
    ],
    notes: [{ basis: 'company', text: 'Oil, gas and mineral lease of 1931, as kept by the family.' }],
    image: { key: 'homochitto-river', alt: 'A wide sandy bend of a river with low wooded banks under a blue sky.', caption: 'Homochitto River, Mississippi. Mac H. Alford, CC BY-SA 4.0. Illustrative.', kind: 'photo' },
  },
  {
    id: 'ruth',
    era: '1968 to 2015',
    year: '1972',
    name: 'Ruth Brennick',
    title: 'A holding company',
    body: [
      'Ruth Brennick, Walter’s granddaughter, formed Brennick Holding Company in 1972 to bring the family’s land, leases and businesses under one roof, and moved its office upriver to Louisville.',
      'She added a financial portfolio and began hedging timber and oil production, turning a collection of assets into a managed enterprise.',
    ],
    notes: [
      { basis: 'record', text: 'Articles of incorporation, Commonwealth of Kentucky, 1972.' },
      { basis: 'company', text: 'First consolidated annual report, 1973.' },
    ],
    image: { key: 'ohio-river', alt: 'A river winding between steep green wooded hills under a sky of scattered clouds.', caption: 'The Ohio River. James St. John, CC BY 2.0. Illustrative.', kind: 'photo' },
  },
  {
    id: 'nathan',
    era: '2015 to present',
    year: '2015',
    name: 'Nathan Brennick',
    title: 'The fifth generation',
    body: [
      'Nathan Brennick, Ruth’s son, became majority owner in 2015. He has kept the family’s rule of buying land carefully and holding it, and added a line of business none of his forebears had: renewable energy.',
      'Today the holding company leases farmland for solar arrays and is restoring longleaf pine on its oldest timber tracts.',
    ],
    notes: [
      { basis: 'company', text: 'First solar lease on family farmland, 2019.' },
      { basis: 'company', text: 'Longleaf restoration plan for the original 1868 tract.' },
    ],
    image: { key: 'solar-farm', alt: 'A row of solar panels set into green farmland beside a country road, seen from above.', caption: 'Solar array on farmland. USDA, public domain. Illustrative.', kind: 'photo' },
  },
];

/* ------------------------------------------------------------------ */
/* 03 Land. Energy. Enterprise.                                        */

export type Holding = { id: string; name: string; index: string; summary: string; detail: string[]; photo: { key: string; alt: string; caption: string } };

export const holdingsIntro = {
  lede: 'Six lines of business, overseen from Louisville. Some reach back to the first generation; one belongs entirely to the fifth.',
};

export const holdings: Holding[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    index: 'I',
    summary: 'Land held by the family across the Gulf South and the Ohio Valley, with the original 1868 tract still at its centre.',
    detail: ['Holdings in Mississippi, Louisiana, Kentucky, Ohio and Texas.', 'Heirloom parcels are never sold; others are bought, leased and traded.'],
    photo: { key: 'hay-mayersville', alt: 'Round hay bales scattered across a broad green field under a clear sky.', caption: 'Farmland in the Mississippi Delta. Quintin Soloviev, CC BY 4.0. Illustrative.' },
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    index: 'II',
    summary: 'Acquisitions, leasing and other transactions in farmland, a line of business since the second generation.',
    detail: ['Row-crop and pasture acreage, leased to local growers.', 'Long-term soil health requirements in every lease.'],
    photo: { key: 'concordia-field', alt: 'Long parallel furrows of a ploughed field stretching to a flat horizon under an overcast sky.', caption: 'Field in Concordia Parish, Louisiana. CC0. Illustrative.' },
  },
  {
    id: 'timberland',
    name: 'Timberland',
    index: 'III',
    summary: 'The oldest line of the family business, dating to the first mill in 1868.',
    detail: ['Managed pine and hardwood timberland in several states.', 'Longleaf restoration on the original tracts.'],
    photo: { key: 'forest-homochitto', alt: 'A dirt track curving through dense green hardwood and pine forest.', caption: 'National forest, Mississippi. USDA Forest Service, public domain. Illustrative.' },
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    index: 'IV',
    summary: 'Royalty and working interests, begun with the first lease on family timberland in 1931.',
    detail: ['Royalty ownership and working interests in oil and gas fields.', 'Ownership of an operating energy company in Louisiana.'],
    photo: { key: 'pumpjack-permian', alt: 'A dark oil pumpjack standing on sandy ground under a deep blue sky.', caption: 'Pumpjack, Permian Basin. Quintin Soloviev, CC BY 4.0. Illustrative.' },
  },
  {
    id: 'renewable',
    name: 'Renewable Energy',
    index: 'V',
    summary: 'Solar and wind leases on family land. The fifth generation’s addition to the enterprise.',
    detail: ['Solar leases on farmland since 2019.', 'Wind exploration on Texas acreage.'],
    photo: { key: 'wind-pumpjack', alt: 'A pumpjack in the foreground with a line of wind turbines on the horizon under a wide sky.', caption: 'Wind turbines and pumpjacks, West Texas. USDA NRCS, public domain. Illustrative.' },
  },
  {
    id: 'financial',
    name: 'Financial Investments',
    index: 'VI',
    summary: 'A diversified portfolio, plus futures and options used to hedge timber, crop and energy production.',
    detail: ['Hedging as insurance for the operating portfolio.', 'Long-only investments held for the family across generations.'],
    photo: { key: 'cbot-1885', alt: 'A nineteenth century engraving of an ornate exchange building with a tall clock tower.', caption: 'Board of Trade building, engraving, 1885. Public domain. Illustrative.' },
  },
];

/* ------------------------------------------------------------------ */
/* 04 Continuity                                                       */

export const continuity = {
  lines: ['Stewardship', 'across time.'],
  words: ['Continuity.', 'Responsibility.', 'Enterprise.'],
  note: '',
};

/* ------------------------------------------------------------------ */
/* 05 Enterprise network                                               */

export type Company = { id: string; name: string; state: string; region: string; category: string; body: string; photo: { key: string; alt: string; caption: string } };

export const enterpriseIntro =
  'The holding company is headquartered in Louisville and owns and oversees several operating companies. Three of them are listed here.';

export const enterpriseNote = 'Each company runs under its own management, with the holding company as owner.';

export const companies: Company[] = [
  {
    id: 'mississippi',
    name: 'Brennick Timber Co. of Mississippi',
    state: 'Mississippi',
    region: 'Mississippi',
    category: 'Timber and land',
    body: 'The company that manages the family’s timberland and the original 1868 tract, including harvest planning, replanting and longleaf restoration.',
    photo: { key: 'river-natchez', alt: 'A wide river at dusk, seen from a white bandstand on a bluff.', caption: 'The Mississippi from the bluff. Mike Tilley, CC BY 3.0. Illustrative.' },
  },
  {
    id: 'louisiana',
    name: 'Brennick Energy Corp. of Louisiana',
    state: 'Louisiana',
    region: 'Louisiana',
    category: 'Energy',
    body: 'The group’s operating energy company, holding working interests in oil and gas fields together with their gathering and logistics facilities.',
    photo: { key: 'atchafalaya', alt: 'Moss hung cypress trees in still swamp water, with white egrets perched among the trunks.', caption: 'Atchafalaya Basin, Louisiana. U.S. Army Corps of Engineers, CC BY 2.0. Illustrative.' },
  },
  {
    id: 'kentucky',
    name: 'Brennick Land & Minerals of Kentucky',
    state: 'Kentucky',
    region: 'Kentucky',
    category: 'Real estate',
    body: 'Holds the family’s Ohio Valley real estate and mineral rights, and the solar leases on its farmland.',
    photo: { key: 'longleaf', alt: 'Tall pines rising from a savanna of rust and green grasses.', caption: 'Longleaf pine savanna. Bill Lea, public domain. Illustrative.' },
  },
];

/* ------------------------------------------------------------------ */
/* 06 Present-day perspective                                          */

export const leadership = {
  kicker: 'Meet the owner',
  name: 'Nathan Brennick',
  nameHtml: ['Nathan', 'Brennick'],
  deck: 'The fifth generation of the family enterprise, and the first to build in renewable energy.',
  caption: 'Placeholder portrait.',
  role: 'Owner, Brennick Holding Company',
  paragraphs: [
    'Nathan Brennick grew up between Louisville and the family’s Mississippi land, and worked in commercial real estate before joining the holding company in 2008. He became majority owner in 2015 and directs the companies, properties and other assets it oversees in five states.',
    'Under his direction the company has moved into renewable energy and begun restoring longleaf pine on its oldest tracts, while keeping the conservative balance sheet the family has always run.',
    'He chairs a regional land trust and writes an annual letter to the family on the state of the enterprise, published openly each spring.',
  ],
  focus: [
    { label: 'Headquarters', value: 'Louisville, Kentucky' },
    { label: 'New direction', value: 'Solar and wind leases' },
    { label: 'Restoration', value: 'Longleaf pine' },
    { label: 'Civic', value: 'Regional land trust' },
  ],
  linksLabel: 'Further reading',
  links: [
    { label: 'Annual letter', href: '#' },
    { label: 'Land stewardship report', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  event: {
    label: 'From the newsroom',
    title: 'Longleaf Field Day',
    body: 'An open day on the original 1868 tract, with foresters, neighbours and students walking the first restoration plots. Held each spring.',
    linkLabel: 'Company newsroom',
    href: '#',
  },
  portrait: { key: 'owner-portrait', alt: 'Silhouetted portrait of a man in a jacket, standing in profile.' },
};

/* ------------------------------------------------------------------ */
/* 07 The next chapter                                                 */

export const nextChapter = {
  title: ['The Story', 'Continues.'],
  body: 'For business enquiries about land, timber, energy or the holding company’s operations, contact the Louisville office during business hours.',
  officeNote: 'Field office for the Mississippi timberland.',
  officeLabel: 'Field office',
  subject: 'Business enquiry for Brennick Holding Company',
  photo: { key: 'wind-pumpjack', alt: 'A pumpjack in the foreground with a line of wind turbines on the horizon under a wide sky.', caption: 'Wind turbines and pumpjacks, West Texas. USDA NRCS, public domain. Illustrative.' },
};

/* ------------------------------------------------------------------ */
/* Footer resources                                                    */

export const resources = [
  { label: 'Annual letter', href: '#' },
  { label: 'Five generations', href: '#heritage' },
  { label: 'Our holdings', href: '#holdings' },
  { label: 'Operating companies', href: '#enterprise' },
  { label: 'Newsroom', href: '#' },
];
