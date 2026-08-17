import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

const FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/hebrew-500-normal.ttf'

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(FONT_URL)
    if (!response.ok) return null
    return await response.arrayBuffer()
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.slice(0, 120) || ''
  const subtitle = searchParams.get('subtitle')?.slice(0, 160) || ''
  const rtl = searchParams.get('dir') === 'rtl'

  const font = await loadFont()

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #f7f5ff 0%, #ffffff 60%)',
        direction: rtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{
          fontSize: 68,
          lineHeight: 1.15,
          color: '#1b1524',
          display: 'flex',
          textAlign: rtl ? 'right' : 'left',
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            lineHeight: 1.35,
            color: '#5b5266',
            display: 'flex',
            textAlign: rtl ? 'right' : 'left',
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: 'Rubik', data: font, style: 'normal', weight: 500 }] : undefined,
    },
  )
}
