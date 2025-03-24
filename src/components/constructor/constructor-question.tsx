/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reorder } from 'framer-motion'
import {
  CircleEqualIcon,
  CopyIcon,
  EyeIcon,
  GripVerticalIcon,
  InfoIcon,
  ListStartIcon,
  ListTreeIcon,
  MoreVerticalIcon,
  NotebookPenIcon,
  RectangleEllipsisIcon,
  TextIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import { Dispatch, useState } from 'react'

import { cn } from '@/@config/lib/cn'
import { QuestionProps } from '@/pages/home'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

export interface ValidationProps {
  type?: 'number' | 'text' | 'length'
  text?: {
    method: 'contains' | 'nocontains' | 'email' | 'url' | string
    message: string
    errorMessage: string | 'Ocorreu um error nesse campo'
  }
  number?: {
    method:
      | 'greater_than'
      | 'greater_than_or_equal'
      | 'less_than'
      | 'less_than_or_equal'
      | 'equal'
      | 'not_equal'
      | 'is_integer'
      | 'is_number'
      | string
    value: number
    errorMessage: string | 'Ocorreu um error nesse campo'
  }
  length?: {
    method: 'max' | 'min' | string
    value: number
    errorMessage: string | 'Ocorreu um error nesse campo'
  }
  isRequired?: boolean
}

export interface MultipleChoiceProps {
  id: string
  value: string
  text?: string
  type: 'other' | 'option'
}

interface ConstructorQuestionProps {
  question: QuestionProps
  questions: QuestionProps[]
  setQuestions: Dispatch<QuestionProps[]>
}

export function ConstructorQuestion({
  question,
  questions,
  setQuestions,
}: ConstructorQuestionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hasQuestionDescriptionIsString =
    typeof question.questionDescription === 'string'

  // MULTIPLE CHOICES

  const handleCreateMultipleChoice = (isOther?: boolean) => {
    if (!question.multipleChoices) return

    const generateId = crypto.randomUUID()

    handleUpdateMultipleChoices([
      ...question.multipleChoices,
      {
        id: generateId,
        type: isOther ? 'other' : 'option',
        value: isOther
          ? 'Outro'
          : `Opção ${(question.multipleChoices.length + 1).toString().padStart(2, '0')}`,
      },
    ])
  }

  const handleUpdateMultipleChoice = (id: string, value: string) => {
    if (!question.multipleChoices) return

    const prevChoices = question.multipleChoices
      ? question.multipleChoices.map((item) =>
          item.id === id ? { ...item, value } : item,
        )
      : []

    handleUpdateMultipleChoices(prevChoices)
  }

  const handleRemoveMultipleChoice = (id: string) => {
    if (!question.multipleChoices) return

    const removeMultipleChoice = question.multipleChoices.filter(
      (item) => item.id !== id,
    )

    handleUpdateMultipleChoices(removeMultipleChoice)
  }

  // END MULTIPLE CHOICES

  // QUESTION

  const handleRemoveQuestion = () => {
    const removeQuestion = questions.filter((item) => item.id !== question.id)

    setQuestions(removeQuestion)
  }

  const handleCopyQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        validation: question.validation,
        questionText: question.questionText,
        typeQuestion: question.typeQuestion,
        multipleChoices: question.multipleChoices,
        questionDescription: question.questionDescription,
      },
    ])
  }

  // END QUESTION

  // Funções de atualização de estado de questions
  const handleUpdateQuestion = <K extends keyof QuestionProps>(
    key: K,
    value: QuestionProps[K] | undefined,
    prevQuestionsData?: QuestionProps[],
  ) => {
    const prevQuestions = prevQuestionsData
      ? prevQuestionsData.map((item) =>
          item.id === question.id ? { ...item, [key]: value } : item,
        )
      : questions.map((item) =>
          item.id === question.id ? { ...item, [key]: value } : item,
        )

    setQuestions(prevQuestions)
  }

  const handleUpdateValidation = (
    newValidation: ValidationProps | undefined,
  ) => {
    const prevQuestions = questions.map((item) =>
      item.id === question.id ? { ...item, validation: newValidation } : item,
    )

    setQuestions(prevQuestions)
    return prevQuestions
  }

  const handleUpdateMultipleChoices = (newChoices: MultipleChoiceProps[]) => {
    const prevQuestions = questions.map((item) =>
      item.id === question.id ? { ...item, multipleChoices: newChoices } : item,
    )

    setQuestions(prevQuestions)
  }

  const handleUpdateMultipleChoicesReorder = (newOrder: string[]) => {
    const prevQuestions = questions.map((item) => {
      if (item.id === question.id) {
        const reorderedChoices = newOrder
          .map((value) => {
            return item.multipleChoices?.find(
              (choice) => choice.value === value,
            )
          })
          .filter(
            (choice): choice is MultipleChoiceProps => choice !== undefined,
          )

        return { ...item, multipleChoices: reorderedChoices }
      }

      return item
    })

    setQuestions(prevQuestions)
  }

  return (
    <div>
      <div className="relative rounded-md border-l-[6px] bg-zinc-900 px-8 py-6 transition-all duration-500 hover:border-violet-500">
        <div className="flex items-start gap-4">
          <div className="flex-[2]">
            <Input
              value={question.questionText || ''}
              placeholder="Digite a sua pergunta"
              onChange={(e) =>
                handleUpdateQuestion('questionText', e.target.value)
              }
              className="focus-visible:ring-offset-bg-zinc-900 h-14 bg-zinc-800 transition-all focus-visible:ring-violet-500"
            />

            {hasQuestionDescriptionIsString && (
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="icon"
                  type="button"
                  variant="secondary"
                  className="size-8 shrink-0"
                  onClick={() =>
                    handleUpdateQuestion('questionDescription', undefined)
                  }
                >
                  <span className="sr-only">Remover descrição</span>
                  <XIcon className="size-4" />
                </Button>

                <Input
                  value={question.questionDescription || ''}
                  placeholder="Descrição da sua pergunta"
                  onChange={(e) =>
                    handleUpdateQuestion('questionDescription', e.target.value)
                  }
                  className="!text-md h-10 rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-zinc-800 bg-transparent text-muted-foreground outline-none ring-offset-transparent transition-all focus:border-b-zinc-700 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </div>
            )}
          </div>

          <Select
            value={question.typeQuestion}
            onValueChange={(e) => {
              if (
                e === 'multipleChoice' ||
                (e === 'long' && question.validation?.number)
              ) {
                const prevQuestions = handleUpdateValidation(undefined)
                handleUpdateQuestion('typeQuestion', e, prevQuestions)

                return
              }

              handleUpdateQuestion('typeQuestion', e)
            }}
          >
            <SelectTrigger className="focus-visible:ring-offset-bg-zinc-900 h-14 flex-1 bg-zinc-800 outline-none transition-all focus-visible:ring-violet-500">
              <SelectValue placeholder="Escolha um tipo de resposta" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="short">
                <div className="flex items-center">
                  <ListTreeIcon className="mr-2 size-4" /> Resposta curta
                </div>
              </SelectItem>
              <SelectItem value="long">
                <div className="flex items-center">
                  <ListStartIcon className="mr-2 size-4" /> Resposta longa
                </div>
              </SelectItem>
              <SelectItem value="multipleChoice">
                <div className="flex items-center">
                  <CircleEqualIcon className="mr-2 size-4" /> Múltipla escolha
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {typeof question.questionText === 'string' &&
        question.questionText !== '' ? (
          <div className="mt-4">
            {question.typeQuestion === 'short' && (
              <div className="space-y-2">
                <h2 className="flex items-center text-muted-foreground">
                  <EyeIcon className="mr-2 size-4" />
                  Preview de como o usuário verá a pergunta.
                </h2>
                <div
                  className={cn(
                    'rounded-md border border-dashed border-zinc-700 bg-zinc-800 p-4',
                    hasQuestionDescriptionIsString
                      ? 'space-y-3'
                      : 'space-y-1.5',
                  )}
                >
                  <div className="space-y-0.5">
                    <Label>
                      {question.questionText}{' '}
                      {question.validation?.isRequired && '*'}
                    </Label>
                    {hasQuestionDescriptionIsString && (
                      <p className="text-sm text-muted-foreground">
                        {question.questionDescription}
                      </p>
                    )}
                  </div>
                  <Input
                    disabled
                    type="text"
                    value="Texto de resposta curta"
                    placeholder="Texto de resposta curta"
                    className="focus-visible:ring-offset-bg-zinc-900 h-14 flex-[2] bg-zinc-700 transition-all focus-visible:ring-violet-500"
                  />
                </div>
              </div>
            )}

            {question.typeQuestion === 'long' && (
              <div className="space-y-2">
                <h2 className="flex items-center text-muted-foreground">
                  <EyeIcon className="mr-2 size-4" />
                  Preview de como o usuário verá a pergunta.
                </h2>
                <div
                  className={cn(
                    'rounded-md border border-dashed border-zinc-700 bg-zinc-800 p-4',
                    hasQuestionDescriptionIsString
                      ? 'space-y-3'
                      : 'space-y-1.5',
                  )}
                >
                  <div className="space-y-0.5">
                    <Label>
                      {question.questionText}{' '}
                      {question.validation?.isRequired && '*'}
                    </Label>
                    {hasQuestionDescriptionIsString && (
                      <p className="text-sm text-muted-foreground">
                        {question.questionDescription}
                      </p>
                    )}
                  </div>
                  <Textarea
                    disabled
                    value="Texto de resposta longa"
                    placeholder="Texto de resposta longa"
                    className="focus-visible:ring-offset-bg-zinc-900 h-36 flex-[2] resize-none bg-zinc-700 transition-all focus-visible:ring-violet-500"
                  />
                </div>
              </div>
            )}

            {question.typeQuestion === 'multipleChoice' && (
              <div>
                <div className="space-y-2">
                  <Reorder.Group
                    axis="y"
                    values={
                      question.multipleChoices
                        ? question.multipleChoices.map((choice) => choice.value)
                        : []
                    }
                    onReorder={handleUpdateMultipleChoicesReorder}
                  >
                    <div className="space-y-2">
                      {question.multipleChoices?.map((item, i) => {
                        return (
                          <Reorder.Item
                            value={item.value}
                            key={i}
                            dragListener={isHovered}
                          >
                            <div className="flex items-center gap-2">
                              <GripVerticalIcon
                                className={cn(
                                  'cursor-grab',
                                  isHovered && 'cursor-grabbing',
                                )}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                              />
                              <Input disabled type="radio" className="size-5" />
                              <Input
                                value={
                                  item.type === 'option' ? item.value : 'Outro'
                                }
                                disabled={item.type === 'other'}
                                onChange={(e: any) =>
                                  handleUpdateMultipleChoice(
                                    item.id,
                                    e.target.value,
                                  )
                                }
                                className="!text-md h-10 rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-zinc-800 bg-transparent px-1 text-muted-foreground outline-none ring-offset-transparent transition-all focus:border-b-zinc-700 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:opacity-100"
                              />

                              <Button
                                size="icon"
                                variant="secondary"
                                className="shrink-0"
                                onClick={() =>
                                  handleRemoveMultipleChoice(item.id)
                                }
                              >
                                <XIcon className="size-5" />
                              </Button>
                            </div>
                          </Reorder.Item>
                        )
                      })}
                    </div>
                  </Reorder.Group>

                  <div className="flex items-center gap-2">
                    <GripVerticalIcon className="size-4 cursor-not-allowed text-muted-foreground" />
                    <Input disabled type="radio" className="size-5" />
                    <div className="flex w-full items-center gap-3">
                      <button
                        onClick={() => handleCreateMultipleChoice()}
                        className="!text-md flex h-10 w-full items-center justify-start rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-zinc-800 bg-transparent px-1 text-muted-foreground outline-none ring-offset-transparent transition-all hover:brightness-90 focus:border-b-zinc-700 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:cursor-pointer disabled:opacity-100"
                      >
                        Adicionar uma opção
                      </button>

                      {question.multipleChoices &&
                        !question.multipleChoices.find(
                          (item) => item.type === 'other',
                        ) && (
                          <>
                            <span>ou</span>

                            <Button
                              size="sm"
                              type="button"
                              onClick={() => handleCreateMultipleChoice(true)}
                              className="bg-violet-500 text-white transition-all hover:bg-violet-600"
                            >
                              Adicionar &quot;Outro&quot;
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <h2 className="flex items-center text-muted-foreground">
                    <EyeIcon className="mr-2 size-4" />
                    Preview de como o usuário verá a pergunta.
                  </h2>
                  <div
                    className={cn(
                      'rounded-md border border-dashed border-zinc-700 bg-zinc-800 p-4',
                      hasQuestionDescriptionIsString
                        ? 'space-y-3'
                        : 'space-y-1.5',
                    )}
                  >
                    <div className="space-y-0.5">
                      <Label>
                        {question.questionText}{' '}
                        {question.validation?.isRequired && '*'}
                      </Label>
                      {hasQuestionDescriptionIsString && (
                        <p className="text-sm text-muted-foreground">
                          {question.questionDescription}
                        </p>
                      )}
                    </div>

                    {question.multipleChoices && (
                      <div>
                        {question.multipleChoices.length > 0 ? (
                          question.multipleChoices?.map((item, i) => {
                            return (
                              <div
                                key={i}
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <Input
                                  id="radio-1"
                                  name="radio"
                                  type="radio"
                                  disabled
                                  className="size-5"
                                />
                                <div className="flex w-full items-center gap-4">
                                  <Label htmlFor="radio-1" className="py-3.5">
                                    {item.value}
                                  </Label>

                                  {item.type === 'other' && (
                                    <Input
                                      disabled
                                      className="!text-md flex h-10 w-full flex-1 items-center justify-start rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-zinc-700 bg-transparent px-1 text-muted-foreground outline-none ring-offset-transparent transition-all hover:brightness-90 focus:border-b-zinc-700 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:opacity-100"
                                    />
                                  )}
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="mt-4 flex items-center justify-center rounded-md bg-amber-600 p-2 text-sm font-semibold">
                            <InfoIcon className="mr-2 size-4" />
                            Por favor adicione pelomenos 1 opção
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center rounded-md bg-amber-600 p-2 text-sm font-semibold">
            <InfoIcon className="mr-2 size-4" />
            Por favor preencha o campo de pergunta
          </div>
        )}

        {question.mask && question.mask !== '' && (
          <div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-muted-foreground">
                <RectangleEllipsisIcon className="mr-2 size-4" />
                Máscara de campo
              </h2>

              <Button
                size="sm"
                variant="destructive"
                className="text-xs"
                onClick={() => handleUpdateQuestion('mask', undefined)}
              >
                <Trash2Icon className="mr-2 size-3" />
                Remover máscara
              </Button>
            </div>

            <Input
              value={question.mask || ''}
              placeholder="Digite sua mascara"
              onChange={(e) => handleUpdateQuestion('mask', e.target.value)}
              className="focus-visible:ring-offset-bg-zinc-900 mt-2 h-14 bg-zinc-800 transition-all focus-visible:ring-violet-500"
            />

            <p className="mt-2 text-sm font-semibold text-violet-500">
              Utilize o número 9 para criar sua máscara personalizada, exemplo:
              999.999.999-99
            </p>
          </div>
        )}

        {question.validation && question.validation.type && (
          <div>
            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-muted-foreground">
                <NotebookPenIcon className="mr-2 size-4" />
                Validações
              </h2>

              <Button
                size="sm"
                variant="destructive"
                className="text-xs"
                onClick={() => handleUpdateValidation(undefined)}
              >
                <Trash2Icon className="mr-2 size-3" />
                Remover validação
              </Button>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-3">
              <Select
                value={question.validation.type}
                onValueChange={(value) => {
                  let newValidation: ValidationProps = {
                    type: value as ValidationProps['type'],
                    isRequired: false,
                  }

                  if (value === 'text') {
                    newValidation = {
                      ...newValidation,
                      text: {
                        method: 'contains',
                        message: 'Texto inválido',
                        errorMessage: 'Ocorreu um erro nesse campo',
                      },
                    }
                  } else if (value === 'number') {
                    newValidation = {
                      ...newValidation,
                      number: {
                        method: 'greater_than',
                        value: 10,
                        errorMessage: 'Ocorreu um erro nesse campo',
                      },
                    }
                  } else if (value === 'length') {
                    newValidation = {
                      ...newValidation,
                      length: {
                        method: 'max',
                        value: 10,
                        errorMessage: 'Ocorreu um erro nesse campo',
                      },
                    }
                  }

                  handleUpdateValidation(newValidation)
                }}
              >
                <SelectTrigger className="focus-visible:ring-offset-bg-zinc-900 h-12 flex-1 bg-zinc-800 outline-none transition-all focus-visible:ring-violet-500">
                  <SelectValue placeholder="Escolha um tipo de resposta" />
                </SelectTrigger>

                <SelectContent>
                  {question.typeQuestion !== 'long' && (
                    <SelectItem value="number">Número</SelectItem>
                  )}
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="length">Comprimento</SelectItem>
                </SelectContent>
              </Select>

              {question.validation.type === 'number' && (
                <>
                  <Select
                    defaultValue="greater_than"
                    value={question.validation.number?.method}
                    onValueChange={(e) => {
                      if (question.validation?.number) {
                        handleUpdateValidation({
                          ...question.validation,
                          number: {
                            method: e,
                            value: question.validation.number.value,
                            errorMessage:
                              question.validation.number.errorMessage,
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="focus-visible:ring-offset-bg-zinc-900 h-12 flex-1 bg-zinc-800 outline-none transition-all focus-visible:ring-violet-500">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="greater_than">Maior que</SelectItem>
                      <SelectItem value="is_number">É número</SelectItem>
                      <SelectItem value="greater_than_or_equal">
                        Maior ou igual a
                      </SelectItem>
                      <SelectItem value="less_than">Menor que</SelectItem>
                      <SelectItem value="less_than_or_equal">
                        Menor ou igual a
                      </SelectItem>
                      <SelectItem value="equal">Igual a</SelectItem>
                      <SelectItem value="not_equal">Diferente de</SelectItem>
                    </SelectContent>
                  </Select>

                  {question.validation.number?.method !== 'is_number' && (
                    <Input
                      type="number"
                      placeholder="Número"
                      value={question.validation.number?.value}
                      onChange={(e: any) => {
                        if (question.validation?.number) {
                          handleUpdateValidation({
                            ...question.validation,
                            number: {
                              value: e.target.value,
                              method: question.validation.number.method,
                              errorMessage:
                                question.validation.number.errorMessage,
                            },
                          })
                        }
                      }}
                      className="focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500"
                    />
                  )}

                  <Input
                    value={question.validation.number?.errorMessage || ''}
                    onChange={(e: any) => {
                      if (question.validation?.number) {
                        handleUpdateValidation({
                          ...question.validation,
                          number: {
                            method: question.validation.number.method,
                            value: question.validation.number.value,
                            errorMessage: e.target.value,
                          },
                        })
                      }
                    }}
                    placeholder="Texto de error personalizado"
                    className={cn(
                      'focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500',
                      question.validation.number?.method === 'is_number' &&
                        'col-span-2',
                    )}
                  />
                </>
              )}

              {question.validation.type === 'text' && (
                <>
                  <Select
                    defaultValue="contains"
                    value={question.validation.text?.method}
                    onValueChange={(e) => {
                      if (question.validation?.text) {
                        handleUpdateValidation({
                          ...question.validation,
                          text: {
                            method: e,
                            message: question.validation.text.message,
                            errorMessage: question.validation.text.errorMessage,
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="focus-visible:ring-offset-bg-zinc-900 h-12 flex-1 bg-zinc-800 outline-none transition-all focus-visible:ring-violet-500">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="contains">Contém</SelectItem>
                      <SelectItem value="nocontains">Não contém</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                    </SelectContent>
                  </Select>

                  {(question.validation.text?.method === 'contains' ||
                    question.validation.text?.method === 'nocontains') && (
                    <Input
                      placeholder="Texto"
                      value={question.validation.text?.message || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (question.validation?.text) {
                          handleUpdateValidation({
                            ...question.validation,
                            text: {
                              ...question.validation.text,
                              message: e.target.value,
                            },
                          })
                        }
                      }}
                      className="focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500"
                    />
                  )}

                  <Input
                    value={question.validation.text?.errorMessage || ''}
                    onChange={(e: any) => {
                      if (question.validation?.text) {
                        handleUpdateValidation({
                          ...question.validation,
                          text: {
                            method: question.validation.text.method,
                            message: question.validation.text.message,
                            errorMessage: e.target.value,
                          },
                        })
                      }
                    }}
                    placeholder="Texto de error personalizado"
                    className={cn(
                      'focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500',
                      (question.validation.text?.method === 'email' ||
                        question.validation.text?.method === 'url') &&
                        'col-span-2',
                    )}
                  />
                </>
              )}

              {question.validation.type === 'length' && (
                <>
                  <Select
                    defaultValue="max"
                    value={question.validation.length?.method}
                    onValueChange={(e: any) => {
                      if (question.validation?.length) {
                        handleUpdateValidation({
                          ...question.validation,
                          length: {
                            method: e,
                            value: question.validation.length.value,
                            errorMessage:
                              question.validation.length.errorMessage,
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="focus-visible:ring-offset-bg-zinc-900 h-12 flex-1 bg-zinc-800 outline-none transition-all focus-visible:ring-violet-500">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="max">Número máximo</SelectItem>
                      <SelectItem value="min">Número mínimo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Número"
                    value={question.validation.length?.value}
                    onChange={(e: any) => {
                      if (question.validation?.length) {
                        handleUpdateValidation({
                          ...question.validation,
                          length: {
                            value: e.target.value,
                            method: question.validation.length.method,
                            errorMessage:
                              question.validation.length.errorMessage,
                          },
                        })
                      }
                    }}
                    className="focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500"
                  />

                  <Input
                    value={question.validation.length?.errorMessage || ''}
                    onChange={(e: any) => {
                      if (question.validation?.length) {
                        handleUpdateValidation({
                          ...question.validation,
                          length: {
                            method: question.validation.length.method,
                            value: question.validation.length.value,
                            errorMessage: e.target.value,
                          },
                        })
                      }
                    }}
                    placeholder="Texto de error personalizado"
                    className="focus-visible:ring-offset-bg-zinc-900 h-12 bg-zinc-800 transition-all focus-visible:ring-violet-500"
                  />
                </>
              )}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            {questions.find((item) => item.id === question.id) &&
              question.questionText &&
              question.questionText !== '' && (
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  className="bg-transparent"
                  onClick={handleCopyQuestion}
                >
                  <span className="sr-only">Duplicar pergunta</span>
                  <CopyIcon className="size-4" />
                </Button>
              )}

            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemoveQuestion}
            >
              <span className="sr-only">Excluir pergunta</span>
              <Trash2Icon className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-3" />

            <div className="flex items-center gap-3">
              <Label htmlFor="isRequired">Obrigatória</Label>
              <Switch
                id="isRequired"
                checked={
                  question.validation ? question.validation.isRequired : false
                }
                onCheckedChange={(e) => {
                  if (!question.validation) {
                    handleUpdateValidation({ isRequired: e })
                  } else {
                    handleUpdateValidation({
                      ...question.validation,
                      isRequired: e,
                    })
                  }
                }}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="secondary">
                  <span className="sr-only">Exibir mais opções</span>
                  <MoreVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-zinc-900">
                <DropdownMenuLabel>Exibir mais opções</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      if (hasQuestionDescriptionIsString) return
                      handleUpdateQuestion(
                        'questionDescription',
                        'Adicione uma descrição',
                      )
                    }}
                  >
                    <TextIcon className="mr-2 size-4" />
                    Adicionar descrição
                  </Button>
                </DropdownMenuItem>

                {question.typeQuestion !== 'multipleChoice' && (
                  <>
                    {question.typeQuestion === 'short' && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            if (question.mask) return
                            handleUpdateQuestion('mask', '999')
                          }}
                        >
                          <RectangleEllipsisIcon className="mr-2 size-4" />
                          Adicionar máscara de campo
                        </Button>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() =>
                          handleUpdateValidation({
                            type: 'text',
                            text: {
                              method: 'contains',
                              message: '',
                              errorMessage: 'Ocorreu um error nesse campo',
                            },
                            isRequired:
                              question.validation?.isRequired ?? false,
                          })
                        }
                      >
                        <NotebookPenIcon className="mr-2 size-4" />
                        Adicionar validações
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
