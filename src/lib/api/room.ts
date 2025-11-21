import {
  ChatRoomsPageResponse,
  GetChatRoomsParams,
} from "@/types/room";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 채팅방 목록을 페이지네이션하여 조회
 * 쿠키 기반 인증 사용
 */
export async function getChatRooms(
  params: GetChatRoomsParams = {}
): Promise<ApiResponse<ChatRoomsPageResponse>> {
  const { page = 0, size = 20, sort = "createdAt,desc" } = params;

  // 유효성 검사
  if (page < 0) {
    throw new Error("페이지 번호는 0 이상이어야 합니다.");
  }

  if (size < 1 || size > 100) {
    throw new Error("페이지 크기는 1~100 사이여야 합니다.");
  }

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat-rooms?${queryParams}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data:
      | ApiResponse<ChatRoomsPageResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답
    if (response.ok && data.success) {
      return data as ApiResponse<ChatRoomsPageResponse>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(
          errorDetail.message || "지원하지 않는 정렬 필드입니다."
        );
      default:
        throw new Error(
          errorDetail.message || "채팅방 목록 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("채팅방 목록 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 다음 페이지 채팅방 목록 조회
 */
export async function getNextChatRoomsPage(
  currentResponse: ApiResponse<ChatRoomsPageResponse>,
  size?: number,
  sort?: string
): Promise<ApiResponse<ChatRoomsPageResponse> | null> {
  const currentPage = currentResponse.detail.number;
  const totalPages = currentResponse.detail.totalPages;

  // 다음 페이지가 없으면 null 반환
  if (currentPage + 1 >= totalPages) {
    return null;
  }

  return getChatRooms({
    page: currentPage + 1,
    size,
    sort,
  });
}
