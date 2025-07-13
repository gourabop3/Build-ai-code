'use client'

import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const Page = () => {
    const trpc = useTRPC()
    const invoke = useMutation(
        trpc.invoke.mutationOptions({
            onSuccess: () => {
                toast.success('Invoked background job')
            },
        }),
    )

    return (
        <div className="mx-auto max-w-7xl p-4">
            <Button
                onClick={() => invoke.mutate({ text: 'Text' })}
                disabled={invoke.isPending}
            >
                Invoke Background job
            </Button>
        </div>
    )
}

export default Page
