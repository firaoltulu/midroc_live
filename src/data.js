import {
  Sprout,
  Mountain,
  HardHat,
  Factory,
  ShoppingBag,
  Hotel,
} from 'lucide-react';

export const SECTORS = [
  {
    key: 'agriculture',
    name: 'Agriculture',
    icon: Sprout,
    accent: 'var(--leaf)',
    description:
      'Feeding nations through mechanised farming, agro-processing and sustainable value chains across the continent.',
    stats: [
      { label: 'Hectares under cultivation', value: '12k+' },
      { label: 'Farmers partnered', value: '8,400' },
    ],
  },
  {
    key: 'mining',
    name: 'Mining',
    icon: Mountain,
    accent: 'var(--rust)',
    description:
      'Responsibly extracting the minerals that power the country gross — gold, copper and rare earths.',
    stats: [
      { label: 'Companies', value: '7' },
      { label: 'Tonnes / annum', value: '2.3Mt' },
    ],
  },
  {
    key: 'construction',
    name: 'Construction',
    icon: HardHat,
    accent: 'var(--ember)',
    description:
      'Engineering skylines, highways and industrial parks with a workforce of more than 6,000 across the region.',
    stats: [
      { label: 'Projects delivered', value: '230+' },
      { label: 'Workforce', value: '6,000' },
    ],
  },
  {
    key: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    accent: 'var(--azure)',
    description:
      'From steel and cement to consumer goods — building the industrial backbone of an import-light future.',
    stats: [
      { label: 'Plants', value: '17' },
      { label: 'Output / yr', value: '$420M' },
    ],
  },
  {
    key: 'commerce',
    name: 'Commerce',
    icon: ShoppingBag,
    accent: 'var(--cyan)',
    description:
      'Last-mile logistics bringing millions of products to emerging-market consumers.',
    stats: [
      { label: 'Active customers', value: '3.2M' },
      { label: 'Cities served', value: '3' },
    ],
  },
  {
    key: 'hospitality',
    name: 'Hospitality',
    icon: Hotel,
    accent: 'var(--rose)',
    description:
      'Hotels, resorts and experiences crafted around the rhythms of business and leisure travel across ethiopia.',
    stats: [
      { label: 'Properties', value: '4' },
      { label: 'Keys', value: '4,600' },
    ],
  },
];

export const NEWS = [
  // {
  //   id: 1,
  //   category: 'Agriculture',
  //   title: 'New Perennial Rice Varieties introduced as symbol of Driving New Era of Agricultural Transformation‎Officials visit MIDROC Investment Group’s six perennial rice varieties being tested under an agreement signed between Saudi Star Agricultural Development and the Ethiopian Institute of Bio and Emerging Technology.‎',
  //   excerpt:
  //     '',
  //   date: 'Jun 24, 2026',
  //   readMins: 4,
  //   emoji: '⛏️',
  //   c1: '#3a2a1d',
  //   c2: '#1d1308',
  // },
  // {
  //   id: 2,
  //   category: 'Agriculture',
  //   title: 'New agro-processing hub opens in Oromia, serving 12,000 smallholders',
  //   excerpt:
  //     'The facility will process maize, coffee and sesame, with full traceability back to the farm gate.',
  //   date: 'Jun 18, 2026',
  //   readMins: 3,
  //   emoji: '🌾',
  //   c1: '#1f2d1c',
  //   c2: '#0d1408',
  // },
  // {
  //   id: 3,
  //   category: 'Construction',
  //   title: 'Midroc awarded the Addis–Djibouti logistics corridor upgrade',
  //   excerpt:
  //     'A 312km corridor upgrade includes smart-tolling, fibre backbone and seven logistics nodes.',
  //   date: 'Jun 12, 2026',
  //   readMins: 5,
  //   emoji: '🏗️',
  //   c1: '#3a2418',
  //   c2: '#1d0f08',
  // },
  // {
  //   id: 4,
  //   category: 'Hospitality',
  //   title: 'Mövenpick by Midroc to debut in Kigali by end of 2026',
  //   excerpt:
  //     'The 240-key property will be the group’s flagship in the region, featuring a 1,200 sqm events centre.',
  //   date: 'Jun 05, 2026',
  //   readMins: 3,
  //   emoji: '🏨',
  //   c1: '#3a1f2a',
  //   c2: '#1d0e14',
  // },
  // {
  //   id: 5,
  //   category: 'Manufacturing',
  //   title: 'Group commissions East Africa’s largest rooftop solar array',
  //   excerpt:
  //     'A 38MW rooftop installation now powers our largest cement plant, displacing 41,000 tCO₂e / yr.',
  //   date: 'May 28, 2026',
  //   readMins: 4,
  //   emoji: '⚙️',
  //   c1: '#16263a',
  //   c2: '#08101d',
  // },
  // {
  //   id: 6,
  //   category: 'E-Commerce',
  //   title: 'Soko+ reaches 3 million monthly active customers',
  //   excerpt:
  //     'Our commerce arm crosses a milestone, with same-day delivery now live in 14 cities.',
  //   date: 'May 20, 2026',
  //   readMins: 2,
  //   emoji: '🛒',
  //   c1: '#16302a',
  //   c2: '#081d18',
  // },
  // {
  //   id: 7,
  //   category: 'Mining',
  //   title: 'Annual ESG report: 96% water recycling across all operations',
  //   excerpt:
  //     'The 2025 sustainability report details record water and waste performance across all six sectors.',
  //   date: 'May 14, 2026',
  //   readMins: 6,
  //   emoji: '💧',
  //   c1: '#1d2a3a',
  //   c2: '#08101d',
  // },
  // {
  //   id: 8,
  //   category: 'Group',
  //   title: 'Midroc appoints new Group CFO ahead of international bond',
  //   excerpt:
  //     'A new chapter for the group as it prepares to access international capital markets in H2.',
  //   date: 'May 02, 2026',
  //   readMins: 3,
  //   emoji: '📈',
  //   c1: '#2a2230',
  //   c2: '#15101a',
  // },
  // {
  //   id: 9,
  //   category: 'Agriculture',
  //   title: 'Smallholder coffee programme reaches 8,400 farmers in year one',
  //   excerpt:
  //     'Premium pricing, agronomy training and direct trade relationships are reshaping rural incomes.',
  //   date: 'Apr 24, 2026',
  //   readMins: 4,
  //   emoji: '☕',
  //   c1: '#2a1d10',
  //   c2: '#15100a',
  // },
];

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

export const TIMELINE = [
  { year: '1991', title: 'Founded in Addis Ababa', desc: 'A single trading operation focused on importing industrial inputs for East Africa.' },
  { year: '2003', title: 'First manufacturing plant', desc: 'Cement and steel production begins — the foundation of the manufacturing vertical.' },
  { year: '2018', title: 'A unified group identity', desc: 'Six sectors, one brand — Midroc re-launched across the continent.' },
  { year: '2019', title: 'E-Commerce launched', desc: 'Queens goes live, beginning a transformation of the consumer business.' },
  { year: '2023', title: 'Margin of Moha Beverage', desc: 'Margining of the Moha Beverage with the Group.' },
  // { year: '2026', title: 'A unified group identity', desc: 'Six sectors, one brand — Midroc re-launched across the continent.' },
];

export const VALUES = [
  {
    title: 'Stewardship',
    desc: 'We build for the long term — for our communities and our planet.',
    icon: 'Compass',
  },
  {
    title: 'Excellence',
    desc: 'World-class execution, in every plant, every site, every market we enter.',
    icon: 'Award',
  },
  {
    title: 'Integrity',
    desc: 'Transparent governance and ethical conduct at every level of the group.',
    icon: 'Shield',
  },
  {
    title: 'Innovation',
    desc: 'New ideas, technologies and partnerships that create the next generation of African industry.',
    icon: 'Sparkles',
  },
];

export const LEADERSHIP = [
  { initials: 'MH', name: 'Sheik Mohammed Hussein Ali Al-Amoudi', role: 'Chairman' },

  { initials: 'JA', name: 'Jemal Ahemed', role: 'Group CEO' },
  // { initials: 'SB', name: 'Sara Brihane', role: 'Group CTO' },
  { initials: 'DM', name: 'Dula Mekonnen', role: 'D-CEO Mining' },
  { initials: 'FT', name: 'Feleka Tadesse', role: 'D-CEO Agro-Processing' },

  { initials: 'AA', name: 'Akalewold Admassu', role: 'D-CEO Manufacturing' },
  { initials: 'SZ', name: 'Solomon Zewdu', role: 'D-CEO Hotel and Resorts' },
  { initials: 'KH', name: 'Kassahun Hailemariam', role: 'D-CEO Construction' },
  { initials: 'HA', name: 'Hussein Ahmed', role: 'D-CEO Commerce' },

];

export const OFFICES = [
  { city: 'Addis Ababa', tag: 'Headquarters', address: 'Nani Tower, Stadium Road', phone: '(+251) 115549791/95' },
];

export const COMPANIES = {
  agriculture: [
    {
      id: 'ELFORA-AGRO-INDUSTRIES-PLC',
      name: 'ELFORA AGRO-INDUSTRIES PLC.',
      short: 'ELFORA is one of the largest Agro-Industry companies operating under the Agro-Cluster of MIDROC Investment group in Ethiopia. The company was established in 1997 G.C.',
      location: 'Oromia, Ethiopia',
      founded: 1997,
      employees: 420,
      emoji: '🌾',
      stats: [
        { label: 'Smallholders served', value: '12,000' },
        { label: 'Throughput / yr', value: '85,000 t' },
      ],
    },
    {
      id: 'JITTU-HORTICULTURE',
      name: 'JITTU HORTICULTURE',
      short: 'On 22 May 2000 E.C, it was established as Jittu Horticulture holding various farms together, and then joined MIDROC Investment Group on July 25, 2008 E.C.',
      location: 'Sidamo & Yirgacheffe',
      founded: 2000,
      employees: 180,
      emoji: '☕',
      stats: [
        { label: 'Active farmers', value: '8,400' },
        { label: 'Export markets', value: '14' },
      ],
    },
    {
      id: 'ETHIO-AGRI-CEFT-PLC',
      name: 'ETHIO AGRI CEFT PLC.',
      short: 'Was established in 1993 E.C. It is engaged in the production of polypropylene and polyethylene products such as poly plastic bags,',
      location: 'Rift Valley, Ethiopia',
      founded: 1993,
      employees: 760,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },

    {
      id: 'HORIZON-PLANTATIONS-PLC',
      name: 'HORIZON PLANTATIONS PLC.',
      short: 'was founded in 1986 E.C. Currently it is engaged in the production of crown cork and tin can.',
      location: 'Rift Valley, Ethiopia',
      founded: 1986,
      employees: 1760,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'BEBEKA COFFEE ESTATE',
      name: 'BEBEKA-COFFEE-ESTATE',
      short: 'Was established in 1997. It is engaged in manufacturing leather products. Under ELICO there are …',
      location: 'Rift Valley, Ethiopia',
      founded: 1997,
      employees: 260,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'GOJEB-FARM-DEVELOPMENT',
      name: 'GOJEB FARM DEVELOPMENT',
      short: 'Hawassa Agri-manufacturing PLC is under establishment in Hawassa specifically located in the premises ..',
      location: 'Hawassa, Ethiopia',
      founded: 1997,
      employees: 260,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'HORIZON-COFFEE-PROCESSING-AND-STORING-PLANT',
      name: 'HORIZON COFFEE PROCESSING AND STORING PLANT.',
      short: 'Was founded in 1972 by Emperor Haile-selassie in collaboration with the Czechoslovakian government.',
      location: 'Jemma, Ethiopia',
      founded: 1982,
      employees: 160,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'The-Ex-Limmu-Coffee-farms',
      name: 'The Ex-Limmu Coffee farms.',
      short: 'Was established in 2020 to produce and supply bread to the people living in Addis Ababa and the surrounding areas.',
      location: 'Limmu, Ethiopia',
      founded: 2020,
      employees: 70,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'SAUDI-STAR-AGRICULTURAL-DEVELOPMENT-PLC',
      name: 'SAUDI STAR AGRICULTURAL DEVELOPMENT PLC.',
      short: 'Was established in 1996. It is engaged in the production of galvanized corrugated.',
      location: 'Gambala, Ethiopia',
      founded: 1996,
      employees: 260,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
    {
      id: 'UPPER-AWASH-AGRO-INDUSTRY-ENTERPRISE',
      name: 'UPPER AWASH AGRO-INDUSTRY ENTERPRISE.',
      short: 'Was established in 2007 E.C. It is engaged in the production of milk and milk products.',
      location: 'Awash, Ethiopia',
      founded: 2007,
      employees: 660,
      emoji: '🌱',
      stats: [
        { label: 'Hectares', value: '18,000' },
        { label: 'Yield / ha', value: '+34%' },
      ],
    },
  ],
  mining: [
    {
      id: 'DASHEN-CEMENT-PLC',
      name: 'DASHEN CEMENT PLC.',
      short: 'Dashen Cement Private Limited Company was established in 2006 and began production in 2008. The plant is situated in Dejen town, East Gojam, Amhara Regional State and is located 230 km from Addis Ababa.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2006,
      employees: 340,
      emoji: '⛏️',
      stats: [
        { label: 'Concession area', value: '240 km²' },
        { label: 'Pilot duration', value: '14 mo' },
      ],
    },
    {
      id: 'MIDROC-GEO-EXPLORATION-SERVICES-PLC',
      name: 'MIDROC GEO EXPLORATION SERVICES PLC.',
      short: 'Engaged in exploration, surveying and consultancy of precious minerals towards extraction, construction and drilling throughout the nation.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2000,
      employees: 1200,
      emoji: '🥇',
      stats: [
        { label: 'Production / yr', value: '4.2 t' },
        { label: 'Reserves', value: '62 t' },
      ],
    },
    {
      id: 'MIDROC-GOLD-MINE-PLC',
      name: 'MIDROC GOLD MINE PLC.',
      short: 'Engaged in extraction and processing of high quality gold through its open and underground pits at Legedenbi and Sakaro extraction sites; and a modern processing plant situated nearby to...',
      location: 'Addis Ababa, Ethiopia',
      founded: 1990,
      employees: 2210,
      emoji: '🪨',
      stats: [
        { label: 'Projects', value: '2' },
        { label: 'Drilled metres', value: '48,000' },
      ],
    },


    {
      id: 'NATIONAL-MINING-CORPORATION-PLC',
      name: 'NATIONAL MINING CORPORATION PLC.',
      short: 'Engaged in extraction, processing and marketing of precious dimension stones such as marble and granite. The company extracts dimension stones from its own quarry sites located at Dalleti, Oromia region.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2006,
      employees: 340,
      emoji: '⛏️',
      stats: [
        { label: 'Concession area', value: '240 km²' },
        { label: 'Pilot duration', value: '14 mo' },
      ],
    },
    {
      id: 'RERE-PROJECT-DEVELOPER-PLC',
      name: 'RERE PROJECT DEVELOPER PLC.',
      short: 'Established on February 8, 2022, G.C., with an initial capital of 100,000,000 Birr, RERE PROJECT DEVELOPER PLC specializes in real estate operations, including consultancy, construction, sales, rental, …',
      location: 'Addis Ababa, Ethiopia',
      founded: 2022,
      employees: 1200,
      emoji: '🥇',
      stats: [
        { label: 'Production / yr', value: '4.2 t' },
        { label: 'Reserves', value: '62 t' },
      ],
    },
    {
      id: 'Trans-National-Aviation-PLC',
      name: 'Trans National Aviation PLC.',
      short: 'is engaged in commercial air transportation of passengers and cargo.',
      location: 'Addis Ababa, Ethiopia',
      founded: 1990,
      employees: 40,
      emoji: '🪨',
      stats: [
        { label: 'Projects', value: '2' },
        { label: 'Drilled metres', value: '48,000' },
      ],
    },
    {
      id: 'SALAM-HEALTH-CARE-PLC',
      name: 'SALAM HEALTH CARE PLC.',
      short: 'Salam Health Care PLC initially was formed under the name of TAM Health Enterprise established in 1990 G.C by Sheikh Mohammed Al-Amoudi and Professor Taye Mekuria.',
      location: 'Addis Ababa, Ethiopia',
      founded: 1990,
      employees: 110,
      emoji: '🪨',
      stats: [
        { label: 'Projects', value: '2' },
        { label: 'Drilled metres', value: '48,000' },
      ],
    },
  ],
  construction: [
    {
      id: 'MIDROC-CONSULTING-ARCHITECTS-&-EGINEERS-PLC',
      name: 'MIDROC CONSULTING ARCHITECTS & EGINEERS PLC.',
      short: 'MIDROC CONSULTING PLC. established on February 2, 2010 E.C. In June 2010 E.C, it started providing engineering and ICT services to sister companies with 44 permanent employees.',
      location: 'Addis Ababa',
      founded: 2010,
      employees: 400,
      emoji: '🏗️',
      stats: [
        { label: 'Projects delivered', value: '230+' },
        { label: 'Annual revenue', value: '$680M' },
      ],
    },
    {
      id: 'HUDA-REAL-ESTATE-PLC',
      name: 'HUDA REAL ESTATE PLC.',
      short: 'Huda Real Estate PLC was established on 10 October 1997 G.C by Sheikh Mohamed Hussien Ali Al Amoudi as a member of MIDROC Ethiopia. Since the company was established in the year 1997 it has provided many solution-providing development services to the country in the construction sector.',
      location: 'Addis Ababa, Ethiopia',
      founded: 1997,
      employees: 1100,
      emoji: '🛣️',
      stats: [
        { label: 'Roads built', value: '1,800 km' },
        { label: 'Active sites', value: '14' },
      ],
    },
    {
      id: 'MIDROC-CONSTRUCTION-ETHIOPIA-PLC',
      name: 'MIDROC CONSTRUCTION ETHIOPIA PLC.',
      short: 'MIDROC Construction Ethiopia PLC was founded on Oct 22, 1993 G.C (12-2-86 E.C) by Sheik Mohammed Hussien Ali Al-Amoudi and Ato Tadele Yidnekatchew Tessema.',
      location: 'Addis Ababa, Ethiopia',
      founded: 1993,
      employees: 220,
      emoji: '🏙️',
      stats: [
        { label: 'Developments', value: '9' },
        { label: 'Pipeline value', value: '$420M' },
      ],
    },
  ],
  manufacturing: [
    {
      id: 'Addis-Gas-&-Plastics-PLC',
      name: 'Addis Gas & Plastics PLC.',
      short: 'was established in 1996 E.C. It is engaged in manufacturing and marketing of industrial gases (carbon dioxide and oxygen) and plastic crates for household and industrial uses.',
      location: 'Addis Ababa',
      founded: 1996,
      employees: 200,
      emoji: '🧱',
      stats: [
        { label: 'Capacity / yr', value: '4.2 Mt' },
        { label: 'Renewable share', value: '38%' },
      ],
    },
    {
      id: 'AHFA-PLC',
      name: 'AHFA PLC.',
      short: 'Was founded in 1992 E.C. It is mainly engaged in manufacturing and supply of food products, such as high quality Pasta, Macaroni, Vegetable Ghee, Margarine and Wheat Flour with …',
      location: 'Addis Ababa, Kenya',
      founded: 1992,
      employees: 140,
      emoji: '🔩',
      stats: [
        { label: 'Output / yr', value: '420 kt' },
        { label: 'Plants', value: '2' },
      ],
    },
    {
      id: 'Blue-Nile-PP-&-Craft-Paper-Bags-Manufacturing-PLC',
      name: 'Blue Nile PP & Craft Paper Bags Manufacturing PLC.',
      short: 'Was established in 1993 E.C. It is engaged in the production of polypropylene and polyethylene products such as poly plastic bags,…',
      location: 'Addis Ababa',
      founded: 1993,
      employees: 620,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },


    {
      id: 'Daylight-Applied-Technologies-PLC',
      name: 'Daylight Applied Technologies PLC.',
      short: 'was founded in 1986 E.C. Currently it is engaged in the production of crown cork and tin can.',
      location: 'Addis Ababa',
      founded: 1986,
      employees: 120,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Ethio-Leather-Industry-(ELICO)-PLC',
      name: 'Ethio Leather Industry (ELICO) PLC.',
      short: 'Was established in 1997. It is engaged in manufacturing leather products. Under ELICO there are …',
      location: 'Addis Ababa',
      founded: 1997,
      employees: 320,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Hawassa-Agri-Manufacturing-PLC',
      name: 'Hawassa Agri-Manufacturing PLC.',
      short: 'Hawassa Agri-manufacturing PLC is under establishment in Hawassa specifically located in the premises ..',
      location: 'Hawassa, Ethiopia',
      founded: 1993,
      employees: 120,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Horizon-Addis-Tyre-PLC',
      name: 'Horizon Addis Tyre PLC.',
      short: 'Was founded in 1972 by Emperor Haile-selassie in collaboration with the Czechoslovakian government.',
      location: 'Addis Ababa',
      founded: 1972,
      employees: 320,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'HORIZON-PLANTATIONS-SHEGER-BREAD-AND-FLOUR-FACTORY-PLC',
      name: 'HORIZON PLANTATIONS SHEGER BREAD AND FLOUR FACTORY PLC.',
      short: 'Was established in 2020 to produce and supply bread to the people living in Addis Ababa and the surrounding areas.',
      location: 'Addis Ababa',
      founded: 2020,
      employees: 620,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Kombolcha-Steel-Products-Industry-(KOSPI)-PLC',
      name: 'Kombolcha Steel Products Industry (KOSPI) PLC.',
      short: 'Was established in 1996. It is engaged in the production of galvanized corrugated.',
      location: 'Kombolcha, Ethiopia',
      founded: 1996,
      employees: 620,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Lame-Dairy-PLC',
      name: 'Lame Dairy PLC.',
      short: 'Was established in 2007 E.C. It is engaged in the production of milk and milk products.',
      location: 'Addis Ababa',
      founded: 2007,
      employees: 120,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'MAYA-PP-BAG-MANUFACTURING-PLC',
      name: 'MAYA PP BAG MANUFACTURING PLC.',
      short: 'Maya PP Bag Manufacturing PLC is a privately owned company that was established by Ethiopian billionaire Sheik Mohammed Hussein Al Amoudi.',
      location: 'Bishoftu, Ethiopia',
      founded: 1993,
      employees: 320,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Modern-Building-Industries-(MBI)-PLC',
      name: 'Modern Building Industries (MBI) PLC.',
      short: 'Modern Building Industry (MBI) is a member of MIDROC Investment Group; the company was established on April 19, 1987 E.C.',
      location: 'Addis Ababa',
      founded: 1987,
      employees: 220,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Sheger-Oil-Factory-PLC',
      name: 'Sheger Oil Factory PLC.',
      short: 'Is a project currently under formation. Its aim is to produce edible oil.',
      location: 'Addis Ababa',
      founded: 1997,
      employees: 120,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Summit-Engineered-Plastics-Pvt.-Ltd.-Co.-(SEPCo)',
      name: 'Summit Engineered Plastics Pvt. Ltd. Co. (SEPCo).',
      short: 'Summit Engineered Plastics Pvt. Ltd. Co. (SEPCo),a member of the MIDROC Investment Group, is engaged in manufacturing and selling of plastic packaging products.',
      location: 'Addis Ababa',
      founded: 2000,
      employees: 110,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'Unlimited-Packaging-PLC',
      name: 'Unlimited Packaging PLC.',
      short: 'Was founded in 1989 E.C. It manufactures flat and box carton that can be used for packaging of materials.',
      location: 'Addis Ababa',
      founded: 1989,
      employees: 150,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'WANZA-FURNISHINGS-INDUSTR-YPLC',
      name: 'WANZA FURNISHINGS INDUSTRY PLC.',
      short: 'Wanza Furnishings Industry has been established in the early 1950s in Addis Ababa as Joint Venture of an Armenian company (owned by Mr. Vaskin Sician,) and a Norwegian company (owned by Mr. Mozvold).',
      location: 'Addis Ababa',
      founded: 1950,
      employees: 620,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },
    {
      id: 'VISION-ALUMINUM-MANUFACTURING-PLC',
      name: 'VISION ALUMINUM MANUFACTURING PLC.',
      short: 'Vision Aluminum Manufacturing PLC was established in November 3, 2007 G.C by Sheikh Muhammad Hussien Ali Al Amoudi and Sheikh Hasen Ali Al Amoudi.',
      location: 'Addis Ababa',
      founded: 2007,
      employees: 220,
      emoji: '🥫',
      stats: [
        { label: 'Brands', value: '8' },
        { label: 'SKUs', value: '420' },
      ],
    },

  ],
  commerce: [
    {
      id: 'ADAGO-MIDROC-Trading-PLC',
      name: 'ADAGO MIDROC Trading PLC.',
      short: 'Is engaged in import and wholesale of industrial raw materials and merchandises. Export business and customs clearing are additional line of business for ADAGO.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2008,
      employees: 400,
      emoji: '🛒',
      stats: [
        { label: 'Monthly actives', value: '3.2M' },
        { label: 'Cities served', value: '47' },
      ],
    },
    {
      id: 'Queen’s-Super-Market-PLC',
      name: 'Queen’s Super Market PLC.',
      short: 'Engaged in supermarket (retail) business focusing on agro-industry products, food staff items, detergent & personal care products, fresh farm products, and the like.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2009,
      employees: 6800,
      emoji: '🚚',
      stats: [
        { label: 'Drivers', value: '6,000' },
        { label: 'Parcels / day', value: '140k' },
      ],
    },
    {
      id: 'TRUST-Protection-&-Personnel-Services-PLC',
      name: 'TRUST Protection & Personnel Services PLC.',
      short: 'is mainly engaged in provision of protection and security services as well as dealing other non-protection personnel services.',
      location: 'Addis Ababa',
      founded: 2001,
      employees: 240,
      emoji: '💳',
      stats: [
        { label: 'Merchants', value: '92,000' },
        { label: 'Annual TPV', value: '$1.2B' },
      ],
    },
  ],
  hospitality: [
    {
      id: 'ADDIS-INTERNATIONAL-CATERING-PLC',
      name: 'ADDIS INTERNATIONAL CATERING PLC.',
      short: 'Addis International Catering PLC was established in July 2000 E.C under the ownership of Sheik Mohammed Hussien Ali Al-Amoudi.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2000,
      employees: 480,
      emoji: '🏨',
      stats: [
        { label: 'Properties', value: '6' },
        { label: 'Keys', value: '1,340' },
      ],
    },
    {
      id: 'ADDIS-PARK-DEVELOPMENT-AND-MANAGEMENT-PLC',
      name: 'ADDIS PARK DEVELOPMENT AND MANAGEMENT PLC.',
      short: 'is one of the member companies of MIDROC Investment Group organized under commerce cluster.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2015,
      employees: 720,
      emoji: '🦁',
      stats: [
        { label: 'Lodges', value: '14' },
        { label: 'Beds', value: '480' },
      ],
    },
    {
      id: 'BLUE-NILE-RESORTS',
      name: 'BLUE NILE RESORTS.',
      short: 'Franchise agreement signed with Marriott 120 key SPA,GYM & Swimming pool.',
      location: 'Addis Ababa, Ethiopia',
      founded: 2012,
      employees: 260,
      emoji: '🏝️',
      stats: [
        { label: 'Resorts', value: '4' },
        { label: 'Keys', value: '780' },
      ],
    },
    {
      id: 'SHERATON-ADDIS-A-LUXURY-COLLECTION',
      name: 'SHERATON ADDIS A LUXURY COLLECTION.',
      short: 'Opened for service 1998 Our Luxury collection is one of the best hotels in Africa. The 1st privately owned international hotel in the nation..',
      location: 'Addis Ababa, Ethiopia',
      founded: 1998,
      employees: 300,
      emoji: '🏝️',
      stats: [
        { label: 'Resorts', value: '4' },
        { label: 'Keys', value: '780' },
      ],
    },
  ],
};

export const ALL_COMPANIES = Object.entries(COMPANIES).flatMap(([clusterKey, list]) =>
  list.map((c) => ({ ...c, clusterKey })),
);

export function findCompany(id) {
  return ALL_COMPANIES.find((c) => c.id === id);
}

export function findCluster(key) {
  return SECTORS.find((s) => s.key === key);
}