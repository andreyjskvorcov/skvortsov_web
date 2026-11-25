# Промпт для Figma: дизайн-система и UI-kit

Промпт для ИИ-ассистента в Figma (First Draft / Figma Make), чтобы собрать **минимальную** дизайн-систему —
общую основу для сайта и всех однотипных приложений из [TODOPROJECTS.md](../../TODOPROJECTS.md): переменные, типографика,
базовые компоненты и пара общих блоков. Ничего про обучение здесь нет.

- **Учебные блоки** (Callout, Quiz, Task, пагинация, страницы уроков) — отдельным промптом
  [00-learning.md](00-learning.md), в тот же файл поверх этой системы.
- **Источник значений** — код: цвета и радиусы из [`packages/tokens/tokens.css`](../../packages/tokens/tokens.css),
  компоненты из [`packages/ui-react/src/components/`](../../packages/ui-react/src/components/) (Vue-версия — [`packages/ui-vue`](../../packages/ui-vue/)).
  Если токены в коде меняются — обновите таблицу в промпте.
- **Как использовать:** скопируйте блок целиком. Если результат «плоский» — отдавайте по частям: 1–2, потом 3, потом 4.
- **Figma Make** делает код-прототип, а не нативный файл — для переменных и компонентов с вариантами лучше Figma Design
  (First Draft) или ручная сборка по этому ТЗ.
- **Обратный перенос:** решения из Figma переносятся в `packages/tokens/tokens.css` и компоненты пакета —
  имена переменных и вариантов в Figma совпадают с кодом.

````text
Создай минимальную дизайн-систему «skvortsov.web» — общую основу для сайта и нескольких однотипных веб-приложений.
Стиль — спокойный, технический: много воздуха, чёткая типографика, акцентный индиго, без декоративных градиентов и лишних теней.
Кит основан на shadcn/ui — имена токенов и вариантов совпадают с кодом. Делай только то, что перечислено ниже, без лишних страниц и описаний.

## 1. Переменные (Figma Variables)

Коллекция «Color», режимы Light и Dark. Имена — строго такие:

| Переменная | Light | Dark |
|---|---|---|
| background | #FFFFFF | #0F1115 |
| foreground | #16181D | #E8EAEE |
| card | #F5F6F8 | #171A21 |
| card-foreground | #16181D | #E8EAEE |
| popover | #FFFFFF | #171A21 |
| popover-foreground | #16181D | #E8EAEE |
| primary | #4F46E5 | #818CF8 |
| primary-foreground | #FFFFFF | #0F1115 |
| secondary | #EEF0F3 | #222631 |
| secondary-foreground | #16181D | #E8EAEE |
| muted | #F5F6F8 | #171A21 |
| muted-foreground | #5B606B | #9AA0AB |
| accent | #EEF0F3 | #222631 |
| accent-foreground | #16181D | #E8EAEE |
| destructive | #B91C1C | #F87171 |
| border | #E2E4E9 | #2A2E37 |
| input | #E2E4E9 | #2A2E37 |
| ring | #4F46E5 | #818CF8 |
| info | #0369A1 | #38BDF8 |
| success | #15803D | #4ADE80 |
| warning | #B45309 | #FBBF24 |

Radius: sm 6, md 8, lg 10, xl 14. Spacing: шаг 4px (4, 8, 12, 16, 24, 32, 48).
В компонентах — только переменные, без «голых» hex.

## 2. Типографика (Text Styles)

Inter (замена system-ui), код — JetBrains Mono.
H1 36/800, H2 24/700, H3 18/700, Body 16/400 (line-height 1.625), Small 14/400, XSmall 12/500, Code 14 mono.
Контейнер — максимум 1152px, отступы 16px; брейкпоинт md = 768px.

## 3. Компоненты (один Component Set на компонент, Auto Layout, иконки Lucide 16px)

- Button — variant: default | secondary | outline | ghost | destructive | link; size: sm 32 | default 36 | lg 40 | icon 36×36; state: default | hover | focus (ring 3px, 50%) | disabled (50%); радиус md, текст 14/500, слот иконки.
- Badge — variant: default | secondary | outline | destructive; pill, 12/500.
- Input — 36px, рамка input, радиус md; state: default | focus | disabled | error (рамка destructive).
- Textarea — как Input, мин. высота 64px.
- Checkbox — 16px, радиус 4; checked: фон primary; с подписью 14px.
- Field — Label 14/500 + поле + текст ошибки 12px destructive.
- Card — фон card, рамка border, радиус xl, отступы 24px; Header (Title + Description), Content, Footer.
- Alert — радиус lg, иконка + Title + Description; variant: default | destructive.

## 4. Общие блоки

- Header — логотип слева, слот навигации (активный пункт foreground, остальные muted-foreground), справа ThemeToggle (Button outline icon, иконка sun-moon); нижняя граница border.
- LinkCard — кликабельная Card: title, description, ряд Badge outline; hover — рамка primary.

## Страницы файла

1. Foundations — свотчи переменных (Light и Dark рядом), текстовые стили, радиусы.
2. Components — каждый Component Set одной сеткой, без отдельных описаний.

Требования: контраст WCAG AA в обеих темах, видимый фокус у интерактивных элементов,
варианты переключаются свойствами, имена на английском как в коде (Button / variant=outline / size=sm).
````
