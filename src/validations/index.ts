export function validateCategoryInput(data: any): string | null {
  if (!data || !data.name || !data.slug) {
    return 'Name and slug are required';
  }
  return null;
}

export function validateAudioInput(data: any): string | null {
  if (
    !data ||
    !data.title ||
    !data.description ||
    !data.slug ||
    !data.thumbnailUrl ||
    !data.audioUrl ||
    !data.category
  ) {
    return 'Missing required fields';
  }
  if (!data.language) {
    data.language = 'English';
  }
  return null;
}

export function validateBannerInput(data: any): string | null {
  if (!data || !data.imageUrl || !data.title || !data.linkType || !data.linkValue) {
    return 'Missing required fields';
  }
  return null;
}
