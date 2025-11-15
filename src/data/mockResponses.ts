// SSE 스트리밍을 위한 더미 응답 데이터
export const mockResponses = [
  {
    id: 1,
    trigger: "안녕",
    response: "안녕하세요! AI Hub에 오신 것을 환영합니다. 무엇을 도와드릴까요?",
  },
  {
    id: 2,
    trigger: "날씨",
    response: "죄송하지만 저는 실시간 날씨 정보에 접근할 수 없습니다. 하지만 날씨 관련 일반적인 정보나 조언은 드릴 수 있어요!",
  },
  {
    id: 3,
    trigger: "코딩",
    response: "코딩에 대해 궁금하신가요? 저는 다양한 프로그래밍 언어와 개발 관련 질문에 답변할 수 있습니다. JavaScript, Python, TypeScript, React 등 어떤 것이 궁금하신가요?",
  },
  {
    id: 4,
    trigger: "React",
    response: "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처를 사용하며, 가상 DOM을 통해 효율적인 렌더링을 제공합니다. React에 대해 구체적으로 어떤 것이 궁금하신가요?",
  },
  {
    id: 5,
    trigger: "Next.js",
    response: "Next.js는 React 기반의 풀스택 프레임워크입니다. 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), API 라우트 등의 기능을 제공하여 현대적인 웹 애플리케이션을 쉽게 구축할 수 있게 해줍니다. 현재 이 프로젝트도 Next.js로 만들어졌어요!",
  },
  {
    id: 6,
    trigger: "TypeScript",
    response: "TypeScript는 JavaScript에 정적 타입을 추가한 프로그래밍 언어입니다. 타입 안정성을 제공하여 개발 중 오류를 미리 발견할 수 있고, 더 나은 코드 자동완성과 리팩토링을 지원합니다. 대규모 프로젝트에 특히 유용합니다.",
  },
  {
    id: 7,
    trigger: "AI",
    response: "인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 모방하여 학습, 추론, 문제 해결 등을 수행하는 기술입니다. 머신러닝, 딥러닝, 자연어 처리 등 다양한 분야로 구성되어 있으며, 현재 많은 산업에서 혁신을 일으키고 있습니다.",
  },
  {
    id: 8,
    trigger: "default",
    response: "흥미로운 질문이네요! 제가 가진 지식을 바탕으로 답변드리자면, 이 주제는 매우 다양한 관점에서 접근할 수 있습니다. 더 구체적으로 어떤 부분이 궁금하신가요? 자세히 설명해주시면 더 도움이 될 수 있을 것 같습니다.",
  },
];

// 메시지 내용에 따라 적절한 응답을 찾는 함수
export function findMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // 키워드 매칭
  const matchedResponse = mockResponses.find((item) =>
    item.trigger !== "default" && lowerMessage.includes(item.trigger.toLowerCase())
  );

  // 매칭되는 응답이 있으면 반환, 없으면 기본 응답 반환
  return matchedResponse?.response || mockResponses.find(r => r.trigger === "default")!.response;
}
