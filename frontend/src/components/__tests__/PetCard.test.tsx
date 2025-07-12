import React from 'react';
import { render, screen } from "@testing-library/react";
import PetCard from "../PetCard";

describe("PetCard Component", () => {
  test("Basic pet card renders", () => {
    render(<PetCard />);
    
    expect(screen.getByText("My MoodiPet")).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Emotion:') && node.textContent.includes('Happy') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Evolution Stage:') && node.textContent.includes('2') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Personality:') && node.textContent.includes('Cat') : false)).toBeInTheDocument();
  });

  test("Pet information changes according to emotion", () => {
    const { rerender } = render(<PetCard emotion="Sad" />);
    
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Emotion:') && node.textContent.includes('Sad') : false)).toBeInTheDocument();
    
    rerender(<PetCard emotion="Angry" />);
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Emotion:') && node.textContent.includes('Angry') : false)).toBeInTheDocument();
  });

  test("Pet success message displays", () => {
    render(<PetCard />);
    
    expect(screen.getByText(/Congratulations! Pet has successfully hatched/)).toBeInTheDocument();
  });

  test("Custom pet information displays", () => {
    render(
      <PetCard 
        emotion="Calm"
        evolution={3}
        personality="Dog"
        createdAt="2024-06-15"
      />
    );
    
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Emotion:') && node.textContent.includes('Calm') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Evolution Stage:') && node.textContent.includes('3') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Personality:') && node.textContent.includes('Dog') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Created:') && node.textContent.includes('2024-06-15') : false)).toBeInTheDocument();
  });
}); 