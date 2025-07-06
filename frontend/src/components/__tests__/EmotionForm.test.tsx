import { render, screen } from "@testing-library/react";
import EmotionForm from "../EmotionForm";

describe("EmotionForm", () => {
  it("감정 기록 폼이 정상적으로 렌더링된다", () => {
    render(<EmotionForm />);
    expect(screen.getByText("오늘의 감정을 선택하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "감정 기록하기" })).toBeInTheDocument();
  });
}); 