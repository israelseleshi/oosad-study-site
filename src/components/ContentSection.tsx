import React from 'react';
import { ContentItem, Section } from '../types';
import Card, { CardContent, CardHeader } from './ui/Card';

interface ContentSectionProps {
  section: Section;
  chapterIndex: number;
  sectionIndex: number;
}

interface TermItemProps {
  term: string;
  definition: string;
}

const TermItem: React.FC<TermItemProps> = ({ term, definition }) => {
  return (
    <div className="mb-3 last:mb-0">
      <dt className="text-sm font-medium text-gray-900 dark:text-white">{term}</dt>
      <dd className="mt-1 text-sm text-gray-600 dark:text-gray-300">{definition}</dd>
    </div>
  );
};

const ContentSection: React.FC<ContentSectionProps> = ({ 
  section, 
  chapterIndex,
  sectionIndex
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {(chapterIndex + 1)}.{(sectionIndex + 1)} {section.title}
          </h2>
        </div>
      </div>
      
      <div className="space-y-6">
        {section.content.map((contentItem, contentIndex) => (
          <Card key={contentIndex} className="transition-all hover:translate-y-[-2px]">
            {contentItem.subtitle && (
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {(chapterIndex + 1)}.{(sectionIndex + 1)}.{(contentIndex + 1)} {contentItem.subtitle}
                </h3>
              </CardHeader>
            )}
            
            <CardContent>
              {contentItem.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {contentItem.description}
                </p>
              )}
              
              {contentItem.items && contentItem.items.length > 0 && (
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                  {contentItem.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="py-3 first:pt-0 last:pb-0">
                      <TermItem term={item.term} definition={item.definition} />
                    </div>
                  ))}
                </dl>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentSection;