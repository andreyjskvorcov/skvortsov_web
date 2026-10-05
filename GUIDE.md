# Руководство по проекту

Как устроен сайт skvortsov.web, как с ним работать, что и как добавлять, и каких правил держаться.

Этот же файл выводится на сайте страницей `/guide` (`src/pages/guide.astro`) — правьте только его.

## Содержание

- [Стек](#стек)
- [Запуск и команды](#запуск-и-команды)
- [Структура](#структура)
- [Стили и тема](#стили-и-тема)
- [UI-kit (shadcn/ui)](#ui-kit-shadcnui)
- [Уроки](#уроки)
- [Проекты](#проекты)
- [Можно и нельзя](#можно-и-нельзя)
- [Частые проблемы](#частые-проблемы)

## Стек

| Что | Чем | Зачем |
|---|---|---|
| Сайт | Astro 5 | Статичные страницы, по умолчанию без JS |
| Стили | Tailwind CSS v4 | Утилиты вместо своих CSS-файлов |
| UI-kit | shadcn/ui (React) | Готовые компоненты, код лежит в проекте |
| Интерактив | React 19, Vue 3 | Острова внутри страниц и самостоятельные приложения |
| Контент | MDX + Content Collections | Уроки и описания проектов с проверкой frontmatter |
| Приложения | Vite + npm workspaces | Проекты со своими зависимостями в `apps/*` |

Нужен Node 20.3+ или 22+.

## Запуск и команды

```sh
npm install        # ставит зависимости сайта и всех приложений из apps/*
npm run dev        # http://localhost:4321
npm run build      # сборка в dist/
npm run preview    # просмотр собранного сайта
npm run check      # проверка типов (astro check)
```

| Команда | Что делает |
|---|---|
| `npm run build:apps` | Собирает все приложения из `apps/*` в `public/apps/<slug>/` |
| `npm run dev -w @apps/<slug>` | Запускает одно приложение отдельно, с горячей перезагрузкой |
| `npx shadcn@latest add <имя>` | Добавляет компонент shadcn в `src/components/ui/` |

`build:apps` запускается автоматически перед `dev` и `build` (скрипты `predev` и `prebuild`).

## Структура

```
app/
├─ apps/                        # самостоятельные приложения (npm workspaces)
│  └─ <slug>/                   # свой package.json, vite.config.ts, src/
├─ public/
│  └─ apps/                     # сборка приложений — генерируется, в git не попадает
├─ src/
│  ├─ components/
│  │  ├─ ui/                    # компоненты shadcn/ui (button.tsx, card.tsx, …)
│  │  ├─ blocks/                # свои блоки сайта: Header, ThemeToggle, LinkCard, Callout
│  │  └─ demos/{react,vue}/     # маленькие демки для уроков
│  ├─ content/lessons/<section>/<slug>.mdx   # уроки
│  ├─ projects/<slug>/index.mdx              # описания проектов
│  ├─ layouts/                  # BaseLayout (шапка, тема), DocsLayout (уроки)
│  ├─ lib/                      # sections.ts (разделы уроков), projects.ts (подписи, appUrl)
│  ├─ pages/                    # маршруты: /, /learn, /projects, /ui-kit, /guide
│  └─ styles/
│     ├─ tokens.css             # цвета и радиусы — единый источник темы
│     └─ global.css             # подключение Tailwind, базовые стили, prose
├─ components.json              # настройки shadcn CLI
├─ GUIDE.md                     # этот гайд (страница /guide)
└─ astro.config.mjs
```

| Адрес | Файл |
|---|---|
| `/` | `src/pages/index.astro` |
| `/learn`, `/learn/<section>` | `src/pages/learn/index.astro`, `src/pages/learn/[section]/index.astro` |
| `/learn/<section>/<slug>` | `src/pages/learn/[...slug].astro` → `DocsLayout` |
| `/projects`, `/projects/<slug>` | `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro` |
| `/ui-kit` | `src/pages/ui-kit/index.astro` — витрина компонентов и токенов |
| `/guide` | `src/pages/guide.astro` — этот гайд, рендерится из `GUIDE.md` |
| `/apps/<slug>/index.html` | собранное приложение из `apps/<slug>/` |

## Стили и тема

### Токены

Все цвета живут в [`src/styles/tokens.css`](src/styles/tokens.css) и названы по схеме shadcn:
`--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--border` и т.д.,
плюс свои статусы `--info`, `--success`, `--warning`.

Из них Tailwind делает утилиты: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`,
`border-border`, `text-success`… Радиусы считаются от `--radius` (`rounded-sm` … `rounded-xl`).

Чтобы поменять палитру — правьте значения в `tokens.css` (`:root` для светлой темы и `[data-theme='dark']` для тёмной).
Новый цвет добавляется в трёх местах: в `:root`, в `[data-theme='dark']` и строкой `--color-<имя>: var(--<имя>)` в `@theme inline`.

### Тёмная тема

- Тема хранится в атрибуте `data-theme` на `<html>`; её ставит скрипт в `BaseLayout` до отрисовки и переключает `ThemeToggle`.
- Вариант `dark:` в Tailwind настроен на этот атрибут, а не на системную тему: `dark:bg-input/30`.
- Цвета из токенов переключаются сами — писать `dark:` для них не нужно.

### Как писать стили

- Стили пишутся классами Tailwind прямо в разметке.
- Для ширины контента страницы есть утилита `page-container` (центрирование, `max-w-6xl`, `px-4`).
- Текст уроков оформляется плагином typography: контент урока уже обёрнут в `prose`.
  Если вставляете в урок свой компонент, добавьте ему `not-prose`, чтобы стили статьи его не задевали.
- Заголовки `h1`–`h3` получают базовые размеры из `global.css`.

## UI-kit (shadcn/ui)

Компоненты shadcn — это не npm-пакет, а исходники в [`src/components/ui/`](src/components/ui/). Их можно читать и править.

### Добавить компонент

```sh
npx shadcn@latest add dialog
```

Файл появится в `src/components/ui/`, нужные зависимости установятся сами.
Потом покажите компонент на странице `/ui-kit`.

> CLI импортирует `cn` из пакета `cn` (официальная замена `clsx` + `tailwind-merge` от shadcn) — это нормально,
> `lib/utils.ts` в проекте нет и не нужен.

### Использовать в `.astro`

```astro
---
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
---

<Badge variant="secondary">Новое</Badge>

<Card>
  <CardHeader><CardTitle>Заголовок</CardTitle></CardHeader>
</Card>

<!-- ссылка, оформленная как кнопка -->
<a class={buttonVariants({ variant: 'outline' })} href="/learn">Учиться</a>
```

- Без `client:*` компонент рендерится в статичный HTML и **не грузит JS** — так и нужно для всего, что не интерактивно.
- Для интерактива (Dialog, Select, Tabs, свои компоненты с состоянием) нужен остров: `<Dialog client:load />`.
  Каждый такой остров грузит React на страницу.
- Ссылки-кнопки делаются через `buttonVariants`. `<Button asChild>` из `.astro` **не работает**:
  Astro передаёт детей в React как готовый HTML, а не как React-элемент.
- В `className` можно переопределять классы компонента — конфликты разрешит `cn`: `<Card className="p-2">`.

### Свои блоки

Компоненты сайта, собранные из shadcn, лежат в [`src/components/blocks/`](src/components/blocks/):

| Блок | Что делает |
|---|---|
| `Header.astro` | Шапка и навигация. Новый пункт меню — в массив `nav` |
| `ThemeToggle.astro` | Переключатель темы |
| `LinkCard.astro` | Карточка-ссылка: `title`, `href`, `description`, `badges` |
| `Callout.tsx` | Плашка в уроках на базе `Alert`: `type` = `info` / `tip` / `warning` / `danger`, `title` |
| `Quiz.tsx` | Вопрос-квиз в уроках: варианты ответа, проверка, пояснение — см. [Вопросы-квизы](#вопросы-квизы) |
| `Task.astro` | Задача в уроках: условие, подсказка и ответ под кнопкой — см. [Задачи с ответом](#задачи-с-ответом) |

Правило: в `ui/` — только компоненты shadcn (их может перезаписать `shadcn add`), всё своё — в `blocks/`.

### Vue

shadcn/ui — React-компоненты, во Vue их использовать нельзя. Во Vue-коде оформляйте элементы теми же
Tailwind-классами на токенах (`bg-primary text-primary-foreground`, `bg-card`, `border` …) — вид и тема совпадут.
Если понадобятся готовые сложные компоненты для Vue, можно поставить [shadcn-vue](https://www.shadcn-vue.com/)
на те же токены.

## Уроки

### Добавить урок

Создайте `src/content/lessons/<section>/<slug>.mdx`:

```mdx
---
title: Промисы
description: Как работают промисы и async/await
section: js            # js | vue | react | frontend
order: 3               # порядок в сайдбаре
level: middle          # beginner | middle | advanced (по умолчанию beginner)
tags: [async]
draft: false           # true — урок не публикуется
---

import Callout from '@/components/blocks/Callout.tsx';

Текст урока в Markdown.

<Callout type="tip">Подсказка для читателя.</Callout>
```

Урок появится по адресу `/learn/js/<slug>`, в сайдбаре раздела и в навигации «назад / вперёд».
Неверный frontmatter остановит сборку с понятной ошибкой — схема в [`src/content.config.ts`](src/content.config.ts).

### Демки в уроках

Маленькие интерактивные примеры кладутся в `src/components/demos/react/` или `src/components/demos/vue/`
и подключаются островом:

```mdx
import Counter from '@/components/demos/vue/Counter.vue';

<Counter client:visible />
```

| Директива | Когда грузится JS |
|---|---|
| `client:visible` | Когда демка появилась на экране — **по умолчанию для уроков** |
| `client:load` | Сразу при загрузке страницы |
| `client:only="react"` / `"vue"` | Только в браузере, без серверного рендера (если компонент трогает `window`) |

Без директивы компонент отрендерится, но кнопки работать не будут.

### Вопросы-квизы

В конце урока можно добавить блок «Проверь себя» — вопросы с вариантами ответа.
После выбора подсвечивается правильный вариант и показывается пояснение; ответ сохраняется в браузере.

```mdx
import Quiz from '@/components/blocks/Quiz.tsx';

## Проверь себя

<Quiz client:visible id="js/closures/var-loop" options={['0 1 2', '3 3 3', '2 2 2']} answer={1}>
  Что выведет код?

  ```js
  for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
  ```

  <Fragment slot="explanation">
    У `var` одна переменная `i` на всю функцию…
  </Fragment>
</Quiz>
```

| Проп / часть | Что это |
|---|---|
| `client:visible` | Обязательно — без него кнопки не работают |
| `id` | Уникальный на весь сайт, по нему хранится ответ. Формат: `<раздел>/<урок>/<вопрос>` |
| `options` | Варианты ответа — строки, показываются моноширинным шрифтом |
| `answer` | Индекс правильного варианта, **с нуля** |
| Содержимое тега | Текст вопроса, обычный Markdown: абзацы, код с подсветкой |
| `<Fragment slot="explanation">` | Пояснение после ответа, тоже Markdown. Необязательно |

Внутри тега оставляйте пустые строки вокруг абзацев и блоков кода — иначе MDX не разберёт Markdown.
Если поменяли варианты ответа у существующего вопроса, смените и `id`, чтобы у читателей не остался старый ответ.

### Задачи с ответом

Задачи на написание кода — компонент `Task`. Подсказка и ответ спрятаны под кнопками и раскрываются по клику.
Компонент работает на нативном `<details>`, поэтому JS на страницу не добавляет и директива `client:*` не нужна.

```mdx
import Task from '@/components/blocks/Task.astro';

## Задачи

<Task title="once(fn)" level="easy">
  Напишите функцию `once(fn)`, которая вызывает `fn` только один раз.

  <Fragment slot="hint">
    Храните в замыкании флаг «уже вызывали».
  </Fragment>

  <Fragment slot="solution">
    ```js
    function once(fn) { … }
    ```

    Пояснение к решению.
  </Fragment>
</Task>
```

| Проп / часть | Что это |
|---|---|
| `title` | Название задачи |
| `level` | Сложность: `easy` / `medium` / `hard`. Необязательно |
| Содержимое тега | Условие, Markdown: абзацы, код с примерами |
| `<Fragment slot="hint">` | Подсказка. Необязательно — без неё кнопки не будет |
| `<Fragment slot="solution">` | Ответ: код решения и пояснение |

Квиз или задача? Квиз — когда ответ можно выбрать из вариантов («что выведет код?»),
задача — когда нужно написать код самому.

### Новый раздел уроков

1. Добавить раздел в `sections` в [`src/lib/sections.ts`](src/lib/sections.ts).
2. Добавить его id в `z.enum` поля `section` в `src/content.config.ts`.
3. При необходимости — пункт в `nav` в `Header.astro`.

## Проекты

Раздел `/projects` поддерживает два формата. Оба описываются файлом `src/projects/<slug>/index.mdx`.

| | Остров (`type: island`) | Приложение (`type: app`) |
|---|---|---|
| Где код | `src/projects/<slug>/` рядом с описанием | `apps/<slug>/` — отдельный Vite-проект |
| Как показывается | Прямо на странице проекта | В iframe + кнопка «Открыть отдельно» |
| Зависимости | Только те, что есть у сайта | Свои, в `apps/<slug>/package.json` |
| Роутер | Нет | Любой (используйте hash-историю) |
| UI-kit | React — напрямую, Vue — токены и классы | Через алиас и общие токены (см. ниже) |
| Когда выбирать | Небольшой виджет или демо | Готовое приложение, свой роутер, тяжёлые библиотеки, Quasar/Element Plus |

Сейчас все три примера (`todo-react`, `stopwatch-vue`, `notes-vue`) — приложения.

### Frontmatter проекта

```yaml
title: Погода
description: Прогноз погоды на Vue и Quasar
stack: vue            # react | vue | js
type: app             # island | app
order: 4              # порядок в списке
tags: [quasar, api]
repo: https://github.com/…   # необязательно — появится кнопка «Исходники»
draft: false
```

Текст после frontmatter — описание проекта, показывается под приложением.

### Добавить проект-остров

```
src/projects/my-widget/
├─ index.mdx
└─ App.tsx        # или App.vue
```

```mdx
---
title: Мой виджет
description: …
stack: react
type: island
order: 5
---

import App from './App.tsx';

<App client:load />

## Как устроено

…
```

Добавьте корневому элементу `not-prose`, иначе на него повлияют стили описания.

### Добавить проект-приложение

1. Создайте `apps/<slug>/` — проще всего скопировать похожий пример:
   `notes-vue` (Vue + роутер, свои стили), `stopwatch-vue` (Vue + Tailwind на токенах сайта),
   `todo-react` (React + shadcn-кит сайта).
2. В `apps/<slug>/package.json` задайте имя `@apps/<slug>`, скрипт `build` и зависимости.
3. В `apps/<slug>/vite.config.ts` обязательно:

   ```ts
   export default defineConfig({
     base: '/apps/<slug>/',
     build: { outDir: '../../public/apps/<slug>', emptyOutDir: true },
     // …плагины
   });
   ```

4. Создайте `src/projects/<slug>/index.mdx` с `type: app`. `<slug>` должен совпадать с именем папки в `apps/`.
5. Выполните `npm install` (подключит новый workspace) и `npm run dev`.

Правила для приложений:

- **Роутер — только на hash-истории** (`createWebHashHistory`, `createHashRouter`).
  Иначе обновление страницы на внутреннем маршруте даст 404: статический хостинг не знает о маршрутах приложения.
- **Версии Vite держите на той же мажорной, что у Astro** (сейчас Vite 6). Пакеты, требующие Vite 7+
  (например, `vue-router@5`), npm не установит. Проверить версию: `npm ls vite`.
- **Тема**: скопируйте `src/theme.ts` из любого примера и вызовите `syncTheme()` до монтирования —
  в iframe приложение будет повторять тему сайта, отдельно — системную.

#### UI-kit сайта в приложении

Пример — `apps/todo-react`:

- `vite.config.ts`: алиас `'@'` → `../../src`, тогда работают импорты `@/components/ui/button`;
- `src/style.css`:

  ```css
  @import 'tailwindcss';
  @import '../../../src/styles/tokens.css';
  @custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));
  @source '../../../src/components/ui';
  ```

Для Vue-приложения достаточно Tailwind и `tokens.css` (как в `stopwatch-vue`).
Приложение со своим UI (Quasar, Element Plus) может вообще не подключать кит — как `notes-vue`.

#### Перенос существующего приложения

1. Скопировать проект в `apps/<slug>/` без `node_modules`, `dist` и lock-файла.
2. Переименовать пакет в `@apps/<slug>`, поправить `base` и `outDir` в конфиге сборщика.
3. Перевести роутер на hash-историю.
4. Привести версию Vite к версии сайта.
5. Не переносится как статика: SSR-фреймворки с сервером (Nuxt с `server/`, Next) —
   такие приложения хостятся отдельно, а в проекте остаётся только описание со ссылкой `repo`.

## Можно и нельзя

### Можно

- Писать стили классами Tailwind и брать цвета из токенов.
- Использовать shadcn-компоненты в `.astro` без `client:*` — это просто HTML.
- Править компоненты в `src/components/ui/` под себя.
- Смешивать React и Vue на сайте: `.tsx` обрабатывает React, `.vue` — Vue.
- Добавлять любые зависимости в приложения из `apps/` — на сайт они не влияют.

### Нельзя (или не стоит)

| Не делайте | Почему | Как надо |
|---|---|---|
| Писать цвета хексами (`bg-[#4f46e5]`, `color: #fff`) | Не переключатся в тёмной теме | Утилиты на токенах: `bg-primary` |
| Добавлять `<style>` в `.astro` для того, что можно сделать классами | Scoped-стили сильнее утилит и ломают переопределение | Классы Tailwind |
| Класть свои компоненты в `src/components/ui/` | `shadcn add` может их перезаписать | `src/components/blocks/` |
| Использовать `<Button asChild>` в `.astro` | Не работает: дети приходят как HTML | `<a class={buttonVariants()}>` |
| Ставить `client:load` на всё подряд | Каждый остров тянет JS фреймворка | Без директивы для статики, `client:visible` для демок |
| Использовать shadcn/ui во Vue | Это React-компоненты | Tailwind-классы на токенах или shadcn-vue |
| Писать JSX во Vue-компонентах | JSX на сайте обрабатывает только React | Шаблоны `<template>` |
| Использовать `createWebHistory` / `BrowserRouter` в приложениях | 404 при обновлении страницы | Hash-история |
| Ставить в приложения пакеты, требующие Vite 7+ | Конфликт с Vite 6 у Astro, `npm install` упадёт | Версии, совместимые с Vite 6 |
| Коммитить `public/apps/` | Это результат сборки | Собирается `build:apps` |
| Импортировать в Astro-сайт код из `apps/` | Приложения исключены из tsconfig и Tailwind сайта | Общий код держать в `src/`, приложения импортируют его через алиас |

## Частые проблемы

**Проект показывает 404 `/apps/<slug>/`.**
Приложение не собрано — перезапустите `npm run dev` (сработает `predev`) или выполните `npm run build:apps`.
Проверьте, что `<slug>` совпадает в `apps/`, `src/projects/` и в `base` / `outDir` конфига.

**Изменения в приложении не видны на сайте в dev.**
Приложения собираются один раз при старте. Для разработки запускайте приложение отдельно:
`npm run dev -w @apps/<slug>`, затем `npm run build:apps`.

**Класс Tailwind не применяется.**
Tailwind генерирует только классы, которые видит в исходниках целиком. Не собирайте имена из кусков
(`` `bg-${color}` ``) — пишите полные имена в объекте. Для приложений проверьте `@source` в их `style.css`.

**Компонент в уроке выглядит не так, как на `/ui-kit`.**
На него действуют стили `prose` — добавьте корневому элементу `not-prose`.

**Кнопка в демке или квизе не реагирует на клик.**
У острова нет директивы `client:*`. (`Task` директива не нужна — он работает без JS.)

**`npm install` падает с `ERESOLVE`.**
Какой-то пакет в `apps/*` требует другую версию Vite или React — смотрите строку `Conflicting peer dependency`
и подберите совместимую версию пакета.
