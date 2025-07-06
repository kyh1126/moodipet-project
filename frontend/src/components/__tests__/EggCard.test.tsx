import { render, screen } from '@testing-library/react';
import EggCard from '../EggCard';

describe('EggCard 컴포넌트', () => {
  test('기본 알 카드가 렌더링됩니다', () => {
    render(<EggCard />);
    
    expect(screen.getByText('나의 MoodiPet 알')).toBeInTheDocument();
    expect(screen.getByText('현재 감정: 기쁨')).toBeInTheDocument();
    expect(screen.getByText('진화 단계: 1')).toBeInTheDocument();
  });

  test('감정에 따라 알 색상이 변경됩니다', () => {
    const { rerender } = render(<EggCard emotion="슬픔" />);
    
    expect(screen.getByText('현재 감정: 슬픔')).toBeInTheDocument();
    
    rerender(<EggCard emotion="화남" />);
    expect(screen.getByText('현재 감정: 화남')).toBeInTheDocument();
  });

  test('부화 중일 때 부화 메시지가 표시됩니다', () => {
    render(<EggCard isHatching={true} />);
    
    expect(screen.getByText('🐣 부화 중...')).toBeInTheDocument();
  });

  test('알 상태 안내 메시지가 표시됩니다', () => {
    render(<EggCard />);
    
    expect(screen.getByText(/감정을 기록하면 알이 성장하고/)).toBeInTheDocument();
  });
}); 