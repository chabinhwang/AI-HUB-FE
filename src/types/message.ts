import { ApiResponse } from "./upload";

// API 응답 메시지 타입
export interface ApiMessage {
  messageId: string; // UUID v7
  role: "user" | "assistant";
  content: string;
  tokenCount: number;
  coinCount: number;
  modelId: number;
  createdAt: string; // ISO 8601
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지 번호
}

// 메시지 목록 조회 응답
export type MessagesPageResponse = ApiResponse<PageResponse<ApiMessage>>;

// 메시지 목록 조회 파라미터
export interface GetMessagesParams {
  roomId: string;
  page?: number; // 기본값 0
  size?: number; // 기본값 50, 1~200
  sort?: string; // 기본값 "createdAt,asc"
}

// 정렬 방향
export type SortDirection = "asc" | "desc";

// 정렬 필드
export type MessageSortField = "createdAt" | "messageId";

// 정렬 옵션 헬퍼
export function createSortParam(
  field: MessageSortField,
  direction: SortDirection
): string {
  return `${field},${direction}`;
}
