import { DashboardStats } from "@/types/dashboard";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 사용자 통계 요약 조회
 * 쿠키 기반 인증 필수
 */
export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<DashboardStats> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<DashboardStats>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "AUTHENTICATION_FAILED":
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "통계 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("통계 조회 중 오류가 발생했습니다.");
  }
}
