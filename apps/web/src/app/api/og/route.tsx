import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Vinterview — Nền Tảng Luyện Phỏng Vấn IT';
    const category = searchParams.get('category') || 'Luyện Phỏng Vấn';
    const technology = searchParams.get('technology') || 'Sinh Viên IT & Fresher';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
            backgroundSize: '40px 40px',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              V
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Vinterview
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {category} • {technology}
            </div>
          </div>

          {/* Main Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
            <h1
              style={{
                fontSize: '52px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1.2,
                margin: 0,
                letterSpacing: '-1px',
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '20px', color: '#94a3b8', margin: 0 }}>
              Ôn luyện câu hỏi phỏng vấn chuẩn công ty công nghệ & môn học Đại học dành cho sinh viên IT.
            </p>
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #1e293b',
              paddingTop: '24px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#64748b' }}>
              vinterview.vn — Luyện phỏng vấn IT & Phân tích CV bằng AI
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#38bdf8',
                fontWeight: '600',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '6px 12px',
                borderRadius: '8px',
              }}
            >
              🚀 Free IT Interview Platform
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
