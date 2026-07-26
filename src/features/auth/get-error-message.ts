type ApiErrorShape = {
  status?: number | string;
  data?: {
    message?: string;
  };
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const apiError = error as ApiErrorShape;
  if (typeof apiError.data?.message === "string") {
    return apiError.data.message;
  }

  return fallback;
}
