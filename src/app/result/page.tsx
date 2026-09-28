"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { STEPS, decodeProfile, sidoName, type Profile } from "@/lib/profile";

/** 프로필을 사용자가 답한 말로 되돌려 읽어준다. 잘못 답한 걸 여기서 알아채야 한다. */
function summary(p: Profile): { q: string; a: string }[] {
  return STEPS.map((s) => {
    if (s.kind === "age") return { q: "나이", a: p.age === null ? "잘 모름" : `${p.age}세` };
    if (s.kind === "sido") return { q: "사는 곳", a: p.sido ? sidoName(p.sido) : "잘 모름" };
    const label = s.options.find((o) => o.value === p[s.key])?.label ?? "잘 모름";
    return { q: s.title.replace(/[?？]$/, ""), a: label };
  });
}

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export default function Result() {
  // 프로필은 해시에만 있다. 쿼리스트링과 달리 서버 로그·리퍼러·링크 미리보기에 실리지 않는다.
  // 서버에서는 해시를 볼 수 없으므로 null을 주고, 하이드레이션 후 실제 값으로 다시 그린다.
  const hash = useSyncExternalStore(
    subscribeHash,
    () => location.hash,
    () => null,
  );

  if (hash === null) return null;

  const profile = decodeProfile(new URLSearchParams(hash.slice(1)).get("p"));

  if (!profile) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-5 py-16">
        <h1 className="text-3xl font-bold">결과를 불러오지 못했습니다</h1>
        <p className="text-xl text-muted">
          링크가 잘린 것 같습니다. 다시 답해 주세요.
        </p>
        <Link href="/ask" className="rounded-xl bg-accent px-8 py-5 text-center text-xl font-bold text-white">
          다시 시작하기
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-5 py-8">
      <section>
        <h1 className="text-3xl font-bold">알려주신 내용</h1>
        <dl className="mt-5 divide-y divide-border border-y border-border">
          {summary(profile).map((row) => (
            <div key={row.q} className="flex justify-between gap-4 py-3 text-lg">
              <dt className="text-muted">{row.q}</dt>
              <dd className="font-medium">{row.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ponytail: 판정 결과 자리. 규칙 30개가 붙으면 여기에 3값 판정이 들어간다 */}
      <section className="rounded-xl border-2 border-dashed border-border p-6 text-lg text-muted">
        복지서비스 판정은 아직 준비 중입니다.
      </section>

      <p className="text-base text-muted">
        이 결과는 알려주신 내용만으로 추정한 참고용 안내입니다. 실제 대상 여부와
        신청은 주민센터나 해당 기관에서 확인하셔야 합니다.
      </p>

      <Link href="/ask" className="text-lg text-accent underline">
        처음부터 다시 하기
      </Link>
    </main>
  );
}
