import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

function RowContainer({ children, className }: Props) {
  return  (
    <div className={className}>{children}</div>
  )
}

export default RowContainer