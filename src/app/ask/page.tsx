"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EMPTY_PROFILE, SIDO, STEPS, encodeProfile, type Profile } from "@/lib/profile";

export default function Ask() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const heading = useRef<HTMLHeadingElement>(null);

  // 단계가 바뀌면 질문으로 포커스를 옮긴다. 스크린리더가 새 질문을 읽게 하려면 필요하다.
  useEffect(() => {
    heading.current?.focus();
  }, [i]);

  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  const next = (p: Profile = profile) => {
    if (last) router.push(`/result#p=${encodeProfile(p)}`);
    else setI(i + 1);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-5 py-8">
      <div>
        <p className="mb-2 text-base text-muted">
          {i + 1} / {STEPS.length}
        </p>
        <div className="h-2 rounded-full bg-border" role="presentation">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${((i + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        <h1
          ref={heading}
          tabIndex={-1}
          className="text-3xl font-bold leading-snug focus-visible:outline-none"
        >
          {step.title}
        </h1>
        {step.hint && <p className="mt-3 text-lg text-muted">{step.hint}</p>}

        <div className="mt-8">
          {step.kind === "age" && (
            <label className="block text-xl">
              <span className="sr-only">만 나이</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={120}
                value={profile.age ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    age: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-40 rounded-xl border-2 border-border px-4 py-3 text-2xl"
              />
              <span className="ml-3 text-2xl">세</span>
            </label>
          )}

          {step.kind === "sido" && (
            <label className="block">
              <span className="sr-only">시도</span>
              <select
                value={profile.sido}
                onChange={(e) => setProfile({ ...profile, sido: e.target.value })}
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-2xl"
              >
                <option value="">잘 모르겠어요</option>
                {SIDO.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {step.kind === "radio" && (
            <fieldset className="space-y-3">
              <legend className="sr-only">{step.title}</legend>
              {step.options.map((o) => (
                <label
                  key={o.value}
                  className="touch-target flex cursor-pointer items-center gap-4 rounded-xl border-2 border-border px-5 py-4 text-xl has-checked:border-accent has-checked:bg-accent/10"
                >
                  <input
                    type="radio"
                    name={step.key}
                    value={o.value}
                    checked={profile[step.key] === o.value}
                    onChange={() => setProfile({ ...profile, [step.key]: o.value })}
                  />
                  {o.label}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {i > 0 && (
          <button
            type="button"
            onClick={() => setI(i - 1)}
            className="rounded-xl border-2 border-border px-6 py-4 text-xl"
          >
            이전
          </button>
        )}
        <button
          type="button"
          onClick={() => next()}
          className="flex-1 rounded-xl bg-accent px-6 py-4 text-xl font-bold text-white"
        >
          {last ? "결과 보기" : "다음"}
        </button>
      </div>

      {step.kind === "age" && (
        <button
          type="button"
          onClick={() => next({ ...profile, age: null })}
          className="text-lg text-muted underline"
        >
          나이를 잘 모르겠어요
        </button>
      )}
    </main>
  );
}
