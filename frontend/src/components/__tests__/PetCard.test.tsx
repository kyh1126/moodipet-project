import React from 'react';
import { render, screen } from "@testing-library/react";
import PetCard from "../PetCard";

describe("PetCard 컴포넌트", () => {
  test("기본 펫 카드가 렌더링됩니다", () => {
    render(<PetCard />);
    
    expect(screen.getByText("나의 MoodiPet")).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('감정:') && node.textContent.includes('기쁨') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('진화 단계:') && node.textContent.includes('2') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('성격:') && node.textContent.includes('고양이') : false)).toBeInTheDocument();
  });

  test("감정에 따라 펫 정보가 변경됩니다", () => {
    const { rerender } = render(<PetCard emotion="슬픔" />);
    
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('감정:') && node.textContent.includes('슬픔') : false)).toBeInTheDocument();
    
    rerender(<PetCard emotion="화남" />);
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('감정:') && node.textContent.includes('화남') : false)).toBeInTheDocument();
  });

  test("펫 성공 메시지가 표시됩니다", () => {
    render(<PetCard />);
    
    expect(screen.getByText(/축하합니다! 펫이 성공적으로 부화되었습니다/)).toBeInTheDocument();
  });

  test("커스텀 펫 정보가 표시됩니다", () => {
    render(
      <PetCard 
        emotion="평온"
        evolution={3}
        personality="강아지"
        createdAt="2024-06-15"
      />
    );
    
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('감정:') && node.textContent.includes('평온') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('진화 단계:') && node.textContent.includes('3') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('성격:') && node.textContent.includes('강아지') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('생성일:') && node.textContent.includes('2024-06-15') : false)).toBeInTheDocument();
  });
}); 