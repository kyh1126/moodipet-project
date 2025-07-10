import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    
    // 감정 선택 처리
    const emotion = untrustedData?.inputText || "행복";
    
    // 감정별 멘트 데이터베이스
    const emotionMentDB: Record<string, string[]> = {
      "행복": [
        "오늘 내 행복도는 레이저 포인터 든 고양이 수준이야.",
        "행복이 넘친다면, 내 안의 피에로가 춤추기 시작해.",
        "세로토닌 과다 복용 중. 조치 바람.",
        "행복이 넘쳐서 내 안의 광대가 춤추기 시작했어.",
        "오늘은 행복이 넘쳐서 내 안의 광대가 춤을 춰."
      ],
      "우울": [
        "우는 거 아님. 그냥 영혼이 새는 중임.",
        "슬픈 거 아님. 감정 로딩 중이야.",
        "슬프면 나랑 같이 비 오는 멜로디 속으로 풍덩 빠져보자.",
        "우는 게 아니라 영혼이 조금씩 새고 있어.",
        "슬픈 건 아니고 그냥 감정이 버퍼링 중이야."
      ],
      "분노": [
        "말 걸지 마. 머릿속에서 싸우느라 바빠.",
        "귀엽긴 한데 화남. 접근 주의.",
        "화가 치밀면 내 안의 베토벤이 교향곡을 연주해.",
        "말 걸지 마. 머릿속에서 모든 사람과 싸우느라 바빠.",
        "화나긴 했는데 귀여워. 조심해서 접근해."
      ],
      "불안": [
        "불안이 밀려온다면, 스릴을 끝까지 즐겨보자.",
        "불안하면 심장소리를 폰 벨소리로 써볼까?",
        "내 불안과 간식 보관함이 누가 더 숨겼나 경쟁 중이야.",
        "불안이 밀려오면 차라리 스릴을 즐겨보자.",
        "불안할 때는 심장소리를 벨소리로 설정해볼까?"
      ],
      "설렘": [
        "누가 새 모험이라고 했어? 나 벌써 짐 다 쌌어.",
        "나비요? 배 속에 동물원 열렸음.",
        "몸 안에서 글리터가 펑! 하고 터진 기분.",
        "새로운 모험이라고? 나 벌써 짐을 다 쌌어.",
        "나비가 아니라 배 속에 동물원이 열렸어."
      ],
      "지루함": [
        "지루한 거 참느니, 눈썹에 눈 그리자.",
        "심심해? 머릿속 고양이랑 숨바꼭질 어때?",
        "지루함이 폰 배터리보다 높음.",
        "지루한 거 참느니 눈썹에 눈을 그려보자.",
        "심심하면 머릿속 고양이랑 숨바꼭질 해볼까?"
      ],
      "허무": [
        "조금씩 인간 구실 하는 중이에요.",
        "오늘 기분? 존재론적 부리또.",
        "감정적으로? 커피 얼룩 묻은 빈 종이 같아.",
        "천천히 인간 구실을 하는 중이에요.",
        "현재 기분은 존재론적 부리또 상태."
      ]
    };

    // 랜덤 멘트 선택
    const mentList = emotionMentDB[emotion] || emotionMentDB["행복"];
    const randomMent = mentList[Math.floor(Math.random() * mentList.length)];

    // Frame 응답 생성
    const frameResponse = {
      frames: [
        {
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?emotion=${encodeURIComponent(emotion)}&ment=${encodeURIComponent(randomMent)}`,
          buttons: [
            {
              label: "감정 기록하기",
              action: "post",
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/record`
            },
            {
              label: "다른 감정 선택",
              action: "post",
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`
            }
          ],
          input: {
            text: "오늘의 감정을 입력하세요 (행복/우울/분노/불안/설렘/지루함/허무)"
          }
        }
      ]
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error('Frame API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
      // 초기 Frame 표시
    const frameResponse = {
      frames: [
        {
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=MoodiPet 슬라임 감정 기록`,
          buttons: [
            {
              label: "감정 기록 시작",
              action: "post",
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`
            }
          ],
          input: {
            text: "오늘의 감정을 입력하세요 (행복/우울/분노/불안/설렘/지루함/허무)"
          }
        }
      ]
    };

  return NextResponse.json(frameResponse);
} 