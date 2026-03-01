import React from 'react'

type Props = {}

function CircleLoading({}: Props) {
  return (
    <div 
        className="w-16 h-16 border-4 border-transparent border-l-[#2f80ed] border-b-[#2f80ed] rounded-full animate-spin duration-500"
    >
    </div>
  )
}

export default CircleLoading
