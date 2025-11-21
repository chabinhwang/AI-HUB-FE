import { useState, useCallback, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user";
import { UserInfo } from "@/types/user";

interface UseCurrentUserOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 사용자 정보 조회
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCurrentUser();
      setUser(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setUser(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchUser();
    }
  }, [autoFetch, fetchUser]);

  return {
    user,
    isLoading,
    error,
    fetchUser,
    refresh,
  };
}
