import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-5 py-16">
      <div className="space-y-5">
        <h1 className="text-4xl font-bold leading-snug">
          어르신이 받으실 수 있는
          <br />
          복지서비스를 찾아드립니다
        </h1>
        <p className="text-xl text-muted">
          질문 여섯 개에 답하시면 됩니다. 회원가입도 로그인도 없습니다. 자녀분이
          부모님 대신 알아보셔도 됩니다.
        </p>
      </div>

      <Link
        href="/ask"
        className="rounded-xl bg-accent px-8 py-5 text-center text-2xl font-bold text-white focus-visible:outline-offset-4"
      >
        시작하기
      </Link>

      <p className="text-base text-muted">
        답하신 내용은 서버에 저장되지 않습니다. 결과는 참고용 안내이며, 최종
        확인과 신청은 주민센터나 해당 기관에서 하셔야 합니다.
      </p>
    </main>
  );
}
