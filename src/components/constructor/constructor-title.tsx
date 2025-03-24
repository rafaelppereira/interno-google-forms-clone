import { Dispatch } from 'react'

import { QuestionTitleProps } from '@/pages/home'

import { Input } from '../ui/input'

interface ConstructorTitleProps {
  questionTitle: QuestionTitleProps
  setQuestionTitle: Dispatch<QuestionTitleProps>
}

export function ConstructorTitle({
  questionTitle,
  setQuestionTitle,
}: ConstructorTitleProps) {
  return (
    <div className="rounded-md border-l-[6px] bg-zinc-900 px-4 pb-6 pt-4 transition-all duration-500 hover:border-violet-500">
      <Input
        type="text"
        value={questionTitle?.title}
        placeholder="Título do formulário"
        onChange={(e) => {
          if (!questionTitle) return

          setQuestionTitle({
            title: e.target.value,
            description: questionTitle.description,
          })
        }}
        className="relative top-2 h-12 rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-transparent bg-transparent !text-2xl font-semibold text-foreground outline-none ring-offset-transparent transition-all focus:top-0 focus:border-b-zinc-800 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />

      <Input
        type="text"
        value={questionTitle?.description}
        placeholder="Descrição do formulário"
        onChange={(e) => {
          if (!questionTitle) return

          setQuestionTitle({
            title: questionTitle.title,
            description: e.target.value,
          })
        }}
        className="!text-md h-8 rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-transparent bg-transparent text-muted-foreground outline-none ring-offset-transparent transition-all focus:border-b-zinc-800 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
    </div>
  )
}
