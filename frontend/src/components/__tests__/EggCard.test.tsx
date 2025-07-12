import React from 'react';
import { render, screen } from '@testing-library/react';
import EggCard from '../EggCard';

describe('EggCard Component', () => {
  test('Basic egg card renders', () => {
    render(<EggCard />);
    
    expect(screen.getByText('My MoodiPet Egg')).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Current Emotion:') && node.textContent.includes('Happy') : false)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Evolution Stage:') && node.textContent.includes('1') : false)).toBeInTheDocument();
  });

  test('Egg color changes according to emotion', () => {
    const { rerender } = render(<EggCard emotion="Sad" />);
    
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Current Emotion:') && node.textContent.includes('Sad') : false)).toBeInTheDocument();
    
    rerender(<EggCard emotion="Angry" />);
    expect(screen.getByText((content, node) => node && node.textContent ? content.includes('Current Emotion:') && node.textContent.includes('Angry') : false)).toBeInTheDocument();
  });

  test('Hatching message displays when hatching', () => {
    render(<EggCard isHatching={true} />);
    
    expect(screen.getByText('🐣 Hatching...')).toBeInTheDocument();
  });

  test('Egg status guide message displays', () => {
    render(<EggCard />);
    
    expect(screen.getByText(/Record emotions to grow the egg/)).toBeInTheDocument();
  });
}); 