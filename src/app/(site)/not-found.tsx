import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__desc">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link href="/" className="btn btn--primary">
        Về trang chủ
      </Link>
    </div>
  );
}
