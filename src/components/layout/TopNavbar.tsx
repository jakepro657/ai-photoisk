import Logo from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Instagram, LinkIcon, UserCircle2, UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'react-hot-toast'
import RowContainer from './containers/RowContainer'

type Props = {}

function TopNavbar({ }: Props) {

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("URL이 복사되었습니다")
    }

    return (
        <RowContainer
            className="z-20 flex items-center text-xl sm:text-3xl w-full"
        >
            <Logo />
            <Button className="ml-auto" variant="ghost">
                <Link
                    href={"https://www.instagram.com/sscc_ssu"}
                    target="_blank"
                >
                    <Instagram size={24} />
                </Link>
            </Button>
            <Button onClick={copyUrl} variant="ghost">
                <LinkIcon size={24} />
            </Button>
            <SignedOut>
                <SignInButton>
                    {/* <Button className='flex items-center text-[1rem]'>
                        로그인
                    </Button> */}
                    <Button variant="default">
                        <UserCircle2Icon size={24} />
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <div className='flex items-center mx-3 text-[1.25rem]'>
                    <UserButton />
                </div>
            </SignedIn>
        </RowContainer>
    )
}

export default TopNavbar