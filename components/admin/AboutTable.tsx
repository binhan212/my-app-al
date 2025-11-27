'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { About } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { AboutFormDialog } from './AboutFormDialog'

interface AboutTableProps {
  about: About | null
}

export function AboutTable({ about }: AboutTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSuccess = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)}>
            {about ? (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Tạo nội dung
              </>
            )}
          </Button>
        </div>

        {about ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {about.image_url && (
              <div className="relative w-full h-96">
                <Image
                  src={about.image_url}
                  alt="Giới thiệu"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="text-sm text-gray-500">
                Cập nhật lần cuối: {new Date(about.updated_at).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-500 text-lg mb-4">
              Chưa có nội dung giới thiệu
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Tạo nội dung ngay
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <AboutFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        about={about}
        onSuccess={handleSuccess}
      />
    </>
  )
}
