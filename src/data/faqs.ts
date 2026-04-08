export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  icon: string;
  faqs: FAQ[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "sourcing",
    label: "Sourcing",
    icon: "category",
    faqs: [
      {
        question: "What types of fibers do you specialize in?",
        answer:
          "We specialize in high-tenacity polyester, sustainable recycled cotton blends, and premium long-staple linen. Our sourcing network extends across globally certified organic farms and industrial synthetics providers.",
      },
      {
        question: "Do you offer GOTS certified organic fabrics?",
        answer:
          "Yes, Amrita Global Enterprises is fully compliant with Global Organic Textile Standards (GOTS). We can provide full traceability documentation for every batch of organic fabric sourced through our premium channels.",
      },
      {
        question: "Can I request fabric samples before placing a bulk order?",
        answer:
          "Absolutely. We offer sample swatches for all standard fabric lines. Sample requests are processed within 3–5 business days and shipped globally. Contact our sales team to initiate a sample request.",
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: "precision_manufacturing",
    faqs: [
      {
        question: "What is your typical production lead time?",
        answer:
          "Standard production typically ranges from 4 to 6 weeks depending on fabric complexity and volume. Custom technical weaves or specific dye requirements may extend this by 14 business days.",
      },
      {
        question: "Can you handle custom weaving patterns?",
        answer:
          "Absolutely. Our R&D department works with state-of-the-art Jacquard looms and air-jet technology to execute intricate custom patterns specified by our clients' design teams.",
      },
      {
        question: "What quality control processes do you follow?",
        answer:
          "Every production batch undergoes multi-stage QC including yarn inspection, loom monitoring, greige fabric testing, and finished goods audit. We follow ISO 9001:2015 standards across all facilities.",
      },
    ],
  },
  {
    id: "logistics",
    label: "Logistics",
    icon: "local_shipping",
    faqs: [
      {
        question: "How do you handle international shipping?",
        answer:
          "We offer FOB, CIF, and DDP shipping terms. Our logistics partners ensure seamless movement through major ports in Asia, Europe, and the Americas, handling all export documentation and compliance.",
      },
      {
        question: "Which countries do you currently export to?",
        answer:
          "We actively export to over 40 countries including the USA, UK, Germany, UAE, Bangladesh, and Australia. Our Ahmedabad hub is strategically positioned for fast turnaround to both Eastern and Western markets.",
      },
      {
        question: "Do you provide real-time shipment tracking?",
        answer:
          "Yes. All B2B clients receive access to our client portal where live shipment tracking, documentation downloads, and delivery ETAs are available 24/7.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing/MOQ",
    icon: "payments",
    faqs: [
      {
        question: "What is your Minimum Order Quantity (MOQ)?",
        answer:
          "Our standard MOQ is 500 meters per colorway for woven fabrics. For specialty technical textiles or trial runs, please contact our sales team to discuss tiered pricing options.",
      },
      {
        question: "Do you offer volume-based pricing discounts?",
        answer:
          "Yes. Orders above 5,000 meters qualify for tiered pricing. Long-term supply agreements with annual commitments receive preferential rates and priority production slots.",
      },
      {
        question: "What payment terms do you accept?",
        answer:
          "We accept T/T (Telegraphic Transfer), LC at sight, and for established clients, open account terms with net-30 or net-60 arrangements. All transactions are in USD, EUR, or INR.",
      },
    ],
  },
];
