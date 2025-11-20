import {
  GetMessagesParams,
  MessagesPageResponse,
  ApiMessage,
} from "@/types/message";
import { ApiErrorDetail } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 특정 채팅방의 메시지 목록을 페이지네이션하여 조회
 * 쿠키 기반 인증 사용
 */
export async function getMessages(
  params: GetMessagesParams
): Promise<MessagesPageResponse> {
  const { roomId, page = 0, size = 50, sort = "createdAt,asc" } = params;

  // 유효성 검사
  if (page < 0) {
    throw new Error("페이지 번호는 0 이상이어야 합니다.");
  }

  if (size < 1 || size > 200) {
    throw new Error("페이지 크기는 1~200 사이여야 합니다.");
  }

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/messages/page/${roomId}?${queryParams}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: MessagesPageResponse | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답
    if (response.ok && data.success) {
      return data as MessagesPageResponse;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "ROOM_NOT_FOUND":
        throw new Error("채팅방이 존재하지 않습니다.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      default:
        throw new Error(
          errorDetail.message || "메시지 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("메시지 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 다음 페이지 메시지 조회
 */
export async function getNextPage(
  currentResponse: MessagesPageResponse,
  roomId: string,
  size?: number,
  sort?: string
): Promise<MessagesPageResponse | null> {
  const currentPage = currentResponse.detail.number;
  const totalPages = currentResponse.detail.totalPages;

  // 다음 페이지가 없으면 null 반환
  if (currentPage + 1 >= totalPages) {
    return null;
  }

  return getMessages({
    roomId,
    page: currentPage + 1,
    size,
    sort,
  });
}

/**
 * 이전 페이지 메시지 조회
 */
export async function getPreviousPage(
  currentResponse: MessagesPageResponse,
  roomId: string,
  size?: number,
  sort?: string
): Promise<MessagesPageResponse | null> {
  const currentPage = currentResponse.detail.number;

  // 이전 페이지가 없으면 null 반환
  if (currentPage <= 0) {
    return null;
  }

  return getMessages({
    roomId,
    page: currentPage - 1,
    size,
    sort,
  });
}

/**
 * 메시지 목록을 UI용 Message 타입으로 변환
 */
export function convertToUIMessages(apiMessages: ApiMessage[]) {
  return apiMessages.map((msg) => ({
    id: msg.messageId,
    content: msg.content,
    role: msg.role,
    timestamp: new Date(msg.createdAt),
    // 추가 정보는 필요시 확장 가능
    metadata: {
      tokenCount: msg.tokenCount,
      coinCount: msg.coinCount,
      modelId: msg.modelId,
    },
  }));
}
