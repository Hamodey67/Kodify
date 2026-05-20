"use client";

import { useMemo } from "react";

const CODE_LINES = [
  "import { encrypt } from '@kodify/core'",
  "export const secureData = async (payload) => {",
  "  await encrypt(payload, 256);",
  "};",
  "const token = jwt.sign({ id }, SECRET);",
  "await prisma.user.findUnique({ email });",
  "export async function GET(req) {",
  "  return Response.json({ ok: true });",
  "}",
  "if (!session?.user) redirect('/login');",
  "npm run deploy",
  "Building cloud infrastructure...",
  "Successfully deployed in 2.4s",
  "SELECT id, status FROM logs",
  "WHERE threat_level > 90",
  "docker compose up -d",
  "kubectl apply -f deploy.yaml",
  "git push origin main",
  "const hash = await bcrypt.hash(pw, 12);",
  "useEffect(() => cleanup(), []);",
  "interface User { id: string; }",
  "res.setHeader('X-Frame-Options', 'DENY');",
  "function middleware(req) {",
  "  const auth = req.headers.get('authorization');",
  "}",
  "{ }",
  "=>",
  "async await",
  "const let return",
  "try catch finally",
  "map() filter() reduce()",
  "Promise.all([fetch('/api')])",
  "JSON.parse(body)",
  "HTTP/2 200 OK",
  "TLS 1.3 handshake",
  "Redis.set(key, data, 'EX', 3600)",
  "PostgreSQL connected",
  "def verify_token(token):",
  "  return jwt.decode(token)",
  "fn main() { serve(\":8080\") }",
  "className=\"container\"",
  "onClick={() => setOpen(true)}",
  "export default function Page()",
  "NextResponse.redirect(url)",
  "logger.info({ event: 'deploy' })",
];

const COLUMN_COUNT = 10;

function linesForColumn(colIndex: number): string[] {
  const n = CODE_LINES.length;
  const count = 14;
  return Array.from({ length: count }, (_, i) => CODE_LINES[(colIndex * 3 + i) % n]);
}

function Column({ index }: { index: number }) {
  const lines = useMemo(() => linesForColumn(index), [index]);
  const duration = 10 + (index % 5) * 3;
  const delay = (index % COLUMN_COUNT) * -1.2;

  const block = (
    <div className="flex flex-col gap-[0.35rem] py-2">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-nowrap leading-tight">
          {line}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="code-rain-col relative h-full flex-1 min-w-0 overflow-hidden"
      style={{
        opacity: 0.04 + (index % 3) * 0.015,
        ["--fall-dur" as string]: `${duration}s`,
        ["--fall-delay" as string]: `${delay}s`,
      }}
    >
      <div className="code-rain-track absolute left-0 right-0 top-0">
        {block}
        <div aria-hidden="true">{block}</div>
      </div>
    </div>
  );
}

export default function BackgroundCodeSymbols() {
  return (
    <>
      <style>{`
        .code-rain-track {
          animation: code-rain-fall var(--fall-dur, 14s) linear infinite;
          animation-delay: var(--fall-delay, 0s);
        }
        @keyframes code-rain-fall {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .code-rain-track { animation: none; transform: translateY(-25%); }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 -z-[9] overflow-hidden font-mono text-[11px] text-sky-300/45 select-none"
        aria-hidden="true"
        dir="ltr"
      >
        {/* يخفّف الكود في الوسط حتى ما يزاحم المحتوى */}
        <div
          className="absolute inset-0 flex gap-1 px-2 md:px-6"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 65% at 50% 42%, transparent 20%, black 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 65% at 50% 42%, transparent 20%, black 72%)",
          }}
        >
          {Array.from({ length: COLUMN_COUNT }, (_, i) => (
            <Column key={i} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
