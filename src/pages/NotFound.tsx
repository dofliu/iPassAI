import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-[#102b4f]">404 - 找不到頁面</h1>
      <p className="text-gray-600 mb-6">您所尋找的頁面不存在或已被移除。</p>
      <Link
        href="/"
        className="px-6 py-2 bg-[#193c6b] text-white rounded-lg hover:bg-[#112b4e] transition"
      >
        返回首頁
      </Link>
    </div>
  );
}
