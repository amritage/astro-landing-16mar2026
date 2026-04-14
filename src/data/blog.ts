export interface BlogPost {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      subSections?: { heading: string; body: string }[];
    }[];
  };
  checklist?: { icon: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  benchmark?: { label: string; value: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-textile-supplier",
    category: "Fabric Knowledge",
    date: "October 24, 2023",
    readTime: "5 min read",
    title: "How to Choose the Right Textile Supplier for Your Business?",
    excerpt:
      "In the competitive landscape of garment manufacturing, your choice of textile supplier is more than a procurement decision — it's a strategic partnership that defines your product's market value.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIsuUfFu0X-x2rTJGhpGazYOOECoxtKFkgoEcEQ5E9czMxRzF0tW-JL0BS7LsLYtfhp09WObxGBJWnrm52VXkjQqpo0wmXLTUQ15hxVceWmkqonBrwycuAsUHyZsaCobcCNG3H29nY-TZJrl7QpplOqTYjcsnD-RmcPAm02tYfHrPg22m-w0D0WnwYDT4c7ypt6XWnn0nuvCNyJJs3PatiNbpV6nN9-gnlhIyC6vziPONLftoEMVHWy7_9OQSelmOSk7XjXY_ZrFcU",
    imageAlt: "High quality textile rolls in a modern warehouse",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "Selecting the right supplier is the cornerstone of a successful fashion or home textile business. At Amrita Global Enterprises, we understand that reliability and technical excellence are the threads that bind long-term growth. From managing production timelines to ensuring consistent yarn quality, every detail matters.",
      sections: [
        {
          heading: "Key Factors in Supplier Selection",
          body: "When auditing a potential partner, look beyond the price tag. Global supply chains require a holistic approach to evaluation — from quality consistency to logistics capabilities.",
          subSections: [
            {
              heading: "The Power of Low MOQ",
              body: "For emerging brands and premium boutique lines, the ability to order in Low Minimum Order Quantities (MOQ) is transformative. It allows for agile testing of new designs without the burden of excessive inventory capital. We provide specialized support for Low MOQ orders, ensuring that scale never hinders creativity.",
            },
            {
              heading: "Next Day Shipment Benefits",
              body: "Time-to-market is the ultimate KPI. Suppliers who offer Next Day Shipment capabilities allow businesses to operate lean, reducing warehouse costs and responding instantly to retail demand surges. This 'Just-In-Time' philosophy is embedded in our logistics hub operations.",
            },
          ],
        },
        {
          heading: "Consistent Quality & Certifications",
          body: "Never take quality for granted. Demand testing reports and international certifications. A supplier's commitment to quality is often reflected in their benchmark products — take our Majestica-767 series as an example, which sets the gold standard for durability and hand-feel.",
        },
      ],
    },
    checklist: [
      {
        icon: "check_circle",
        title: "Uncompromising Quality",
        desc: "Consistency in GSM, pilling resistance, and color fastness across batches.",
      },
      {
        icon: "local_shipping",
        title: "Delivery Precision",
        desc: "Ability to meet strict deadlines with next-day shipment capabilities.",
      },
      {
        icon: "payments",
        title: "Cost Innovation",
        desc: "Optimized pricing structures without compromising on structural integrity.",
      },
    ],
    benchmark: [
      { label: "Benchmark", value: "Majestica-767" },
      { label: "Lead Time", value: "24–48 Hours" },
      { label: "Min. MOQ", value: "Flexible / Low" },
      { label: "Certification", value: "Global Standard" },
    ],
    faq: [
      {
        q: "How do I verify the quality of a new supplier?",
        a: "Verify quality by requesting lab test reports, ordering samples for GSM and shrinkage testing, and checking for international certifications like ISO or OEKO-TEX.",
      },
      {
        q: "Why is Low MOQ important for B2B?",
        a: "Low MOQ allows businesses to minimize inventory risk, test niche markets, and manage cash flow more effectively without committing to massive stock volumes.",
      },
      {
        q: "Do you offer door-to-door logistics?",
        a: "Yes, through our Logistics Hub and UAE Global Office, we manage comprehensive supply chain solutions including door-to-door delivery.",
      },
      {
        q: "What makes Amrita's 'Next Day Shipment' possible?",
        a: "Our integrated manufacturing and warehouse facility near Narol Court maintains high stock levels of our core benchmark fabrics, enabling immediate dispatch.",
      },
      {
        q: "How can I get a custom quote for bulk fabric?",
        a: "You can use our 'Request Quote' button or contact our sales team directly via the Support page.",
      },
    ],
  },
  {
    slug: "modern-fabric-tech",
    category: "Manufacturing Innovation",
    date: "November 5, 2023",
    readTime: "6 min read",
    title: "Modern Fabric Tech: The Evolution of High-Performance Weaving",
    excerpt:
      "Exploring how AI-driven loom synchronization is redefining tensile strength standards for industrial textiles in 2024.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyudxJCcqMBKB0PYGJSDFTBP9xFIZ5wokKR7vaSuSCTBB9u47HEkP4sJ-qS6lFI2abdwyeo2BJ1GtFfZ_QEM4RazBxr_dd76Hbejq1K3QL8pRIoI048SmhEMZOD2So9Bz7bsIjWPE6Ph-UL0CYcvndaZDX7liue4lrj7R6e0RvGQKm3-N4xTAW0BQuUEluy_xo1-iKEw0gGd1xFlcqbc-R02z-aPYrYlgXaohZnGogYDm0_UTm4GjGCfyCikUETzpBGs0gbMToKgPR",
    imageAlt: "Advanced carbon fiber weaving process",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "The textile industry is undergoing a technological revolution. AI-driven loom synchronization, real-time quality monitoring, and predictive maintenance are no longer futuristic concepts — they are the operational backbone of leading manufacturers like Amrita Global.",
      sections: [
        {
          heading: "AI-Driven Loom Synchronization",
          body: "Modern weaving facilities now deploy machine learning algorithms that monitor thread tension, speed, and pattern accuracy in real time. This reduces defect rates by up to 40% compared to traditional manual oversight.",
          subSections: [
            {
              heading: "Tensile Strength Standards",
              body: "Industrial textiles must meet rigorous tensile strength benchmarks. Our Majestica series undergoes automated stress testing at every production stage, ensuring consistent performance across all batches.",
            },
          ],
        },
        {
          heading: "Sustainable Manufacturing",
          body: "High-performance weaving now goes hand-in-hand with sustainability. Solar-powered looms, closed-loop water systems, and zero-waste yarn management are central to our Ahmedabad facility's operations.",
        },
      ],
    },
    checklist: [
      {
        icon: "precision_manufacturing",
        title: "AI Quality Control",
        desc: "Real-time defect detection reduces waste and rework costs significantly.",
      },
      {
        icon: "bolt",
        title: "Solar-Powered Operations",
        desc: "100% renewable energy across our primary manufacturing units.",
      },
      {
        icon: "verified",
        title: "ISO Certified Processes",
        desc: "Every production line certified to international quality standards.",
      },
    ],
    benchmark: [
      { label: "Defect Rate", value: "< 0.3%" },
      { label: "Energy Source", value: "100% Solar" },
      { label: "Output/Day", value: "50,000 meters" },
      { label: "Certification", value: "ISO 9001:2015" },
    ],
    faq: [
      {
        q: "What is AI-driven loom synchronization?",
        a: "It uses machine learning to monitor and adjust loom parameters in real time, ensuring consistent weave quality and reducing defects.",
      },
      {
        q: "How does solar power affect production costs?",
        a: "Solar energy reduces operational costs by approximately 30%, savings that are passed on to our B2B clients through competitive pricing.",
      },
      {
        q: "Can you produce custom tensile strength specifications?",
        a: "Yes, our engineering team can configure production runs to meet specific tensile, tear, and elongation requirements for industrial applications.",
      },
    ],
  },
  {
    slug: "1971-legacy",
    category: "Market Trends",
    date: "March 12, 2024",
    readTime: "4 min read",
    title: "The 1971 Legacy: Scaling Quality in a Globalized Economy",
    excerpt:
      "How Amrita Global maintains the artisanal integrity of Ahmedabad's textile history while meeting mass-scale global demands.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByU9N-TLCkNz1HquVslgzw__Rgm85WQjYY7jzgYgsT73fH6J7xpjr-w3IGcDcPq0HnA1wptMA5FQtWdDOYuZqDGWL9uiU56qlFRGPtT0dpZGbcCv_SRPm7X8FhITD1pRQlfpgi9Iv5i6axBROToFMVntlIdWsC-0q4yqsiVFYH98_P3OmufASZaNEZ03MH5e23cAr_l7iw00PrtKB4v0VK_EMyAnyg72su2QjkFCgkI4Jzb4CiOua7m5omMa1n6p_kruxri1IKgjs8",
    imageAlt: "Technician examining high quality textile rolls",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "Since 1971, Amrita Global has navigated every major shift in the global textile market — from the liberalization of Indian trade in the 1990s to the digital supply chain revolution of today. Our legacy is not just history; it is our competitive advantage.",
      sections: [
        {
          heading: "Artisanal Roots, Industrial Scale",
          body: "Ahmedabad's textile heritage spans centuries. We have built our modern operations on this foundation, combining traditional weaving knowledge with automated precision to deliver fabrics that carry both soul and specification.",
        },
        {
          heading: "Global Demand, Local Excellence",
          body: "Exporting to 40+ countries requires more than production capacity. It demands cultural intelligence, logistics mastery, and an unwavering commitment to quality that transcends borders.",
        },
      ],
    },
    checklist: [
      {
        icon: "history",
        title: "50+ Years of Expertise",
        desc: "Decades of accumulated knowledge in textile engineering and global trade.",
      },
      {
        icon: "public",
        title: "40+ Export Countries",
        desc: "Trusted by brands across Europe, North America, and the Middle East.",
      },
      {
        icon: "emoji_events",
        title: "Award-Winning Quality",
        desc: "Best Textile Supplier Award 2023 — recognized by the industry.",
      },
    ],
    faq: [
      {
        q: "How has Amrita maintained quality over 50 years?",
        a: "Through continuous investment in technology, rigorous quality control systems, and a culture of craftsmanship passed down through generations of skilled weavers.",
      },
      {
        q: "Which countries does Amrita export to?",
        a: "We export to 40+ countries including the USA, UK, Germany, UAE, Australia, and across Southeast Asia.",
      },
    ],
  },
  {
    slug: "thread-density-marine",
    category: "Technology",
    date: "January 18, 2024",
    readTime: "5 min read",
    title: "Guide: Selecting Thread Density for Marine Applications",
    excerpt:
      "A technical breakdown for engineering procurement officers on choosing the right thread density for marine-grade textile applications.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUsTKTgdGoQm9TRyzeLcq8MiRBIsf3C8qNApVnoprTAgpZAKzgNXUhuzTVOGqHR6J1lJ2URwRH_Nzadw0nXMEid5FJJR86JoHgx8mfI_ixuGC4zLPGR_V0caKynKp4Pl_Z7jP7l3dfVDCmZmMhPiXC_83F7b4RJGN9B7gNPfYpHLRVXjVL-4HhM-LfFSldhysLdMRoNcuFM0CJM88J40LAZvRaz1XYNOju7gcHKFlrfJWnZZabx7mOZugWf4AzFBHYr25rPkTExHjC",
    imageAlt: "Close up of blue fabric texture pattern",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "Marine-grade textiles face some of the harshest conditions on earth — saltwater corrosion, UV degradation, and extreme mechanical stress. Selecting the correct thread density is the single most critical specification decision for procurement engineers in this sector.",
      sections: [
        {
          heading: "Understanding Thread Density",
          body: "Thread density, measured in threads per inch (TPI), directly determines a fabric's tensile strength, water resistance, and longevity. For marine applications, a minimum of 300 TPI is recommended for structural covers, while 200 TPI suffices for interior upholstery.",
          subSections: [
            {
              heading: "Warp vs. Weft Density",
              body: "Warp threads run lengthwise and bear the primary load in most marine applications. A higher warp density relative to weft provides superior tear resistance along the stress axis — critical for sail covers and cargo netting.",
            },
          ],
        },
        {
          heading: "Material Selection for Marine Environments",
          body: "Polyester and solution-dyed acrylic are the preferred base materials. Both offer excellent UV resistance and dimensional stability when wet. Our marine-grade range is pre-treated with a hydrophobic finish that maintains breathability while repelling water ingress.",
        },
      ],
    },
    checklist: [
      { icon: "water", title: "Hydrophobic Treatment", desc: "Factory-applied DWR coating for immediate water repellency." },
      { icon: "wb_sunny", title: "UV Stabilized", desc: "Solution-dyed fibers resist fading for 5+ years in direct sunlight." },
      { icon: "anchor", title: "Salt Resistant", desc: "Tested to withstand prolonged saltwater exposure without degradation." },
    ],
    benchmark: [
      { label: "Min. TPI", value: "300 (structural)" },
      { label: "Material", value: "Solution-dyed Acrylic" },
      { label: "UV Rating", value: "5+ Years" },
      { label: "Salt Test", value: "ASTM B117" },
    ],
    faq: [
      { q: "What TPI is recommended for boat covers?", a: "A minimum of 300 TPI in the warp direction is recommended for structural boat covers. Interior applications can use 200 TPI." },
      { q: "Does Amrita supply marine-certified fabrics?", a: "Yes, our marine range meets ISO 12215 and ASTM D751 standards for tensile and tear strength." },
      { q: "Can you supply custom widths for large vessel applications?", a: "We can produce fabric widths up to 3.2 meters for large-format marine applications. Contact our technical sales team for specifications." },
    ],
  },
  {
    slug: "circular-textile-economies",
    category: "Sustainability",
    date: "February 8, 2024",
    readTime: "5 min read",
    title: "Circular Textile Economies: The Future of Global Warehousing",
    excerpt:
      "Optimizing the logistics of fabric recycling across UAE and India corridors for a sustainable supply chain future.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqA-HhonyUiQvSCzm7F2wRGUWbYZTUHY6eyCCDrwi2qvQJVjzPUNpz_c-PfuABkisWlg8dJ4yYI_481WO01sDSckK1ukJfFsX-F_IF7qv7ccwrwUvMt9K-xJqKLM1LEFMCjYOaIpIHs-DCi-5s_20g0wuVsLZkbIFv6XtR_DJA74JPaw_KdxDSImqi7J3aU_z0T8zURe6TSqDH0GjHXuv5gi1HCYXqPtU29bx7mJMetIxVuElFCbDDgSRvPqgZ-r0DU6MAQYWcnh3R",
    imageAlt: "Industrial clothing production line",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "The linear 'take-make-dispose' model is no longer viable for global textile supply chains. Amrita Global is pioneering circular economy principles across our UAE and India logistics corridors, turning end-of-life fabric into tomorrow's raw material.",
      sections: [
        {
          heading: "The UAE–India Recycling Corridor",
          body: "Our UAE office acts as a collection hub for post-consumer textile waste from Gulf markets. This material is consolidated, sorted, and shipped to our Ahmedabad facility where it is processed into recycled yarn — closing the loop on fabric waste.",
          subSections: [
            {
              heading: "Reverse Logistics Infrastructure",
              body: "We have established dedicated reverse logistics lanes with our freight partners, enabling cost-effective collection of textile waste at scale. This infrastructure reduces the carbon footprint of recycled material by 60% compared to virgin fiber production.",
            },
          ],
        },
        {
          heading: "Warehouse Optimization for Circular Models",
          body: "Circular supply chains require warehouses designed for bidirectional flow. Our Narol Court logistics hub has been retrofitted with dedicated sorting, baling, and quality-grading stations for incoming recycled material.",
        },
      ],
    },
    checklist: [
      { icon: "recycling", title: "Closed-Loop Processing", desc: "End-of-life fabric converted to recycled yarn at our Ahmedabad facility." },
      { icon: "local_shipping", title: "Reverse Logistics Network", desc: "Dedicated collection lanes across UAE and India corridors." },
      { icon: "co2", title: "60% Lower Carbon", desc: "Recycled fiber production vs. virgin fiber baseline." },
    ],
    benchmark: [
      { label: "Recycled Content", value: "Up to 80%" },
      { label: "Carbon Saving", value: "60% vs. virgin" },
      { label: "Collection Hubs", value: "UAE + India" },
      { label: "Certification", value: "GRS Certified" },
    ],
    faq: [
      { q: "What is GRS certification?", a: "Global Recycled Standard (GRS) certifies that recycled content claims are accurate and that responsible social, environmental, and chemical practices are followed throughout the supply chain." },
      { q: "Can I source GRS-certified fabric from Amrita?", a: "Yes, our recycled yarn range is GRS certified. Minimum order quantities apply — contact our sales team for details." },
      { q: "How does the reverse logistics collection work?", a: "We partner with collection agents in the UAE who consolidate post-consumer textile waste. Amrita arranges freight to Ahmedabad on a scheduled basis." },
    ],
  },
  {
    slug: "precision-dyeing-luxury",
    category: "Technology",
    date: "February 22, 2024",
    readTime: "4 min read",
    title: "Whitepaper: Precision Dyeing for Luxury Brands",
    excerpt:
      "Achieving Pantone consistency across multi-continental supply chains — a technical guide for luxury apparel procurement.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEqab9j9sryUuFghoNrJrNL7rXL-R3wLp6yJYTH2CqXcrjHqdJ5PbRp1BYRsuB47ALAbEnlOFTE_jclDZS_uWnYA5ppK67hjQCtshjWWH1vBQNsuU0X86lpBfhuWkb0r1k2awhy3EwBX0BXo_1S397K61Z9UM-dvUlVjJtB_IxVXTctNNaHX77p2P2iGCeYw17TdaQJ1VmXXmU4pjTXijOj834fJLo3HaiyGx8p7SBqQCj7kjd9eW-YdPZ1e-4zQGXbVU9L7w0uS",
    imageAlt: "Minimalist white textile display",
    author: {
      name: "Rajesh Varma",
      role: "Production Director",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4fCzNbB1R1eQjU0T8HHnibu7kfVTKCrOGOtVvNzu3_WmzSpSBenAg5tgh8vTNxSHvpnU43rgESQbthje4lUZ08hIE7_dgMINhSy7IS448lNGZvcgDlim3cIRsGxOjYmTIk5MItajQ9yEZ96Zvh_PsPReXtMvmmIi7EuTWdo9_p6ETqDX9uaGOquATKoPbdlpHqOcxS5HEuq9YG9tWJ1jdn9DZk_35x_XmUtjcS3TitqT4lKRl50WY3WculiQnvihGUBntW1RW3UI",
    },
    content: {
      intro:
        "For luxury brands, color is not just aesthetic — it is brand identity. A Delta E variance of more than 1.0 between production batches is commercially unacceptable. Amrita Global's precision dyeing process consistently achieves Delta E < 0.5 across all batch sizes.",
      sections: [
        {
          heading: "The Science of Color Consistency",
          body: "Achieving Pantone accuracy across multi-continental supply chains requires spectrophotometric measurement at every stage — from dye bath preparation to finished fabric inspection. Our lab is equipped with X-Rite instruments calibrated to D65 illuminant standards.",
          subSections: [
            {
              heading: "Metamerism Control",
              body: "Metamerism — where colors match under one light source but differ under another — is a common failure point in luxury textile supply chains. Our dye formulations are tested under D65, A, and TL84 illuminants to ensure consistency across all retail environments.",
            },
          ],
        },
        {
          heading: "Multi-Continental Batch Matching",
          body: "When a luxury brand sources from multiple facilities across continents, batch-to-batch color matching becomes critical. We maintain a digital color archive of every production run, enabling precise re-orders months or years later.",
        },
      ],
    },
    checklist: [
      { icon: "colorize", title: "Delta E < 0.5", desc: "Industry-leading color accuracy across all production batches." },
      { icon: "science", title: "Spectrophotometric QC", desc: "X-Rite instruments at every stage of the dyeing process." },
      { icon: "archive", title: "Digital Color Archive", desc: "Every production run archived for precise future re-orders." },
    ],
    benchmark: [
      { label: "Delta E", value: "< 0.5" },
      { label: "Illuminants", value: "D65, A, TL84" },
      { label: "Instrument", value: "X-Rite Ci7800" },
      { label: "Archive", value: "10+ Years" },
    ],
    faq: [
      { q: "What is Delta E and why does it matter?", a: "Delta E measures the perceptible difference between two colors. A value below 1.0 is generally considered acceptable; below 0.5 is imperceptible to the human eye — the standard for luxury applications." },
      { q: "Can you match a Pantone color from a physical swatch?", a: "Yes, we can spectrophotometrically measure any physical swatch and formulate a dye recipe to match it within our Delta E < 0.5 tolerance." },
      { q: "How do you ensure consistency across large orders?", a: "Each dye batch is measured at the start, middle, and end of production. Any variance triggers an automatic re-correction before the fabric proceeds to finishing." },
    ],
  },
];
