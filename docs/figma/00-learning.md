# Промпт для Figma: учебные блоки и страницы

Дополнение к [00-design-system.md](00-design-system.md): блоки уроков и страницы раздела «Обучение».
Отправляйте в тот же файл **после** того, как собраны переменные и базовые компоненты, — промпт на них опирается.

- **Источник** — [`src/components/blocks/`](../../src/components/blocks/) (Callout, Quiz, Task, BackToTop) и страницы `src/pages/learn/`.

````text
В этом файле уже есть дизайн-система «skvortsov.web»: переменные Color (Light/Dark), Radius, текстовые стили,
компоненты Button, Badge, Card, Alert, Header, LinkCard. Используй только их, новых цветов и «похожих» кнопок не заводи.
Добавь блоки для учебных страниц и макеты этих страниц.

## 1. Блоки уроков (Component Sets, Auto Layout)

- Callout — Alert с левой границей 4px и цветной иконкой; type: info (info) | tip (success, lightbulb) | warning (warning, triangle-alert) | danger (destructive, circle-alert); заголовки по умолчанию «Заметка», «Совет», «Внимание», «Опасно».
- Quiz — Card, бейдж «Вопрос», текст вопроса с блоком кода, варианты — строки-кнопки с моноширинным текстом.
  state: unanswered (hover — рамка primary) | correct (выбранный: рамка success, фон success 10%, иконка check, бейдж «Верно») |
  wrong (выбранный: рамка destructive, фон 10%, иконка x; правильный подсвечен success; остальные 60%; бейдж «Неверно»).
  После ответа — пояснение и ghost-кнопка «Ответить заново».
- Task — Card; бейджи «Задача» + сложность (Лёгкая / Средняя / Сложная); заголовок, условие с кодом;
  outline sm кнопки «Подсказка» (lightbulb) и «Показать ответ» (chevron-down); open: «Скрыть ответ», код решения и пояснение.
- Code/Inline — mono 0.9em на фоне muted, радиус sm; Code/Block — 14px mono, тёмная подложка (GitHub Dark), отступ 16px, радиус md.
- Pager — верхняя граница; «← Предыдущий урок» слева, «Следующий урок →» справа цветом primary.
- BackToTop — круглая Button outline 40px с arrow-up, справа снизу, тень md.

## 2. Макеты (Light и Dark, десктоп 1440 и мобильный 390)

1. «Обучение» — сетка LinkCard по разделам (колонки от 256px, gap 16px).
2. Список уроков раздела.
3. Страница урока — сайдбар 240px + статья до 768px (gap 48px), Callout, Quiz, Task, Pager; на мобильном одна колонка.
````
