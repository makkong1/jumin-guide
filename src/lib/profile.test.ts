import assert from "node:assert/strict";
import test from "node:test";
import { decodeProfile, encodeProfile, type Profile } from "./profile.ts";

const sample: Profile = {
  age: 78,
  sido: "11",
  income: "BASIC",
  household: "ALONE",
  care: "NEED",
  disability: "NO",
};

test("인코딩한 프로필은 그대로 되돌아온다", () => {
  assert.deepEqual(decodeProfile(encodeProfile(sample)), sample);
});

test("URL이 망가져도 던지지 않고 null을 준다", () => {
  for (const bad of ["", "!!!", "e30", "bm90LWpzb24", null, undefined]) {
    assert.doesNotThrow(() => decodeProfile(bad));
  }
  assert.equal(decodeProfile("!!!"), null);
  assert.equal(decodeProfile(null), null);
});

test("모르는 값이 섞여 오면 '잘 모름'으로 떨어진다", () => {
  const tampered = encodeProfile({
    ...sample,
    age: 999,
    sido: "99",
    income: "RICH" as Profile["income"],
  });
  const p = decodeProfile(tampered);
  assert.equal(p?.age, null);
  assert.equal(p?.sido, "");
  assert.equal(p?.income, "UNKNOWN");
  assert.equal(p?.household, "ALONE", "멀쩡한 값은 살아남아야 한다");
});
