export const successResponse = (data: any) => ({
  success: true,
  error: null,
  data
});

export const errorResponse = (message: string) => ({
  success: false,
  error: message,
  data: null
});