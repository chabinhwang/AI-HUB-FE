// 대시보드 통계 API 타입 정의

// 가장 많이 사용한 모델 정보
export interface MostUsedModel {
  modelId: number; // 모델 ID
  modelName: string; // 모델 이름 (예: gpt-4)
  displayName: string; // 표시명 (예: GPT-4)
  usagePercentage: number; // 사용 비율 (%)
}

// 사용자 통계 요약
export interface DashboardStats {
  totalCoinPurchased: number; // 총 구매 코인
  totalCoinUsed: number; // 총 사용 코인
  currentBalance: number; // 현재 잔액
  totalMessages: number; // 총 메시지 수
  totalChatRooms: number; // 총 채팅방 수
  mostUsedModel: MostUsedModel | null; // 가장 많이 사용한 모델 (없을 수 있음)
  last30DaysUsage: number; // 최근 30일 사용량
  memberSince: string; // 가입 일시 (ISO 8601)
}
