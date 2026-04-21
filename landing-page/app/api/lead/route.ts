import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)

  let email: string
  try {
    const body = await req.json()
    email = body.email?.trim()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'EasyTradeSetup <support@easytradesetup.com>',
    to: email,
    subject: 'Your Free Pre-Trade Checklist — EasyTradeSetup',
    html: buildChecklistEmail(email),
  })

  return NextResponse.json({ ok: true })
}

function buildChecklistEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E6EDF3;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <div style="margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#161B22;border:1px solid #30363D;border-radius:10px;padding:8px 14px;">
        <span style="font-size:13px;font-weight:700;color:#E6EDF3;">EasyTradeSetup</span>
      </div>
    </div>

    <h1 style="font-size:26px;font-weight:900;margin:0 0 12px;letter-spacing:-0.5px;">Your Free Checklist is Here ✓</h1>
    <p style="font-size:15px;color:#8B949E;margin:0 0 32px;line-height:1.6;">
      Below is the exact pre-trade checklist used with the ETS Momentum System.
      Run through it every morning before you place a single trade.
    </p>

    <div style="background:#161B22;border:1px solid #30363D;border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8B949E;margin:0 0 20px;">ETS Pre-Trade Checklist (5 checks, &lt;60 seconds)</p>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Check Nifty open gap', 'Is the gap above 0.5%? Consider waiting for gap fill first.'],
          ['Check Gift Nifty / SGX cues', 'Global sentiment — are we likely to open bullish or bearish?'],
          ['Mark key S/R levels', 'Identify the nearest support and resistance on the 15-min chart.'],
          ['Pre-set your SL and target', 'Write it down before entering. Not after.'],
          ['Set your max loss for today', 'If you hit it, stop trading. No exceptions.'],
        ].map(([title, detail], i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #21262D;vertical-align:top;">
            <div style="display:flex;gap:12px;">
              <span style="color:#00C853;font-weight:700;flex-shrink:0;margin-top:1px;">${i + 1}.</span>
              <div>
                <div style="font-size:14px;font-weight:600;color:#E6EDF3;">${title}</div>
                <div style="font-size:12px;color:#8B949E;margin-top:3px;">${detail}</div>
              </div>
            </div>
          </td>
        </tr>`).join('')}
      </table>
    </div>

    <div style="background:rgba(88,166,255,0.05);border:1px solid rgba(88,166,255,0.2);border-radius:12px;padding:20px;margin-bottom:32px;">
      <p style="font-size:14px;color:#8B949E;margin:0;">
        <strong style="color:#E6EDF3;">Want the full system?</strong><br/>
        The ETS Momentum Pack includes the TradingView Pine Script that generates BUY/SELL labels
        automatically when all 3 conditions align — so you never miss a signal.
        One-time payment of <strong style="color:#58A6FF;">₹2,499</strong>.<br/><br/>
        <a href="https://www.easytradesetup.com/#pricing" style="color:#58A6FF;text-decoration:none;font-weight:600;">View the pack →</a>
      </p>
    </div>

    <p style="font-size:11px;color:#484F58;margin:0;line-height:1.6;">
      You requested this checklist at ${email}. No further emails unless you sign up for updates.<br/>
      Trading involves significant risk. Not SEBI-registered advice.<br/>
      © 2026 EasyTradeSetup · Nextologic Solutions LLP
    </p>
  </div>
</body>
</html>`.trim()
}
