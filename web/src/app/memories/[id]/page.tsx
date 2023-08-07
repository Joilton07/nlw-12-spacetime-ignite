'use client'

import { EditMemoryForm } from '@/Components/EditMemoryForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Link
        href="/"
        className="flex items-center gap-1 pl-16 pt-16 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <EditMemoryForm />
    </div>
  )
}
