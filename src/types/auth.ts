// 인증 API 타입 정의

import type { ApiResponse, ApiErrorDetail } from "./upload";

export type { ApiResponse, ApiErrorDetail };

// 로그아웃 요청 타입
export interface LogoutRequest {
  refreshToken: string;
}
