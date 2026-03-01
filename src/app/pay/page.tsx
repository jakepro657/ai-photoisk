"use client"

import React from 'react'

// TODO: 결제 시스템 재활성화 시 복원
function PayPage() {
    return (
        <div className="relative h-full bg-white w-full sm:w-[500px]">
            <div className="w-full flex flex-col items-center justify-center h-full gap-4">
                <h1 className="text-2xl font-PretendardBold">서비스 준비 중</h1>
                <p className="font-PretendardRegular text-gray-500">
                    결제 서비스를 준비 중입니다. 잠시만 기다려 주세요.
                </p>
            </div>
        </div>
    )
}

export default PayPage
