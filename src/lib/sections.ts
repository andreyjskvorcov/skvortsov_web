export const sections = {
  js: { title: 'JavaScript', description: 'Типы, замыкания, прототипы, асинхронность, event loop' },
  vue: { title: 'Vue', description: 'Реактивность, Composition API, компоненты, Pinia' },
  react: { title: 'React', description: 'JSX, хуки, состояние, производительность' },
  frontend: { title: 'Frontend / Web', description: 'HTML, CSS, браузер, сеть, a11y, перформанс' },
} as const;

export type SectionId = keyof typeof sections;
export const sectionIds = Object.keys(sections) as SectionId[];
