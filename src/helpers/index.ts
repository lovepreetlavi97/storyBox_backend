export function formatSuccessResponse<T>(data: T, extra?: Record<string, any>) {
  return {
    success: true,
    data,
    ...extra
  };
}

export function formatErrorResponse(error: string) {
  return {
    success: false,
    error
  };
}
