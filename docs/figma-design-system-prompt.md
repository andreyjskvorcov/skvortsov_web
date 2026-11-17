# Промпт для Figma: дизайн-система и UI-kit

Промпт для ИИ-ассистента в Figma (First Draft / Figma Make), чтобы собрать файл дизайн-системы на основе текущего кита сайта.

- **Источник значений** — код: цвета и радиусы из [`packages/tokens/tokens.css`](../packages/tokens/tokens.css),
  компоненты из [`packages/ui-react/src/components/`](../packages/ui-react/src/components/) (Vue-версия — [`packages/ui-vue`](../packages/ui-vue/)) и [`src/components/blocks/`](../src/components/blocks/).
  Если токены в коде меняются — обновите таблицы в промпте.
- **Как использовать:** скопируйте блок ниже целиком. Если результат получается «плоским», отдавайте разделы по одному:
  сначала 1–2 (переменные и типографика), потом 4, потом 5–6.
- **Figma Make** делает код-прототип, а не нативный файл — для переменных и компонентов с вариантами лучше Figma Design
  (First Draft) или ручная сборка по этому ТЗ.
- **Обратный перенос:** решения из Figma (новые цвета, радиусы, компоненты) переносятся в `packages/tokens/tokens.css` и компоненты пакета —
  имена переменных и вариантов в Figma совпадают с кодом.

````text
Создай файл дизайн-системы и UI-кита для образовательного сайта о фронтенде «skvortsov.web»
(уроки по JavaScript, CSS, Vue и React, проекты, книги). Стиль — спокойный, технический, «документационный»:
много воздуха, чёткая типографика, акцентный индиго-цвет, без декоративных градиентов и теней «на всякий случай».
Кит основан на shadcn/ui — названия токенов и вариантов компонентов должны совпадать с кодом.

## 1. Переменные (Figma Variables)

Коллекция «Color» с двумя режимами: Light и Dark. Имена — строго такие:

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

Коллекция «Radius»: radius-sm 6, radius-md 8, radius-lg 10 (базовый), radius-xl 14.
Коллекция «Spacing»: шаг 4px — 1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 12=48.
Все цвета в компонентах — только через эти переменные, без «голых» hex.

## 2. Типографика (Text Styles)

Шрифт текста — системный sans (в макете используй Inter как замену system-ui), код — моноширинный (JetBrains Mono как замена ui-monospace).
- Heading/H1 — 36px, ExtraBold 800, line-height 1.25
- Heading/H2 — 24px, Bold 700, line-height 1.375
- Heading/H3 — 18px, Bold 700
- Body/Base — 16px, Regular, line-height 1.625
- Body/Small — 14px, Regular
- Body/XSmall — 12px, Medium (бейджи)
- Code/Inline — 0.9em моноширинный на фоне muted, радиус sm, отступы 2×5px
- Code/Block — 14px моноширинный, тёмная подложка (тема GitHub Dark), отступ 16px, радиус md

## 3. Сетка и адаптив

Контейнер страницы — максимум 1152px, боковые отступы 16px, по центру. Брейкпоинт md = 768px.
Страница урока: сайдбар 240px + контент до 768px, расстояние 48px; на мобильном — одна колонка.
Сетка карточек: колонки минимум 256px, автозаполнение, gap 16px.

## 4. Базовые компоненты (Components с вариантами — Auto Layout везде)

Button
- variant: default (bg primary / text primary-foreground) | secondary | outline (рамка border, фон background) | ghost | destructive | link
- size: xs 24px | sm 32px | default 36px | lg 40px | icon 36×36 | icon-sm 32 | icon-lg 40
- state: default | hover (primary 90% / accent) | focus (кольцо ring 3px, 50% прозрачности) | disabled (50% прозрачности)
- слот иконки слева, иконки Lucide 16px, радиус md, текст 14px Medium

Badge — variant: default | secondary | outline | destructive | ghost; высота ~22px, pill (radius full), 12px Medium, слот иконки 12px

Input — высота 36px, рамка input, радиус md; state: default | focus (ring) | disabled | error (рамка destructive); с плейсхолдером muted-foreground

Card — подложка card, рамка border, радиус xl, тень едва заметная; составные части: Header (Title 16px SemiBold + Description muted 14px), Content, Footer; внутренние отступы 24px, gap 24px

Alert — радиус lg, рамка border, иконка 16px + Title + Description; variant: default | destructive

## 5. Компоненты сайта (собраны из базовых)

- Header: логотип «skvortsov.web» (ExtraBold), навигация (Проекты, Книги, Гайд, UI-kit; активный пункт — foreground, остальные — muted-foreground), справа ThemeToggle — кнопка outline icon. Нижняя граница border.
- ThemeToggle: кнопка outline icon с иконкой sun-moon.
- LinkCard: Card целиком кликабельная; hover — рамка primary; title, description, ряд Badge outline снизу.
- Callout (плашка в уроке): Alert с левой границей 4px и цветной иконкой; type: info (info, иконка info) | tip (success, lightbulb) | warning (warning, triangle-alert) | danger (destructive, circle-alert). Заголовок по умолчанию: «Заметка», «Совет», «Внимание», «Опасно».
- Quiz (вопрос-квиз): карточка card, бейдж «Вопрос» вверху; текст вопроса с блоком кода; список вариантов — строки-кнопки с моноширинным текстом. Состояния: не отвечено (hover — рамка primary) | верно (выбранный вариант: рамка success, фон success 10%, иконка check; бейдж «Верно») | неверно (выбранный: рамка destructive, фон destructive 10%, иконка x; правильный подсвечен success; остальные 60% прозрачности; бейдж «Неверно»). После ответа — блок пояснения и ghost-кнопка «Ответить заново».
- Task (задача): карточка card; бейджи «Задача» + сложность (Лёгкая/Средняя/Сложная); заголовок; условие с кодом; кнопки-раскрывашки outline sm «Подсказка» (иконка lightbulb) и «Показать ответ» (chevron-down); открытое состояние — «Скрыть ответ», под ним код решения и пояснение.
- BackToTop: круглая outline-кнопка 40px с arrow-up, фиксирована справа снизу, тень md; состояния hidden | visible.
- BookCard: Card с необязательной обложкой 3:4, названием, автором и годом, описанием, кнопками «Читать» (default sm) и «PDF, 9.2 МБ» (outline sm), тегами; вариант с бейджем «Личная — только локально».
- ProjectCard: LinkCard с бейджами стека (React/Vue/JavaScript) и типа (Остров/Приложение).
- Pager урока: верхняя граница, слева «← Предыдущий урок», справа «Следующий урок →» цветом primary.

## 6. Страницы файла

1. Cover — название системы, версия, дата.
2. Foundations — палитра (свотчи всех переменных в Light и Dark рядом, с подписью имени и hex), типографика, радиусы, отступы, иконки (Lucide, 16/20/24).
3. Components — каждый компонент: матрица всех вариантов × размеров × состояний, плюс короткое описание «когда использовать».
4. Patterns — Callout, Quiz, Task, BackToTop, карточки.
5. Templates — макеты страниц в Light и Dark, десктоп 1440 и мобильный 390:
   главная (hero «Фронтенд: от основ до продакшена» + кнопки + сетка разделов), список уроков раздела,
   страница урока (сайдбар, статья, Callout, Quiz, Task, пагинация), список проектов, список книг, читалка книги, страница UI-kit.

## 7. Требования к качеству

- Контраст текста WCAG AA (4.5:1 для обычного текста) в обеих темах; проверь muted-foreground на card и muted.
- Видимый фокус (ring) у всех интерактивных элементов.
- Минимальная зона нажатия на мобильном — 40×40.
- Каждый вариант компонента реально переключается свойствами (Variants/Properties), без отдельных несвязанных копий.
- Имена компонентов и свойств — на английском, как в коде (Button / variant=outline / size=sm).
````
