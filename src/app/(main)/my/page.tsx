"use client";

import { useUser } from "@clerk/nextjs";
import CircleLoading from "@/components/common/CircleLoading";

export default function MyPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircleLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full px-4 pt-4 gap-4">
      {/* User profile section */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="프로필"
            className="w-14 h-14 rounded-full"
          />
        )}
        <div>
          <p className="font-semibold text-lg">
            {user?.firstName ||
              user?.emailAddresses?.[0]?.emailAddress ||
              "사용자"}
          </p>
          <p className="text-sm text-gray-500">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Activity history section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">활동 내역</h2>
        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400">
          <p>아직 활동 내역이 없습니다</p>
          <p className="text-sm mt-1">사진을 변환해보세요!</p>
        </div>
      </div>
    </div>
  );
}
