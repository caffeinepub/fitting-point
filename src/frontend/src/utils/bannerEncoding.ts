export interface BannerTextData {
  title: string;
  subtitle?: string;
}

export function encodeBannerText(data: BannerTextData): string {
  try {
    return JSON.stringify(data);
  } catch {
    return data.title;
  }
}

export function decodeBannerText(text: string): BannerTextData {
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed.title) {
      return {
        title: parsed.title,
        subtitle: parsed.subtitle,
      };
    }
    return { title: text };
  } catch {
    return { title: text };
  }
}
