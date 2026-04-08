export interface RedirectRule {
  id: string;
  fromPath: string;
  toUrl: string;
  statusCode: string;
  matchType: string;
  isActive: boolean;
  preserveQuery: boolean;
  priority: number;
}

export async function fetchRedirects(): Promise<RedirectRule[]> {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL ?? 'https://espobackend.vercel.app'}/api/redirect`
    );
    if (!res.ok) {
      console.warn(`[redirects] API returned ${res.status}, skipping redirects`);
      return [];
    }
    const json = await res.json();
    return (json.data ?? []) as RedirectRule[];
  } catch (err) {
    console.warn('[redirects] Failed to fetch redirects:', err);
    return [];
  }
}

/**
 * Converts API redirect rules into Astro's redirects config format.
 * Only includes active, exact-match rules.
 */
export async function buildAstroRedirects(): Promise<Record<string, { destination: string; status: 301 | 302 | 307 | 308 }>> {
  const rules = await fetchRedirects();

  const active = rules
    .filter((r) => r.isActive && r.matchType === 'exact')
    .sort((a, b) => b.priority - a.priority); // higher priority first

  const redirects: Record<string, { destination: string; status: 301 | 302 | 307 | 308 }> = {};

  for (const rule of active) {
    const status = ([301, 302, 307, 308].includes(Number(rule.statusCode))
      ? Number(rule.statusCode)
      : 301) as 301 | 302 | 307 | 308;

    redirects[rule.fromPath] = {
      destination: rule.toUrl,
      status,
    };
  }

  return redirects;
}
