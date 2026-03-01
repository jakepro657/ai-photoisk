import React from "react";

function MyPage() {
  return (
    <div className="z-10 flex flex-col flex-1 justify-start items-center w-full bg-white gap-4 p-6">
      <h1 className="text-2xl font-PretendardBold text-gray-800 mt-4">
        마이페이지
      </h1>
      <p className="text-sm font-PretendardRegular text-gray-500 text-center">
        사용자 정보 및 활동 내역을 확인할 수 있습니다.
      </p>
      {/* TODO: User info, photo history, settings */}
      <div className="w-full mt-6 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-PretendardBold text-gray-700">내 정보</h2>
          <p className="text-sm text-gray-400 mt-1">로그인 후 확인할 수 있습니다</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-PretendardBold text-gray-700">활동 내역</h2>
          <p className="text-sm text-gray-400 mt-1">AI 사진 변환 기록이 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  );
}

export default MyPage
