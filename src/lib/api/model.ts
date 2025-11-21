import { AIModel } from "@/types/model";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 활성화된 AI 모델 목록 조회
 * Public API (인증 불필요)
 */
export async function getModels(): Promise<ApiResponse<AIModel[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/models`, {
      method: "GET",
      credentials: "include", // 쿠키 포함 (선택적)
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<AIModel[]> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<AIModel[]>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "SYSTEM_ILLEGAL_STATE":
        throw new Error(
          errorDetail.message || "모델 정보를 가져올 수 없습니다."
        );
      default:
        throw new Error(
          errorDetail.message || "모델 목록 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("모델 목록 조회 중 오류가 발생했습니다.");
  }
}
