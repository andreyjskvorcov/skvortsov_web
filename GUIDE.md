# Руководство по проекту

Как устроен сайт skvortsov.web, как с ним работать, что и как добавлять, и каких правил держаться.

Этот же файл выводится на сайте страницей `/guide` (`src/pages/guide.astro`) — правьте только его.

## Содержание

- [Стек](#стек)
- [Запуск и команды](#запуск-и-команды)
- [Структура](#структура)
- [Стили и тема](#стили-и-тема)
- [UI-kit (shadcn/ui)](#ui-kit-shadcnui)
- [Общий код: утилиты, типы, localStorage](#общий-код-утилиты-типы-localstorage)
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
| `cd packages/ui-react && npx shadcn@latest add <имя>` | Добавляет компонент shadcn в пакет `@skvortsov/ui-react` |

`build:apps` запускается автоматически перед `dev` и `build` (скрипты `predev` и `prebuild`).

## Структура

```
app/
├─ packages/                    # общие пакеты (npm workspaces) — для сайта и приложений
│  ├─ tokens/                   # @skvortsov/tokens — цвета, радиусы, шрифты, тёмная тема
│  ├─ ui-react/                 # @skvortsov/ui-react — компоненты shadcn/ui (button, card, …)
│  ├─ ui-vue/                   # @skvortsov/ui-vue — те же компоненты на shadcn-vue
│  └─ shared/                   # @skvortsov/shared — код без UI: localStorage, тема, утилиты, типы, хуки
├─ apps/                        # самостоятельные приложения (npm workspaces)
│  └─ <slug>/                   # свой package.json, vite.config.ts, src/
├─ public/
│  └─ apps/                     # сборка приложений — генерируется, в git не попадает
├─ src/
│  ├─ components/
│  │  ├─ blocks/                # свои блоки сайта: Header, ThemeToggle, LinkCard, Callout
│  │  └─ demos/{react,vue}/     # маленькие демки для уроков
│  ├─ content/lessons/<section>/<slug>.mdx   # уроки (разделы — в lib/sections.ts)
│  ├─ projects/<slug>/index.mdx              # описания проектов
│  ├─ layouts/                  # BaseLayout (шапка, тема), DocsLayout (уроки)
│  ├─ lib/                      # sections.ts (разделы уроков), projects.ts (подписи, appUrl)
│  ├─ pages/                    # маршруты: /, /learn, /projects, /ui-kit, /guide
│  └─ styles/
│     └─ global.css             # подключение Tailwind, токенов и кита, базовые стили, prose
├─ GUIDE.md                     # этот гайд (страница /guide)
└─ astro.config.mjs
```

| Адрес | Файл |
|---|---|
| `/` | `src/pages/index.astro` — пока пустая, место под лендинг |
| `/learn`, `/learn/<section>` | `src/pages/learn/index.astro` — список разделов (пункт «Обучение» в шапке), `src/pages/learn/[section]/index.astro` |
| `/learn/<section>/<slug>` | `src/pages/learn/[...slug].astro` → `DocsLayout` |
| `/projects`, `/projects/<slug>` | `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro` |
| `/ui-kit` | `src/pages/ui-kit/index.astro` — витрина компонентов и токенов |
| `/guide` | `src/pages/guide.astro` — этот гайд, рендерится из `GUIDE.md` |
| `/apps/<slug>/index.html` | собранное приложение из `apps/<slug>/` |

## Стили и тема

### Токены

Все цвета живут в пакете [`packages/tokens/tokens.css`](packages/tokens/tokens.css) и названы по схеме shadcn:
`--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--border` и т.д.,
плюс свои статусы `--info`, `--success`, `--warning`.

Из них Tailwind делает утилиты: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`,
`border-border`, `text-success`… Радиусы считаются от `--radius` (`rounded-sm` … `rounded-xl`).

Чтобы поменять палитру — правьте значения в `tokens.css` (`:root` для светлой темы и `[data-theme='dark']` для тёмной).
Новый цвет добавляется в трёх местах: в `:root`, в `[data-theme='dark']` и строкой `--color-<имя>: var(--<имя>)` в `@theme inline`.

### Тёмная тема

- Тема хранится в атрибуте `data-theme` на `<html>`; её ставит скрипт в `BaseLayout` до отрисовки и переключает `ThemeToggle`.
- Выбор пользователя сохраняется в `localStorage` под ключом `THEME_STORAGE_KEY` (`'theme'`) из `@skvortsov/shared/theme`.
  `ThemeToggle` вызывает `toggleTheme()` оттуда же, а inline-скрипт в `BaseLayout` получает ключ через `define:vars`
  (inline-скрипт выполняется до загрузки модулей и импортировать их не может).
- Вариант `dark:` в Tailwind настроен на этот атрибут, а не на системную тему: `dark:bg-input/30`.
- Цвета из токенов переключаются сами — писать `dark:` для них не нужно.

### Как писать стили

- Стили пишутся классами Tailwind прямо в разметке.
- Для ширины контента страницы есть утилита `page-container` (центрирование, `max-w-6xl`, `px-4`).
- Текст уроков оформляется плагином typography: контент урока уже обёрнут в `prose`.
  Если вставляете в урок свой компонент, добавьте ему `not-prose`, чтобы стили статьи его не задевали.
- Заголовки `h1`–`h3` получают базовые размеры из `global.css`.

## UI-kit (shadcn/ui)

Компоненты shadcn лежат исходниками в пакете [`packages/ui-react/`](packages/ui-react/) (`@skvortsov/ui-react`).
Их можно читать и править — изменения сразу видны и на сайте, и в приложениях, которые используют пакет.

### Пакеты

Кит разделён на пакеты npm workspaces — их подключают и сайт, и приложения из `apps/`:

| Пакет | Что внутри | Как подключить |
|---|---|---|
| `@skvortsov/tokens` | токены цветов и радиусов, шрифты, вариант `dark:` от `data-theme` | в CSS: `@import '@skvortsov/tokens/tokens.css';` |
| `@skvortsov/ui-react` | React-компоненты shadcn/ui | в CSS: `@import '@skvortsov/ui-react/styles.css';`, в коде: `import { Button } from '@skvortsov/ui-react/button'` |
| `@skvortsov/ui-vue` | те же компоненты для Vue (shadcn-vue) | в CSS: `@import '@skvortsov/ui-vue/styles.css';`, в коде: `import { Button } from '@skvortsov/ui-vue/button'` |
| `@skvortsov/shared` | код без UI: localStorage, тема, утилиты, типы, хуки React/Vue | в коде: `import { createStorage } from '@skvortsov/shared/storage'` — см. [Общий код](#общий-код-утилиты-типы-localstorage) |

`styles.css` пакета нужен, чтобы Tailwind увидел классы компонентов: пакеты он по умолчанию не сканирует.

Пакеты не собираются отдельно — это исходники TypeScript, которые компилирует Vite того, кто их импортирует.

### Откуда компоненты

shadcn — это не библиотека, а генератор: CLI копирует код компонента в проект, и дальше это **наш код**.

- `button`, `badge`, `card`, `alert`, `input` в `packages/ui-react` созданы `npx shadcn@latest add`,
  те же компоненты в `packages/ui-vue` — `npx shadcn-vue@latest add`.
- Из npm приходят только их зависимости (прописаны в `package.json` пакета, не в корне):

  | Зависимость | Зачем |
  |---|---|
  | `radix-ui` (React) / `reka-ui` (Vue, порт Radix) | поведение компонентов; сейчас используется только `Slot` для пропа `asChild` |
  | `class-variance-authority` | варианты: `variant="outline"`, `size="sm"` |
  | `cn` | склейка и слияние классов Tailwind |

- `asChild` отдаёт классы кнопки дочернему элементу: `<Button asChild><a href="/guide">Гайд</a></Button>`
  выглядит как кнопка, но в разметке остаётся ссылкой.
- Внешний вид — наш: компоненты пишут `bg-primary`, `border-border`, а значения берутся из `@skvortsov/tokens`.
- **shadcn сам не обновляется** — `npm update` код компонентов не меняет. Чтобы взять новую версию,
  повторите `add` с перезаписью и посмотрите diff: ваши правки в файле перезапишутся.
- Свои компоненты поверх кита — `Callout`, `Quiz`, `Task`, `LinkCard`, `ThemeToggle`, `BackToTop` —
  к shadcn не относятся, см. [Свои блоки](#свои-блоки).

### Добавить компонент

```sh
cd packages/ui-react
npx shadcn@latest add dialog
```

Файл появится в `packages/ui-react/src/components/`, нужные зависимости установятся сами.
Чтобы компонент был доступен и через общий импорт `@skvortsov/ui-react`, добавьте строку в `packages/ui-react/src/index.ts`.
Потом покажите компонент на странице `/ui-kit`.

> CLI импортирует `cn` из пакета `cn` (официальная замена `clsx` + `tailwind-merge` от shadcn) — это нормально,
> `lib/utils.ts` в проекте нет и не нужен.

### Использовать в `.astro`

```astro
---
import { Badge } from '@skvortsov/ui-react/badge';
import { buttonVariants } from '@skvortsov/ui-react/button';
import { Card, CardHeader, CardTitle } from '@skvortsov/ui-react/card';
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

Для Vue есть свой пакет — `@skvortsov/ui-vue` на [shadcn-vue](https://www.shadcn-vue.com/). Компоненты те же
(button, badge, card, alert, input), с теми же вариантами и размерами и на тех же токенах, поэтому выглядят как React-версия.
Сравнить их можно на странице `/ui-kit` — там есть раздел «Vue-версия».

```vue
<script setup lang="ts">
import { Button } from '@skvortsov/ui-vue/button';
import { Card, CardContent } from '@skvortsov/ui-vue/card';
</script>

<template>
  <Card>
    <CardContent>
      <Button variant="outline" @click="save">Сохранить</Button>
    </CardContent>
  </Card>
</template>
```

Добавить компонент в Vue-пакет:

```sh
cd packages/ui-vue
npx shadcn-vue@latest add dialog
```

Файлы появятся в `packages/ui-vue/src/components/<имя>/`. После этого проверьте, что новые зависимости компонента
(например, `reka-ui`, `@vueuse/core`) есть в `packages/ui-vue/package.json`, и выполните `npm install` в `app/`.

> **CLI shadcn-vue требует Node.js 22** (на Node 20 падает с ошибкой в `undici`). Если проект на Node 20 — запустите
> CLI под Node 22 только для этой команды, например через nvm: `nvm exec 22 npx shadcn-vue@latest add dialog`.
> Сами компоненты работают и на Node 20. Свежий `@vueuse/core` 15 тоже требует Node 22, поэтому в пакете стоит версия 14.

**Два пакета — две реализации.** `Button` существует и в `ui-react`, и в `ui-vue`. Если меняете вид компонента
(классы в `buttonVariants`, отступы, радиусы) — поменяйте его в **обоих** пакетах, иначе React- и Vue-версии разойдутся.
Цвета и радиусы лучше менять в `@skvortsov/tokens`: они общие и сразу применятся везде.

## Общий код: утилиты, типы, localStorage

Пакет [`packages/shared/`](packages/shared/) (`@skvortsov/shared`) — общий код **без UI и без стилей**
для сайта и всех приложений. Импорт — по подпутям, как у кита:

| Подпуть | Что внутри |
|---|---|
| `@skvortsov/shared/storage` | `createStorage(namespace)` — безопасный localStorage; `readRaw` / `writeRaw` / `removeRaw` для сырых строк |
| `@skvortsov/shared/theme` | `THEME_STORAGE_KEY`, `getTheme`, `setTheme`, `toggleTheme`, `getStoredTheme` — для сайта; `syncTheme` — для приложений |
| `@skvortsov/shared/utils` | чистые функции: `plural` (склонение «1 урок / 3 урока / 5 уроков»), `clamp`, `debounce` |
| `@skvortsov/shared/types` | обобщённые типы: `Nullable<T>`, `Maybe<T>`, `ValueOf<T>`, `AsyncState<T>` |
| `@skvortsov/shared/react` | хук `useLocalStorage` |
| `@skvortsov/shared/vue` | composable `useLocalStorage` |

Подключение в приложении — зависимость `"@skvortsov/shared": "*"` в его `package.json` и `npm install` в корне `app/`.
React и Vue у пакета — необязательные peer-зависимости: Vue-приложение импортирует `/vue` и про React ничего не знает.

### Направление зависимостей

```
tokens  ←  ui-react / ui-vue
shared  ←  ui-react / ui-vue, сайт, apps
```

`shared` ничего не импортирует из кита, сайта и приложений. Ядро (`storage`, `theme`, `utils`, `types`) — обычный
TypeScript без фреймворков; `react/` и `vue/` — тонкие обёртки над ним, поэтому логика одна для обоих.

### localStorage

**Сайт и приложения открыты с одного домена (приложения — в iframe), поэтому localStorage у них общий.**
Ключ `items` из двух приложений перезапишет друг друга. Поэтому напрямую `localStorage` не используем —
только через хранилище со своим пространством имён:

```ts
import { createStorage } from '@skvortsov/shared/storage';

// На уровне модуля, не внутри компонента. Имя — slug приложения или название блока сайта
const storage = createStorage('todo-react'); // ключи вида todo-react:<key>

storage.get<Todo[]>('todos', []); // значение или [] — если ключа нет или JSON битый
storage.set('todos', todos); // JSON внутри
storage.remove('todos');
const off = storage.subscribe('todos', () => {}); // изменения из этой вкладки, других вкладок и iframe
```

Что хранилище делает само:

- не падает при SSR (нет `window`) и в браузерах, где localStorage запрещён или переполнен, —
  тогда значение живёт в памяти до перезагрузки;
- хранит значения в JSON, битый JSON возвращает значение по умолчанию;
- сообщает об изменениях всем подписчикам: в этой вкладке — сразу при `set`, из других вкладок и iframe — через событие `storage`.

Занятые пространства имён:

| Имя | Кто | Ключи |
|---|---|---|
| `quiz` | блок `Quiz` | `quiz:<id вопроса>` — номер выбранного ответа |
| `todo-react` | приложение | `todo-react:todos` |
| `stopwatch-vue` | приложение | `stopwatch-vue:laps` |
| — | тема сайта | `theme` — сырая строка `'light'` / `'dark'`, без JSON и пространства имён |

> Ключи — часть сохранённых данных пользователей. Если переименовать пространство имён или ключ,
> старые значения у посетителей «потеряются». Меняйте их, только добавив перенос со старого ключа.

### Хуки для React и Vue

React:

```tsx
import { createStorage } from '@skvortsov/shared/storage';
import { useLocalStorage } from '@skvortsov/shared/react';

const storage = createStorage('todo-react');

function App() {
  const [todos, setTodos, removeTodos] = useLocalStorage(storage, 'todos', initialTodos);
  setTodos((list) => [...list, todo]); // как useState, но с сохранением
}
```

Vue:

```vue
<script setup lang="ts">
import { createStorage } from '@skvortsov/shared/storage';
import { useLocalStorage } from '@skvortsov/shared/vue';

const storage = createStorage('stopwatch-vue');
const laps = useLocalStorage(storage, 'laps', [] as number[]); // ref, работает с v-model

laps.value = [time, ...laps.value]; // сохраняется
laps.remove(); // удалить ключ — вернётся значение по умолчанию
</script>
```

- **Первый рендер возвращает значение по умолчанию**, сохранённое читается после монтирования.
  Так разметка острова совпадает с серверной, и нет ошибок гидрации. Первый кадр может мелькнуть значением по умолчанию.
- **Во Vue мутации на месте не сохраняются**: `laps.value.push(x)` поменяет массив, но не запишет его.
  Присваивайте новое значение: `laps.value = [...laps.value, x]`.
- Все компоненты с одинаковым хранилищем и ключом видят одно значение и обновляются вместе.

### Где держать код и типы

| Что | Куда |
|---|---|
| нужно только сайту | `src/lib/` (как `projects.ts`, `sections.ts`) |
| нужно только одному приложению | `apps/<slug>/src/lib/`, хуки — в `hooks/` / `composables/` |
| нужно в двух местах и больше | `packages/shared/` |
| пропсы компонента или виджета | в файле самого компонента: `interface Props` |
| типы приложения: сущности, ответы его API | в приложении: `apps/<slug>/src/types.ts` или рядом с запросами (`src/api/types.ts`) |
| обобщённые типы без привязки к приложению | `@skvortsov/shared/types` |

- Конкретные типы (`Todo`, `TodoResponse`) в `shared` не попадают, пока тот же контракт не понадобится во втором месте.
  Пример — `apps/todo-react/src/types.ts`.
- Типы экспортируются явно, без `declare global`: так видно, откуда тип пришёл, и он одинаково работает в сайте и приложениях.
  Глобально объявляйте только расширения браузерных типов (`interface Window { … }`).
- Новую функцию добавляйте в подходящий модуль `src/<модуль>/index.ts` пакета; новый модуль — новая папка
  `src/<модуль>/index.ts`, она сразу доступна как `@skvortsov/shared/<модуль>` (так настроены `exports`).
- Хук или composable — обёртка над ядром: логику кладите в `storage` / `utils`, в `react/` и `vue/` — только связку с фреймворком.

Проверка типов пакета: `cd packages/shared && npx -p typescript tsc -p .`.

## Уроки

### Добавить урок

Создайте `src/content/lessons/<section>/<slug>.mdx`:

```mdx
---
title: Промисы
description: Как работают промисы и async/await
section: js            # js | css | vue | react | frontend | architecture | patterns
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

1. Добавить раздел в `sections` в [`src/lib/sections.ts`](src/lib/sections.ts) — `id`, название и описание.
   Схема уроков берёт список разделов оттуда же, поэтому `section: <id>` во frontmatter сразу станет допустимым.
2. При необходимости — пункт в `nav` в `Header.astro`.
3. Создать папку `src/content/lessons/<id>/` для уроков. Пока уроков нет, страница раздела покажет «Уроки скоро появятся».

## Проекты

Раздел `/projects` поддерживает два формата. Оба описываются файлом `src/projects/<slug>/index.mdx`.

| | Остров (`type: island`) | Приложение (`type: app`) |
|---|---|---|
| Где код | `src/projects/<slug>/` рядом с описанием | `apps/<slug>/` — отдельный Vite-проект |
| Как показывается | Прямо на странице проекта | В iframe + кнопка «Открыть отдельно» |
| Зависимости | Только те, что есть у сайта | Свои, в `apps/<slug>/package.json` |
| Роутер | Нет | Любой (используйте hash-историю) |
| UI-kit | React — напрямую, Vue — токены и классы | Через пакеты `@skvortsov/*` (см. ниже) |
| Когда выбирать | Небольшой виджет или демо | Готовое приложение, свой роутер, тяжёлые библиотеки, Quasar/Element Plus |

Сейчас оба примера (`todo-react`, `stopwatch-vue`) — приложения.

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
   `stopwatch-vue` (Vue + кит `@skvortsov/ui-vue`) или `todo-react` (React + shadcn-кит сайта).
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
- **Тема**: добавьте зависимость `@skvortsov/shared` и вызовите `syncTheme()` до монтирования —
  в iframe приложение будет повторять тему сайта, отдельно — системную:

  ```ts
  import { syncTheme } from '@skvortsov/shared/theme';

  syncTheme();
  createApp(App).mount('#app');
  ```

- **localStorage — только через `createStorage('<slug>')`**: он общий с сайтом и другими приложениями,
  см. [localStorage](#localstorage).

#### Структура приложения

Внутри `apps/<slug>/src/` можно заводить свои компоненты и виджеты — каждое приложение независимо:

```
apps/todo-react/src/
├─ components/      # мелкие компоненты приложения: TodoItem, EmptyState
├─ widgets/         # крупные блоки из нескольких компонентов: TodoList, FiltersPanel
├─ pages/           # страницы, если есть роутер
├─ hooks/           # React; во Vue — composables/
├─ lib/             # функции, нужные только этому приложению
├─ api/             # запросы к API приложения и их типы, если есть
├─ types.ts         # типы приложения: Todo, ответы API
├─ App.tsx
└─ style.css
```

- **Tailwind сам видит новые файлы**: плагин `@tailwindcss/vite` сканирует всю папку приложения, `@source` не нужен.
- **Сайт эти файлы не сканирует** — в `src/styles/global.css` стоит `@source not '../../apps'`,
  поэтому классы приложений не попадают в CSS сайта.
- Внутри своих компонентов можно использовать кит: `import { Button } from '@skvortsov/ui-react/button'` —
  токены и тёмная тема будут те же, что на сайте.
- Если приложение на своём CSS, без Tailwind и кита, классы Tailwind и `@skvortsov/ui-*` в приложении не работают —
  сначала подключите их, см. [UI-kit сайта в приложении](#ui-kit-сайта-в-приложении).

Куда класть компонент:

| Где нужен | Куда |
|---|---|
| только в одном приложении | `apps/<slug>/src/components` или `widgets` |
| в двух приложениях и больше или ещё на сайте | в `packages/ui-react` / `packages/ui-vue` (обе реализации) |
| в уроке на сайте | `src/components/blocks` или `src/components/demos` |

Сначала пишите компонент внутри приложения и переносите в пакет, только когда он понадобился во втором месте, —
так пакеты не разрастаются компонентами одного проекта. То же для функций и типов —
см. [Где держать код и типы](#где-держать-код-и-типы).

#### UI-kit сайта в приложении

Пример — `apps/todo-react`:

- в `package.json` приложения — зависимости `"@skvortsov/tokens": "*"` и `"@skvortsov/ui-react": "*"`
  (после этого — `npm install` в корне `app/`);
- в коде — `import { Button } from '@skvortsov/ui-react/button'`;
- `src/style.css`:

  ```css
  @import 'tailwindcss';
  @import '@skvortsov/tokens/tokens.css';
  @import '@skvortsov/ui-react/styles.css';
  ```

React в приложении должен быть той же мажорной версии, что и у сайта (сейчас 19): у пакета React — peer-зависимость,
и две разные копии React дают ошибку «Invalid hook call».

Для Vue-приложения — то же самое с `@skvortsov/ui-vue` вместо `ui-react` (как в `stopwatch-vue`);
если готовые компоненты не нужны, достаточно одного `@skvortsov/tokens`.
Приложение со своим UI (Quasar, Element Plus) может вообще не подключать кит.

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
- Править компоненты в `packages/ui-react/src/components/` под себя — изменения увидят все потребители кита.
- Смешивать React и Vue на сайте: `.tsx` обрабатывает React, `.vue` — Vue.
- Добавлять любые зависимости в приложения из `apps/` — на сайт они не влияют.
- Заводить в приложениях свои `components/`, `widgets/`, `lib/`, `types.ts` — каждое приложение независимо.
- Брать из `@skvortsov/shared` хранилище, тему, утилиты и типы и в сайте, и в приложениях.

### Нельзя (или не стоит)

| Не делайте | Почему | Как надо |
|---|---|---|
| Писать цвета хексами (`bg-[#4f46e5]`, `color: #fff`) | Не переключатся в тёмной теме | Утилиты на токенах: `bg-primary` |
| Добавлять `<style>` в `.astro` для того, что можно сделать классами | Scoped-стили сильнее утилит и ломают переопределение | Классы Tailwind |
| Класть компоненты сайта в `packages/ui-react` | Пакет — общий кит; `shadcn add` может перезаписать файлы | Блоки сайта — в `src/components/blocks/`, в пакет — только то, что нужно нескольким потребителям |
| Импортировать в приложения код из `src/` сайта (`../../src`) | Приложение сломается при любом переименовании в сайте | Общий код — в `packages/`, подключать как зависимость |
| Использовать `<Button asChild>` в `.astro` | Не работает: дети приходят как HTML | `<a class={buttonVariants()}>` |
| Ставить `client:load` на всё подряд | Каждый остров тянет JS фреймворка | Без директивы для статики, `client:visible` для демок |
| Использовать `@skvortsov/ui-react` во Vue | Это React-компоненты | `@skvortsov/ui-vue` |
| Менять вид компонента только в одном из пакетов `ui-react` / `ui-vue` | React- и Vue-версии начнут выглядеть по-разному | Правьте оба пакета, цвета и радиусы — в `@skvortsov/tokens` |
| Писать JSX во Vue-компонентах | JSX на сайте обрабатывает только React | Шаблоны `<template>` |
| Использовать `createWebHistory` / `BrowserRouter` в приложениях | 404 при обновлении страницы | Hash-история |
| Ставить в приложения пакеты, требующие Vite 7+ | Конфликт с Vite 6 у Astro, `npm install` упадёт | Версии, совместимые с Vite 6 |
| Коммитить `public/apps/` | Это результат сборки | Собирается `build:apps` |
| Импортировать в Astro-сайт код из `apps/` | Приложения исключены из tsconfig и Tailwind сайта | Общий код — в `packages/shared` (или `ui-*`), подключать как зависимость |
| Обращаться к `localStorage` напрямую | Общий для сайта и всех приложений: одинаковые ключи перезапишут друг друга; падает при SSR и в приватном режиме | `createStorage('<slug>')` из `@skvortsov/shared/storage` |
| Переименовывать пространство имён или ключ хранилища | Сохранённые данные пользователей пропадут | Оставить старый ключ или добавить перенос |
| Класть в `shared` типы и функции одного приложения | Пакет разрастётся кодом, нужным в одном месте | В само приложение; в `shared` — когда нужно во втором месте |
| Импортировать в `shared` что-то из `ui-*`, сайта или приложений | Появятся циклические зависимости | `shared` — нижний слой, зависит только от себя |
| Мутировать на месте значение из Vue-`useLocalStorage` (`.push`) | Изменение не сохранится | Присвоить новое значение |

## Частые проблемы

**Проект показывает 404 `/apps/<slug>/`.**
Приложение не собрано — перезапустите `npm run dev` (сработает `predev`) или выполните `npm run build:apps`.
Проверьте, что `<slug>` совпадает в `apps/`, `src/projects/` и в `base` / `outDir` конфига.

**Изменения в приложении не видны на сайте в dev.**
Приложения собираются один раз при старте. Для разработки запускайте приложение отдельно:
`npm run dev -w @apps/<slug>`, затем `npm run build:apps`.

**Класс Tailwind не применяется.**
Tailwind генерирует только классы, которые видит в исходниках целиком. Не собирайте имена из кусков
(`` `bg-${color}` ``) — пишите полные имена в объекте. Для приложений проверьте, что в их `style.css` подключён `@skvortsov/ui-react/styles.css`.

**Компонент в уроке выглядит не так, как на `/ui-kit`.**
На него действуют стили `prose` — добавьте корневому элементу `not-prose`.

**Кнопка в демке или квизе не реагирует на клик.**
У острова нет директивы `client:*`. (`Task` директива не нужна — он работает без JS.)

**Удалённый урок или проект всё ещё попадает в сборку.**
Astro кеширует содержимое коллекций, и если удалить из папки последний файл, кеш может не обновиться.
Сбросьте его: `rm -rf .astro/data-store.json node_modules/.astro` — и запустите сборку снова.

**`npm install` падает с `ERESOLVE`.**
Какой-то пакет в `apps/*` требует другую версию Vite или React — смотрите строку `Conflicting peer dependency`
и подберите совместимую версию пакета.
