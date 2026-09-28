/** 규칙이 실제로 읽는 필드만 둔다. 설계 스펙 7장. */
export type Profile = {
  /** 만 나이. null = 잘 모름 */
  age: number | null;
  /** 시도 법정동 코드 앞 2자리. "" = 잘 모름 */
  sido: string;
  income: "BASIC" | "NEAR" | "OTHER" | "UNKNOWN";
  household: "ALONE" | "SPOUSE" | "CHILD" | "UNKNOWN";
  care: "NONE" | "NEED" | "GRADED" | "UNKNOWN";
  disability: "YES" | "NO" | "UNKNOWN";
};

export const EMPTY_PROFILE: Profile = {
  age: null,
  sido: "",
  income: "UNKNOWN",
  household: "UNKNOWN",
  care: "UNKNOWN",
  disability: "UNKNOWN",
};

/** 시도 17개. 강원(51)·전북(52)은 특별자치도 전환 후 코드. */
export const SIDO = [
  { code: "11", name: "서울특별시" },
  { code: "26", name: "부산광역시" },
  { code: "27", name: "대구광역시" },
  { code: "28", name: "인천광역시" },
  { code: "29", name: "광주광역시" },
  { code: "30", name: "대전광역시" },
  { code: "31", name: "울산광역시" },
  { code: "36", name: "세종특별자치시" },
  { code: "41", name: "경기도" },
  { code: "51", name: "강원특별자치도" },
  { code: "43", name: "충청북도" },
  { code: "44", name: "충청남도" },
  { code: "52", name: "전북특별자치도" },
  { code: "46", name: "전라남도" },
  { code: "47", name: "경상북도" },
  { code: "48", name: "경상남도" },
  { code: "50", name: "제주특별자치도" },
] as const;

type RadioKey = "income" | "household" | "care" | "disability";

type Step =
  | { key: "age"; kind: "age"; title: string; hint?: string }
  | { key: "sido"; kind: "sido"; title: string; hint?: string }
  | {
      key: RadioKey;
      kind: "radio";
      title: string;
      hint?: string;
      options: { value: Profile[RadioKey]; label: string }[];
    };

/** 한 화면에 질문 하나, 6단계. 모든 질문에 "잘 모름"이 1급 선택지. */
export const STEPS: Step[] = [
  {
    key: "age",
    kind: "age",
    title: "나이가 어떻게 되세요?",
    hint: "만 나이로 알려주세요. 기초연금·장기요양처럼 나이가 기준인 제도를 가릅니다.",
  },
  {
    key: "sido",
    kind: "sido",
    title: "어디에 사세요?",
    hint: "사는 지역의 지자체 복지서비스를 함께 찾습니다.",
  },
  {
    key: "income",
    kind: "radio",
    title: "소득이 어디에 해당하세요?",
    hint: "정확히 모르셔도 괜찮습니다. 모르면 '확인이 필요한 것'으로 안내해 드립니다.",
    options: [
      { value: "BASIC", label: "기초생활수급자예요" },
      { value: "NEAR", label: "차상위계층이에요" },
      { value: "OTHER", label: "둘 다 아니에요" },
      { value: "UNKNOWN", label: "잘 모르겠어요" },
    ],
  },
  {
    key: "household",
    kind: "radio",
    title: "누구와 함께 사세요?",
    options: [
      { value: "ALONE", label: "혼자 살아요" },
      { value: "SPOUSE", label: "배우자와 살아요" },
      { value: "CHILD", label: "자녀와 살아요" },
      { value: "UNKNOWN", label: "잘 모르겠어요" },
    ],
  },
  {
    key: "care",
    kind: "radio",
    title: "거동이나 돌봄은 어떠세요?",
    options: [
      { value: "NONE", label: "혼자 생활하는 데 불편이 없어요" },
      { value: "NEED", label: "일상생활에 도움이 필요해요" },
      { value: "GRADED", label: "장기요양등급을 받았어요" },
      { value: "UNKNOWN", label: "잘 모르겠어요" },
    ],
  },
  {
    key: "disability",
    kind: "radio",
    title: "장애인 등록을 하셨나요?",
    options: [
      { value: "YES", label: "네, 등록했어요" },
      { value: "NO", label: "아니요" },
      { value: "UNKNOWN", label: "잘 모르겠어요" },
    ],
  },
];

const toBase64Url = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (s: string) => {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const encodeProfile = (p: Profile) => toBase64Url(JSON.stringify(p));

const pick = <K extends keyof Profile>(
  step: K,
  raw: Record<string, unknown>,
  fallback: Profile[K],
): Profile[K] => {
  const s = STEPS.find((x) => x.key === step);
  if (!s || s.kind !== "radio") return fallback;
  const ok = s.options.some((o) => o.value === raw[step]);
  return ok ? (raw[step] as Profile[K]) : fallback;
};

/**
 * URL에서 오는 값이라 신뢰 경계다. 형식이 어긋나면 던지지 말고
 * "잘 모름"으로 떨어뜨린다 — 모름은 이 서비스에서 정상 상태다.
 */
export const decodeProfile = (encoded: string | null | undefined): Profile | null => {
  if (!encoded) return null;
  let raw: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(encoded));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    raw = parsed as Record<string, unknown>;
  } catch {
    return null;
  }
  const age = raw.age;
  return {
    age: typeof age === "number" && Number.isInteger(age) && age >= 0 && age <= 120 ? age : null,
    sido: SIDO.some((s) => s.code === raw.sido) ? (raw.sido as string) : "",
    income: pick("income", raw, "UNKNOWN"),
    household: pick("household", raw, "UNKNOWN"),
    care: pick("care", raw, "UNKNOWN"),
    disability: pick("disability", raw, "UNKNOWN"),
  };
};

export const sidoName = (code: string) =>
  SIDO.find((s) => s.code === code)?.name ?? "지역 모름";
