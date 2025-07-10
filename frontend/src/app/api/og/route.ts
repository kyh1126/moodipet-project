import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emotion = searchParams.get('emotion') || '행복';
    const ment = searchParams.get('ment') || '';
    const status = searchParams.get('status') || '';
    const title = searchParams.get('title') || 'MoodiPet 슬라임';

    // 감정별 색상
    const emotionColors: Record<string, string> = {
      "행복": "#FFD700",
      "우울": "#87CEEB", 
      "분노": "#FF6B6B",
      "불안": "#FFB347",
      "설렘": "#98FB98",
      "지루함": "#DDA0DD",
      "허무": "#D3D3D3"
    };

    const bgColor = emotionColors[emotion] || "#B4E7FF";

    // SVG 생성
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.4" />
          </linearGradient>
        </defs>
        
        <!-- 배경 -->
        <rect width="1200" height="630" fill="url(#bg)" />
        
        <!-- 제목 -->
        <text x="600" y="120" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#333">
          ${title}
        </text>
        
        <!-- 감정 표시 -->
        <text x="600" y="200" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#333">
          감정: ${emotion}
        </text>
        
        <!-- 멘트 표시 -->
        ${ment ? `
          <text x="600" y="280" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#666" max-width="1000">
            ${ment}
          </text>
        ` : ''}
        
        <!-- 상태 표시 -->
        ${status === 'recorded' ? `
          <text x="600" y="400" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#4CAF50" font-weight="bold">
            ✅ 감정 기록 완료!
          </text>
        ` : ''}
        
        <!-- 슬라임 일러스트 -->
        <g transform="translate(600, 450)">
          <ellipse cx="0" cy="0" rx="80" ry="50" fill="${bgColor}" stroke="#4FC3F7" stroke-width="4" />
          <circle cx="-20" cy="-10" r="8" fill="#333" />
          <circle cx="20" cy="-10" r="8" fill="#333" />
          <ellipse cx="0" cy="20" rx="16" ry="8" fill="#fff" />
        </g>
        
        <!-- 하단 텍스트 -->
        <text x="600" y="580" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#666">
          moodipet.vercel.app
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('OG Image Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 