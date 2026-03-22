'use client'

import { useState } from 'react'
import { WooProductAttribute, WooProductReview } from '@/types'

interface ProductTabsProps {
  description: string
  attributes?: WooProductAttribute[]
  reviews?: WooProductReview[]
}

export default function ProductTabs({ description, attributes = [], reviews = [] }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const tabs = [
    { id: 'description', label: 'Descrição', count: null },
    { id: 'specs', label: 'Especificações', count: attributes.length },
    { id: 'reviews', label: 'Avaliações', count: reviews.length }
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium transition-colors relative
              ${activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attr, index) => (
              <div key={index} className="border-b border-gray-100 pb-3">
                <dt className="text-sm text-gray-500">{attr.name}</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">
                  {attr.options.join(', ')}
                </dd>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma avaliação ainda. Seja o primeiro a avaliar!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    {/* Review content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}