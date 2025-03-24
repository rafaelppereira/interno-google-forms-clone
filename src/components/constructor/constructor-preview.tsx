/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  CircleXIcon,
  HelpCircleIcon,
  InfoIcon,
  SendHorizonalIcon,
} from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import { toast } from 'sonner'
import { z } from 'zod'

import { QuestionProps, QuestionTitleProps } from '@/pages/home'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { ValidationProps } from './constructor-question'

interface ConstructorPreviewProps {
  questionTitle: QuestionTitleProps
  questions: QuestionProps[]
}

export function ConstructorPreview({
  questionTitle,
  questions,
}: ConstructorPreviewProps) {
  const validationSchema = (validation: ValidationProps) => {
    if (!validation) return z.string().optional()

    if (validation.isRequired && !validation.type) {
      return z
        .string({ required_error: 'Por favor preencha esse campo' })
        .min(1, { message: 'Por favor preencha esse campo' })
    }

    let schema: any

    switch (validation?.type) {
      case 'number':
        if (validation.number && validation.number.method === 'greater_than') {
          schema = z
            .string({
              required_error: 'Por favor preencha esse campo',
            })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) => validation.number && val <= validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (
          validation.number &&
          validation.number.method === 'greater_than_or_equal'
        ) {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) => validation.number && val < validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (
          validation.number &&
          validation.number.method === 'less_than'
        ) {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) => validation.number && val >= validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (
          validation.number &&
          validation.number.method === 'less_than_or_equal'
        ) {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) => validation.number && val > validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (validation.number && validation.number.method === 'equal') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) =>
                validation.number && val !== validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (
          validation.number &&
          validation.number.method === 'not_equal'
        ) {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine(
              (val: any) =>
                validation.number && val === validation.number.value,
              {
                message: validation.number.errorMessage,
              },
            )
        } else if (
          validation.number &&
          validation.number.method === 'is_number'
        ) {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .transform((val: any) => parseFloat(val))
            .refine((val: any) => !isNaN(val), {
              message: validation.number.errorMessage,
            })
        } else {
          schema = z.string({ required_error: 'Por favor preencha esse campo' })
        }
        break

      case 'length':
        if (validation.length && validation.length.method === 'max') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .max(validation.length.value, validation.length.errorMessage)
        } else if (validation.length && validation.length.method === 'min') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .min(validation.length.value, validation.length.errorMessage)
        } else {
          schema = z.string({ required_error: 'Por favor preencha esse campo' })
        }
        break

      case 'text':
        if (validation.text && validation.text.method === 'contains') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .refine(
              (val: any) =>
                validation.text?.message &&
                val.includes(validation.text.message),
              {
                message: validation.text.errorMessage,
              },
            )
        } else if (validation.text && validation.text.method === 'nocontains') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .refine(
              (val: any) =>
                validation.text?.message &&
                !val.includes(validation.text.message),
              {
                message: validation.text.errorMessage,
              },
            )
        } else if (validation.text && validation.text.method === 'email') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .email({ message: validation.text.errorMessage })
        } else if (validation.text && validation.text.method === 'url') {
          schema = z
            .string({ required_error: 'Por favor preencha esse campo' })
            .url({ message: validation.text.errorMessage })
        } else {
          schema = z.string({ required_error: 'Por favor preencha esse campo' })
        }
        break

      default:
        schema = z.string({ required_error: 'Por favor preencha esse campo' })
    }

    if (validation.isRequired) {
      return schema.refine(
        (val: any) => {
          if (typeof val === 'string') {
            return val.trim() !== ''
          } else {
            return val !== undefined
          }
        },
        {
          message: 'Por favor preencha esse campo',
        },
      )
    }

    return schema.optional()
  }

  const schema = questions.reduce((acc: any, question) => {
    if (question.validation) {
      acc[question.id] = validationSchema(question.validation)
    } else {
      acc[question.id] = z.string().optional()
    }
    return acc
  }, {})

  const form = useForm({
    resolver: zodResolver(z.object(schema)),
  })

  const onSubmit = (data: any) => {
    const questionsWithResponses = Object.keys(data).map((id) => {
      const question = questions.find((question) => question.id === id)
      return {
        questionText: question?.questionText,
        response: data[id],
      }
    })

    toast.success('Formulário de pré-visualização enviado com sucesso!')
    console.log(questionsWithResponses)
  }

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-md bg-zinc-900 p-10"
      >
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {questionTitle.title}
          </h2>
          <p className="text-md text-muted-foreground">
            {questionTitle.description}
          </p>
        </div>

        <div className="my-5 space-y-5">
          {questions.filter((item) => item.questionText).length > 0 ? (
            questions
              .filter((item) => item.questionText)
              .map((question, i) => {
                return (
                  <div key={i}>
                    <div className="flex items-end justify-between">
                      <div>
                        <Label>
                          {question.questionText}{' '}
                          {question.validation?.isRequired && '*'}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {question.questionDescription}
                        </p>
                      </div>

                      {question.typeQuestion === 'multipleChoice' && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => form.setValue(question.id, null)}
                        >
                          <CircleXIcon className="mr-2 size-4" />
                          Limpar o valor
                        </Button>
                      )}
                    </div>

                    {question.typeQuestion === 'short' && (
                      <Controller
                        name={question.id}
                        control={form.control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type={
                                question.validation?.number ? 'number' : 'text'
                              }
                              className={`focus-visible:ring-offset-bg-zinc-900 mt-3 h-14 w-full flex-[2] rounded-md border bg-zinc-800 px-4 outline-none transition-all focus-visible:ring-violet-500 ${form.formState.errors[question.id] ? 'border-red-500' : ''}`}
                              onChange={(e) => {
                                if (question.mask) {
                                  const value = e.target.value
                                  let maskedValue = ''
                                  let valueIndex = 0

                                  for (
                                    let i = 0;
                                    i < question.mask.length &&
                                    valueIndex < value.length;
                                    i++
                                  ) {
                                    if (question.mask[i] === '9') {
                                      if (/\d/.test(value[valueIndex])) {
                                        maskedValue += value[valueIndex]
                                        valueIndex++
                                      }
                                    } else {
                                      maskedValue += question.mask[i]

                                      if (
                                        value[valueIndex] === question.mask[i]
                                      ) {
                                        valueIndex++
                                      }
                                    }
                                  }

                                  e.target.value = maskedValue
                                }

                                field.onChange(e)
                              }}
                            />
                          </div>
                        )}
                      />
                    )}

                    {question.typeQuestion === 'long' && (
                      <Controller
                        name={question.id}
                        control={form.control}
                        render={({ field }) => (
                          <div>
                            <Textarea
                              {...field}
                              className={`focus-visible:ring-offset-bg-zinc-900 mt-3 h-36 flex-[2] resize-none bg-zinc-800 transition-all focus-visible:ring-violet-500 ${form.formState.errors[question.id] ? 'border-red-500' : ''}`}
                            />
                          </div>
                        )}
                      />
                    )}

                    <div className="mt-3 space-y-3">
                      {question.typeQuestion === 'multipleChoice' &&
                        question.multipleChoices &&
                        question.multipleChoices
                          .filter((item) => {
                            const isCustomInputActive =
                              question.multipleChoices &&
                              form.watch(question.id) &&
                              !question.multipleChoices.some(
                                (option) =>
                                  option.value !== 'Outro' &&
                                  option.value === form.watch(question.id),
                              )

                            if (isCustomInputActive && item.value === 'Outro') {
                              return false
                            }

                            return true
                          })
                          .map((item, i) => {
                            return (
                              <Controller
                                key={i}
                                name={question.id}
                                control={form.control}
                                render={({ field }) => (
                                  <div className="flex cursor-pointer items-center gap-3 rounded-md bg-zinc-800 px-3 transition-all hover:brightness-90">
                                    <Input
                                      id={item.id}
                                      type="radio"
                                      className="size-6 cursor-pointer"
                                      value={item.value}
                                      checked={field.value === item.value}
                                      onChange={() =>
                                        field.onChange(item.value)
                                      }
                                    />
                                    <Label
                                      className="w-full cursor-pointer py-4"
                                      htmlFor={item.id}
                                    >
                                      {item.value}
                                    </Label>
                                  </div>
                                )}
                              />
                            )
                          })}

                      {question.typeQuestion === 'multipleChoice' &&
                        question.multipleChoices &&
                        typeof form.watch(question.id) === 'string' &&
                        !question.multipleChoices
                          .filter((item) => item.value !== 'Outro')
                          .some(
                            (option) =>
                              option.value === form.watch(question.id),
                          ) && (
                          <div className="flex cursor-pointer items-center gap-3 rounded-md bg-zinc-800 px-3 transition-all hover:brightness-90">
                            <Input
                              type="radio"
                              checked={true}
                              className="size-6 cursor-pointer"
                            />

                            <Controller
                              name={question.id}
                              control={form.control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="text"
                                  className="!text-md flex h-[46px] w-full flex-1 items-center justify-start rounded-none border-b-[3px] border-l-0 border-r-0 border-t-0 border-b-zinc-700 bg-transparent px-0 text-muted-foreground outline-none ring-offset-transparent transition-all hover:brightness-90 focus:border-b-zinc-700 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:opacity-100"
                                />
                              )}
                            />
                          </div>
                        )}

                      {form.formState.errors[question.id] && (
                        <p className="mt-1 text-sm text-red-500">
                          {String(form.formState.errors[question.id]?.message)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="mt-4 flex items-center justify-center rounded-md bg-amber-600 p-2 text-sm font-semibold">
              <InfoIcon className="mr-2 size-4" />
              Você precisa pelomenos ter 1 pergunta criada
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <span className="flex select-none items-center text-xs text-muted-foreground">
            <CheckCircleIcon className="mr-2 size-4" /> Aceito os termos de uso
            das informações
          </span>

          <Button disabled type="button" size="icon" variant="secondary">
            <span className="sr-only">Dúvidas</span>
            <HelpCircleIcon className="size-4" />
          </Button>

          <Button
            type="submit"
            disabled={questions.filter((item) => item.questionText).length <= 0}
            className="bg-violet-500 text-white hover:bg-violet-600"
          >
            <SendHorizonalIcon className="mr-2 size-4" />
            Enviar resposta
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
