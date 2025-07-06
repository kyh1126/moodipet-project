import { render, screen } from "@testing-library/react";
import MintButton from "../MintButton";

describe("MintButton", () => {
  it("민팅 버튼이 정상적으로 렌더링된다", () => {
    render(<MintButton />);
    expect(screen.getByRole("button", { name: /민팅하기/ })).toBeInTheDocument();
  });
}); 