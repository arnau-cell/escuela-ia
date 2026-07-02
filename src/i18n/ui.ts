export const defaultLang = 'es';

export const ui = {
	es: {
		'translation.outdated':
			'Esta traducción va por detrás de la versión en español y puede estar desactualizada.',
		'translation.viewSource': 'Ver la versión en español',
		'lang.switchTo': 'English version',
		'wip.title': 'Página en construcción',
		'wip.body': 'La estructura ya es definitiva; el contenido llega en la siguiente fase.',
		'concept.aria': 'Concepto del glosario: ',
	},
	en: {
		'translation.outdated':
			'This translation lags behind the Spanish original and may be out of date.',
		'translation.viewSource': 'View the Spanish version',
		'lang.switchTo': 'Versión en español',
		'wip.title': 'Page under construction',
		'wip.body': 'The structure is final; content lands in the next phase.',
		'concept.aria': 'Glossary concept: ',
	},
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function t(locale: string | undefined, key: UiKey): string {
	const lang = (locale ?? defaultLang) as keyof typeof ui;
	return ui[lang]?.[key] ?? ui[defaultLang][key];
}
