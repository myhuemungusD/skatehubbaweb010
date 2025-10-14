import { useEffect } from 'react';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

interface WebApplicationData {
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    price: string;
    priceCurrency: string;
  };
}

export function OrganizationStructuredData({ data }: { data: OrganizationData }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'org-structured-data';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      sameAs: data.sameAs,
    });

    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('org-structured-data');
      if (existing) document.head.removeChild(existing);
    };
  }, [data]);

  return null;
}

export function WebAppStructuredData({ data }: { data: WebApplicationData }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'webapp-structured-data';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: data.name,
      url: data.url,
      description: data.description,
      applicationCategory: data.applicationCategory,
      operatingSystem: data.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
      },
    });

    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('webapp-structured-data');
      if (existing) document.head.removeChild(existing);
    };
  }, [data]);

  return null;
}
