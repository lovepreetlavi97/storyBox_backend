export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const MESSAGES = {
  UNAUTHORIZED: 'Unauthorized: Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid username or password',
  NO_FILE_UPLOADED: 'No file uploaded',
  INVALID_AUDIO_FORMAT: 'Only audio/video files (mp3, m4a, wav, ogg, mp4) are supported',
  CATEGORY_NOT_FOUND: 'Category not found',
  AUDIO_NOT_FOUND: 'Audio not found',
  BANNER_NOT_FOUND: 'Banner not found',
  CATEGORY_DELETED: 'Category deleted successfully',
  AUDIO_DELETED: 'Audio deleted successfully',
  BANNER_DELETED: 'Banner deleted successfully'
};
