import { motion, Reorder } from 'framer-motion'
import { ChevronLeftIcon, InfoIcon, PlusIcon, SaveIcon } from 'lucide-react'
import { useState } from 'react'

import { ConstructorPreview } from '@/components/constructor/constructor-preview'
import {
  ConstructorQuestion,
  MultipleChoiceProps,
  ValidationProps,
} from '@/components/constructor/constructor-question'
import { ConstructorTitle } from '@/components/constructor/constructor-title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface QuestionProps {
  id: string
  typeQuestion: string
  mask?: string | undefined
  questionText: string | undefined
  validation?: ValidationProps | undefined
  questionDescription?: string | undefined
  multipleChoices?: MultipleChoiceProps[] | undefined
}

export interface QuestionTitleProps {
  title: string
  description: string
}

export function Home() {
  const [questionTitle, setQuestionTitle] = useState<QuestionTitleProps>({
    title: 'Formulário sem título',
    description: 'Descrição do formulário',
  })

  const [questions, setQuestions] = useState<QuestionProps[]>(
    [
      {
        id: crypto.randomUUID(),
        typeQuestion: 'short',
        validation: undefined,
        questionText: undefined,
        questionDescription: undefined,
        multipleChoices: [
          {
            type: 'option',
            value: 'Opção 01',
            id: crypto.randomUUID(),
          },
        ],
      },
    ],
    // [
    //   {
    //     id: 'c43bbb64-1764-41b1-a7b9-77cd052437e1',
    //     typeQuestion: 'short',
    //     validation: { isRequired: true },
    //     questionText: 'Qual seu nome completo?',
    //     questionDescription: 'Por favor informe seu nome completo',
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Opção 01',
    //         id: '5e3af6bd-7e93-4589-8034-8b010cb67d33',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'f6a8b8b1-2934-4b01-8fd4-704b7318c24a',
    //     typeQuestion: 'short',
    //     mask: '999.999.999-99',
    //     validation: { isRequired: true },
    //     questionText: 'Qual o seu CPF?',
    //     questionDescription: undefined,
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Opção 01',
    //         id: '93eb1915-64bc-4c42-8a6b-54fec68eeb3c',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'c72b5001-7bf7-440c-a26a-badc4c91fa6a',
    //     typeQuestion: 'short',
    //     mask: '99/99/9999',
    //     validation: { isRequired: true },
    //     questionText: 'Data de nascimento',
    //     questionDescription: undefined,
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Opção 01',
    //         id: '27944bb1-541d-42e0-8db5-367b6c3a17cb',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'ce1270d3-239a-4945-8719-b1f8d6c67ade',
    //     typeQuestion: 'multipleChoice',
    //     mask: undefined,
    //     validation: { isRequired: true },
    //     questionText: 'Gênero',
    //     questionDescription: undefined,
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Masculino',
    //         id: 'ec8b2f70-7d59-4615-91e1-f4c8c4ee055c',
    //       },
    //       {
    //         id: 'e2110243-75e2-4ac3-8a94-8fbc8d70b8c9',
    //         type: 'option',
    //         value: 'Feminino',
    //       },
    //       {
    //         id: '94fef336-ec20-43cc-b76c-1739caded09f',
    //         type: 'option',
    //         value: 'Prefiro não informar',
    //       },
    //       {
    //         id: '4ee83746-2bfb-4090-9f28-8f33be8bc433',
    //         type: 'other',
    //         value: 'Outro',
    //       },
    //     ],
    //   },
    //   {
    //     id: '87630f72-2f76-43f0-ac79-fefdd25508c3',
    //     typeQuestion: 'short',
    //     mask: undefined,
    //     validation: {
    //       type: 'text',
    //       text: {
    //         method: 'email',
    //         message: '',
    //         errorMessage: 'Por favor insira um e-mail válido',
    //       },
    //       isRequired: true,
    //     },
    //     questionText: 'Endereço de e-mail',
    //     questionDescription:
    //       'Informe seu e-mail principal para receber novidades',
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Opção 01',
    //         id: 'b5de973d-9598-4a74-a651-e8d5fdb77b66',
    //       },
    //     ],
    //   },
    //   {
    //     id: '36c87eec-e212-4219-b4a1-7f0bdc77ada1',
    //     typeQuestion: 'long',
    //     validation: { isRequired: true },
    //     questionText: 'Como conheceu nossa empresa?',
    //     questionDescription:
    //       'Conte com detalhes como chegou até conhecer nossa empresa',
    //     multipleChoices: [
    //       {
    //         type: 'option',
    //         value: 'Opção 01',
    //         id: '9c7f89db-e979-43d9-a5c5-766a341e8807',
    //       },
    //     ],
    //   },
    // ],
  )

  const handleCreateQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        typeQuestion: 'short',
        validation: undefined,
        questionText: undefined,
        questionDescription: undefined,
        multipleChoices: [
          {
            type: 'option',
            value: 'Opção 01',
            id: crypto.randomUUID(),
          },
        ],
      },
    ])
  }

  return (
    <main className="min-h-screen w-full bg-constructor bg-cover bg-fixed bg-center bg-no-repeat pb-10">
      <Tabs defaultValue="constructor" className="h-full">
        <header className="fixed left-1/2 top-0 z-50 mx-auto flex h-20 w-full -translate-x-1/2 items-center justify-between rounded-sm bg-zinc-900 px-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              type="button"
              variant="secondary"
              className="size-12"
              title="Clique para voltar uma etapa"
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
            <div className="hidden md:block">
              <h2 className="font-semibold tracking-tight">
                Construtor de formulário
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Crie seu formulário padrão para utilizar
              </p>
            </div>
          </div>

          <TabsList>
            <TabsTrigger value="constructor">Construtor</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="hidden lg:flex">
              Alterado
            </Badge>

            <Button
              size="icon"
              type="button"
              variant="secondary"
              className="flex lg:hidden"
              title="Clique para salvar as informações"
            >
              <SaveIcon className="size-4" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="hidden lg:flex"
              title="Clique para salvar as informações"
            >
              <SaveIcon className="mr-2 size-4" />
              Salvar informações
            </Button>
          </div>
        </header>

        <div className="mx-auto h-full w-full max-w-4xl px-4 pt-[calc(5rem+1rem)]">
          <TabsContent value="constructor">
            <div className="space-y-4">
              <ConstructorTitle
                questionTitle={questionTitle}
                setQuestionTitle={setQuestionTitle}
              />

              <Reorder.Group values={questions} onReorder={setQuestions}>
                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((item, i) => {
                      return (
                        <Reorder.Item key={i} value={item}>
                          <motion.div
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 100 }}
                            transition={{
                              type: 'spring',
                              stiffness: 260,
                              damping: 20,
                            }}
                          >
                            <ConstructorQuestion
                              question={item}
                              questions={questions}
                              setQuestions={setQuestions}
                            />
                          </motion.div>
                        </Reorder.Item>
                      )
                    })
                  ) : (
                    <div className="mt-4 flex items-center justify-center rounded-md bg-amber-600 p-2 text-sm font-semibold">
                      <InfoIcon className="mr-2 size-4" />
                      Adicione pelomenos uma pergunta para criar o formulário
                    </div>
                  )}

                  <div className="rounded-md bg-zinc-900 p-3">
                    <Button
                      type="button"
                      className="w-full"
                      variant="secondary"
                      onClick={handleCreateQuestion}
                    >
                      <PlusIcon className="mr-2 size-4" />
                      Adicionar nova pergunta
                    </Button>
                  </div>
                </div>
              </Reorder.Group>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <ConstructorPreview
              questionTitle={questionTitle}
              questions={questions}
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
