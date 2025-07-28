"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdHome } from "react-icons/io";

export default function NotFoundPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Image
            src="/images/404.png"
            alt="404 illustration"
            width={600}
            height={400}
            className="mx-auto"
            priority
          />
        </div>

        <h1 className="text-xl sm:text-xl font-semibold text-gray-800 mb-1">
          SORRY, PAGE NOT FOUND <span className="text-xl">😭</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you are looking for is not available!
        </p>

        <button
          onClick={() => router.back()}
          className="inline-flex gap-x-2 cursor-pointer items-center px-4 py-2 bg-[#0ab39c] hover:bg-[#0ab39c] text-white rounded-md transition"
        >
          <IoMdHome size={20} />
          Come Back
        </button>
      </div>
    </div>
  );
}
