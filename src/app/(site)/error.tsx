"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h1 className="error-page__title">Có lỗi xảy ra</h1>
      <p className="error-page__desc">
        Trang hiện chưa thể hiển thị. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="error-page__actions">
        <button type="button" className="btn btn--primary" onClick={reset}>
          Thử lại
        </button>
        <Link href="/" className="btn btn--outline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
