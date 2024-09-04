'use client'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { docText, estimateColumns, mockData } from '~/constants';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { useState } from 'react';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js'
import { TaskTree } from '../_components/TaskTree';
import { Epic, EstimateColumn, Feature, Task } from '~/types';
import { FeatureTree } from '../_components/FeatureTree';
import { EpicTree } from '../_components/EpicTree';
import { EstimateMatrix } from '../_components/EstimatesSubForm';


const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const schemaJson = `
  epics: {
    name: string
    context: string
    features: {
      name: string
      context: string
      tasks: {
        name: string
        context: string
      }[]
    }[]
}[]
`

const prompt: any = [
  {"role": "system", "content": `This is a message from a document with feature requirements for a future IT project. Extract information about project epics features and tasks according this JSON schema - ${schemaJson}. Keep context fields maximum in range of 50-100 tokens
  `},
  {"role": "user", "content": docText }
]
const supabaseUrl = 'https://vilmdronupdhikexxmct.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey ?? '')

const getResponse = () => {
  client.chat.completions.create({
    model: 'gpt-4o',
    messages: prompt,
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      
      return supabase.from('mock_data').insert({
        description: 'features_ml_4o',
        proto_json: parsed
      })
    })
}
const rankingPrompt = (message: string, context: string): any => [
  {"role": "system", "content": `Given the context and the sentence(s) to search for, determine the "inclusion score" for context and sentence(s). Score is between 0 and 100. 100 is perfect score when the sentence(s) or its paraphrase is found in a context. 0 is the score when nothing in the context is even remotely related to the meaning of the sentence(s). Answer according to this JSON schema - { score: number }`},
  {"role": "user", "content": `Sentence(s) - ${message}\n Context - ${context}` }
]
const getRankingResponse = (message: string, context: string) => {
  return client.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: rankingPrompt(message, context),
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      return parsed
      // return supabase.from('mock_data').insert({
      //   description: 'features_ml',
      //   proto_json: parsed
      // })
    })
}
const ranking = {
  epics: 5,
  features: 2,
  tasks: 1,
}
const calculateTotal = async (original: Epic[], toRate: Epic[]) => {
  const totalEpicPoints = original.length * ranking.epics
  const totalFeaturePoints = original.flatMap(({ features }) => features).length * ranking.features
  const totalTasksPoints = original.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).length * ranking.tasks

  const totalPoints = totalEpicPoints + totalFeaturePoints + totalTasksPoints

  const originalEpics = original.map(({ name }) => name)
  const originalFeatures = original.flatMap(({ features }) => features).map(({ name }) => name)
  const originalTasks = original.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).map(({ name }) => name)
  const toRateEpicsContext = toRate.map(({ name }) => name).join(';\n')
  const toRateFeaturesContext = toRate.flatMap(({ features }) => features).map(({ name }) => name).join(';\n')
  const toRateTasksContext = toRate.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).map(({ name }) => name).join(';\n')
  const resEpics = await Promise.allSettled(originalEpics.map(epic => getRankingResponse(epic, toRateEpicsContext)))
  const epicPoints = resEpics
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0) * ranking.epics
  
  const resFeatures = await Promise.allSettled(originalFeatures.map(feature => getRankingResponse(feature, toRateFeaturesContext)))
  const featurePoints = resFeatures
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0)  * ranking.features

  const resTasks = await Promise.allSettled(originalTasks.map(task => getRankingResponse(task, toRateTasksContext)))
  const taskPoints = resTasks
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0)  * ranking.tasks

  console.log('epicPoints', epicPoints, 'featurePoints', featurePoints, 'taskPoints', taskPoints);
  const totalEarnedPoints = epicPoints + featurePoints + taskPoints
  const finalPercent = totalEarnedPoints / totalPoints
  console.log('final percent', finalPercent);
  
}
const aiEpics: any[] = [
  {
    "name": "Динамическое управление продуктами плавки ДП-7",
    "context": "Разработка программного обеспечения для повышения эффективности управления доменной печью, обеспечивая точность и оперативность данных о производственном процессе.",
    "features": [
      {
        "name": "Создание сервиса подсистемы оценки вышедшего чугуна",
        "tasks": [
          {
            "name": "Оценка объема и массы чугуна",
            "context": "Подсистема должна обеспечить оценку и отображение данных о текущих и предыдущих выпусках."
          },
          {
            "name": "Корректировка оценки по чугуну",
            "context": "Автоматическая корректировка оценки на основе фактических данных."
          },
          {
            "name": "Учет фактического количества выпущенного чугуна",
            "context": "Подсистема должна хранить данные оценки и фактические значения."
          },
          {
            "name": "Оценка скорости налива",
            "context": "Подсистема должна оценивать скорость налива и предупреждать о низких показателях."
          }
        ],
        "context": "Обеспечение оценки объема и массы чугуна, мониторинг наполненности ковшей."
      },
      {
        "name": "Создание сервиса подсистемы оценки вышедшего шлака",
        "tasks": [
          {
            "name": "Оценка объема и массы шлака",
            "context": "Обеспечить мониторинг и отображение данных о шлаке, включая состояния ковшей."
          },
          {
            "name": "Корректировка оценки по шлаку",
            "context": "Обеспечение возможности корректировки оценок на основе фактических данных."
          },
          {
            "name": "Учет фактического количества выпущенного шлака",
            "context": "Подсистема должна вести учет данных по шлаку и его весу."
          },
          {
            "name": "Оценка скорости налива шлака",
            "context": "Предупреждение о низкой скорости налива."
          }
        ],
        "context": "Параметры оценок массы и объема шлака в режиме реального времени."
      },
      {
        "name": "Создание сервиса подсистемы определения послойного расположения шихты",
        "tasks": [
          {
            "name": "Послойный учет шихты",
            "context": "Обеспечить контроль расположения шихты."
          },
          {
            "name": "Оценка времени прихода материала",
            "context": "Учет среднего времени перемещения материалов."
          },
          {
            "name": "Отслеживание анализов порции шихты",
            "context": "Обеспечить информацию о химических свойствах порции."
          }
        ],
        "context": "Контроль и отслеживание послойного расположения шихты в шахте."
      },
      {
        "name": "Создание сервиса аналитической панели",
        "tasks": [
          {
            "name": "Визуализация данных",
            "context": "Создание панели для графического и табличного отображения данных."
          },
          {
            "name": "Выдача графиков",
            "context": "Обеспечить возможность построения графиков по данным."
          }
        ],
        "context": "Визуализация и анализ данных доменной печи."
      }
    ]
  }
]
const aiData4o: any[] = [
    {
      "name": "Система оценки вышедшего чугуна",
      "context": "Эпик включает функционал оценки объема и массы чугуна, а также учет фактических данных и корректировка оценок.",
      "features": [
        {
          "name": "Подсистема оценки объема и массы чугуна",
          "tasks": [
            {
              "name": "Оценка объема и массы чугуна",
              "context": "Разработка функционала для оценки объема и массы вышедшего чугуна за текущие выпуски."
            },
            {
              "name": "Корректировка оценки по фактическим значениям",
              "context": "Разработка механизма коррекции оценок на основе фактических данных с провески."
            },
            {
              "name": "Учет фактического количества чугуна",
              "context": "Учет и хранение данных оценки и фактических значений после провески."
            },
            {
              "name": "Оценка скорости налива",
              "context": "Отображение текущей скорости налива и предупреждения в случае низкой скорости."
            }
          ],
          "context": "Предоставляет оценку объема и массы вышедшего чугуна и отображение информации об этом на странице оператора. Включает учет наполненности ковшей и скорость выдачи чугуна."
        }
      ]
    },
    {
      "name": "Система оценки вышедшего шлака",
      "context": "Эпик включает функционал оценки объема и массы шлака, а также учет фактических данных и корректировка оценок.",
      "features": [
        {
          "name": "Подсистема оценки объема и массы шлака",
          "tasks": [
            {
              "name": "Оценка объема и массы шлака",
              "context": "Разработка функционала для оценки объема и массы вышедшего шлака за текущие выпуски."
            },
            {
              "name": "Корректировка оценки по фактическим значениям",
              "context": "Разработка механизма коррекции оценок на основе фактических данных с провески."
            },
            {
              "name": "Учет фактического количества шлака",
              "context": "Учет и хранение данных оценки и фактических значений после провесок шлака при их наличии."
            },
            {
              "name": "Оценка скорости налива",
              "context": "Отображение текущей скорости налива и предупреждения в случае низкой скорости."
            }
          ],
          "context": "Предоставляет оценку объема и массы вышедшего шлака и отображение информации об этом на странице оператора. Включает учет наполненности ковшей и скорость выдачи шлака."
        }
      ]
    },
    {
      "name": "Система определения послойного расположения шихты",
      "context": "Эпик включает функционал мониторинга и отображения расположения шихты в шахте доменной печи, а также отслеживание анализов порций шихты.",
      "features": [
        {
          "name": "Контроль расположения порций шихты",
          "tasks": [
            {
              "name": "Послойный учет шихты в шахте",
              "context": "Обеспечение контроля расположения порций шихты в шахте печи в соответствии с геометрическими характеристиками узлов доменной печи."
            },
            {
              "name": "Оценка времени прибытия шихты",
              "context": "Оценка времени, необходимого для перемещения материала от прихода в доменный цех до выгрузки в шахте печи."
            },
            {
              "name": "Отслеживание анализов порций шихты",
              "context": "Отслеживание химических и механических свойств каждой порции шихты в пропорции от загруженных масс."
            },
            {
              "name": "Оценка времени прибытия порции в горн",
              "context": "Обеспечение оценки времени прихода порции в горн при текущих параметрах работы печи."
            }
          ],
          "context": "Предоставление информации о расположении порций шихты внутри шахты доменной печи и их характеристик."
        }
      ]
    },
    {
      "name": "Система жидких продуктов в горне печи",
      "context": "Эпик включает функционал мониторинга и управления наполненностью горна чугуном и шлаком и отображение информации.",
      "features": [
        {
          "name": "Прогноз наполненности горна",
          "tasks": [
            {
              "name": "Отслеживание текущей наполненности",
              "context": "Мониторинг и отображение текущего объема и массы чугунных и шлаковых материалов в горне."
            },
            {
              "name": "Модели движения и оценки объема",
              "context": "Использование моделей движения материалов внутри печи для прогноза объема и массы вышедшего чугуна и шлака."
            },
            {
              "name": "Контроль материального баланса",
              "context": "Обеспечение баланса горна на основе расчетов движения шихтовых материалов и объема выпущенного чугуна и шлака."
            }
          ],
          "context": "Прогнозирование текущей наполненности горна чугуном и шлаком с учетом геометрии доменной печи и других параметров."
        },
        {
          "name": "Контроль продуктов плавки в горне",
          "tasks": [
            {
              "name": "Материальный баланс в горне",
              "context": "Обеспечение точного контроля материального баланса жидких продуктов в горне печи и ковшах."
            },
            {
              "name": "Автокорректировка и рекомендации",
              "context": "Автокорректировка данных по чугуну и шлаку и выдача рекомендаций по процессу выпуска."
            },
            {
              "name": "Оповещения и сигналы",
              "context": "Выдача информации и сигналов об оптимизации процесса выпуска и предотвращении переполнений."
            }
          ],
          "context": "Контроль и управление процессом выпуска чугунных и шлаковых материалов из горна печи."
        }
      ]
    },
    {
      "name": "Система интеграции сервисов",
      "context": "Эпик включает функционал интеграции и синхронизации данных из различных подсистем для учета и управления характеристиками поступающего сырья и выходящих продуктов.",
      "features": [
        {
          "name": "Послойный учет шихты entlang печи",
          "tasks": [
            {
              "name": "Агрегация данных",
              "context": "Обеспечение хранения и предоставления данных по слоям шихты вдоль всей печи."
            },
            {
              "name": "Интеграция с существующими моделями",
              "context": "Интеграция с новой моделью формирования слоев шихты и отказ от старой модели визуализации."
            },
            {
              "name": "Интерфейс и визуализация",
              "context": "Разработка UI для визуализации данных по слоям шихты."
            }
          ],
          "context": "Хранение и предоставление информации о порции шихты и их расположении вдоль всей доменной печи."
        },
        {
          "name": "Рекомендации по открытию/закрытию выпуска",
          "tasks": [
            {
              "name": "Алгоритмы рекомендаций",
              "context": "Разработка алгоритмов выдачи рекомендаций по процессу выпуска на основе данных и истории выпусков."
            },
            {
              "name": "Интерфейс рекомендаций",
              "context": "Разработка UI для отображения и управлением рекомендациями."
            }
          ],
          "context": "Выдача рекомендаций по открытию/закрытию выпуска чугуна и шлака."
        }
      ]
    },
    {
      "name": "Аналитическая панель",
      "context": "Эпик включает функционал визуализации и анализа данных доменной печи.",
      "features": [
        {
          "name": "Основные графики и фильтры",
          "tasks": [
            {
              "name": "Визуализация данных",
              "context": "Разработка интерфейса для графического и табличного отображения данных."
            },
            {
              "name": "Фильтрация данных",
              "context": "Реализация функционала фильтрации данных по дате и другим параметрам."
            },
            {
              "name": "Выгрузка и анализ данных",
              "context": "Реализация функционала для выгрузки данных в формат CSV для дальнейшего анализа."
            }
          ],
          "context": "Отображение основных графиков производственной активности с возможностью применения фильтров."
        }
      ]
    },
    {
      "name": "Трекер шахты",
      "context": "Эпик включает функционал мониторинга параметров доменной печи, включая расход топлива и характеристики шихты.",
      "features": [
        {
          "name": "Мониторинг слоев в шахте",
          "tasks": [
            {
              "name": "Отображение параметров шихты",
              "context": "Разработка интерфейса для отображения параметров шихты по слоям в шахте печи."
            },
            {
              "name": "Анализ порций",
              "context": "Проведение анализа характеристик поступивших в доменную печь порций шихты и их влияния на процесс."
            },
            {
              "name": "Детекция аномалий",
              "context": "Разработка механизма для выявления аномалий в характеристиках загруженных порций."
            }
          ],
          "context": "Мониторинг характеристик загруженных порций шихты и отображение информации в виде графиков."
        }
      ]
    }
  ]

export default function Projects() {
  const methods = useForm<{epics: Epic[], name: string, estimate_matrix: EstimateColumn[] }>()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <Button onClick={methods.handleSubmit(async data => {
        await supabase.from('fr_projects').insert(data)
      })}>Create Form</Button> */}
      <Button onClick={async () => {
        // await getResponse()
        await calculateTotal(mockData, aiData4o)
      }}>Rate</Button>
      <FormProvider {...methods}>
        <EstimateMatrix />
        <Controller name="name" render={({ field }) => <TextField label="Название проекта" {...field} />} />
        <EpicTree />
      </FormProvider>
    </main>
  );
}
