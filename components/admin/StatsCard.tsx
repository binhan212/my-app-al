'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRightIcon,
  DocumentTextIcon,
  FolderIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  TagIcon,
  RectangleStackIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const iconMap = {
  DocumentTextIcon,
  FolderIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  TagIcon,
  RectangleStackIcon,
  EyeIcon
} as const

type IconName = keyof typeof iconMap

interface StatsCardProps {
  title: string
  value: number
  subtitle: string
  iconName: IconName
  color: string
  bgColor: string
  href: string
}

export function StatsCard({ title, value, subtitle, iconName, color, bgColor, href }: StatsCardProps) {
  const Icon = iconMap[iconName]
  
  return (
    <Link href={href} className="block group">
      <Card className="transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer border-2 hover:border-gray-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${bgColor} transition-transform group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{subtitle}</p>
            <ArrowRightIcon className={`w-4 h-4 ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
