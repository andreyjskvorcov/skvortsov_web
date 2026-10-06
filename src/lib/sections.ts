export const sections = {
  js: { title: 'JavaScript', description: 'Типы, замыкания, прототипы, асинхронность, event loop' },
  css: { title: 'CSS', description: 'Селекторы, каскад, flexbox, grid, адаптивность, анимации' },
  vue: { title: 'Vue', description: 'Реактивность, Composition API, компоненты, Pinia' },
  react: { title: 'React', description: 'JSX, хуки, состояние, производительность' },
  frontend: { title: 'Frontend / Web', description: 'HTML, браузер, сеть, a11y, перформанс' },
  architecture: {
    title: 'Архитектура',
    description: 'Структура проекта, слои и модули, FSD, управление состоянием',
  },
  patterns: { title: 'Паттерны', description: 'Паттерны проектирования и приёмы в JavaScript и фронтенде' },
} as const;

export type SectionId = keyof typeof sections;
export const sectionIds = Object.keys(sections) as [SectionId, ...SectionId[]];
