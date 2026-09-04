export type UsageProfile = 'casa' | 'gamer' | 'empresa'

export interface FinderOption {
  /** Perfil (pergunta 1) ou peso de carga (perguntas 2 e 3). */
  value: string
  label: string
  hint: string
}

export interface FinderQuestion {
  id: string
  question: string
  options: FinderOption[]
}

export const QUESTIONS: FinderQuestion[] = [
  {
    id: 'perfil',
    question: 'A internet é para qual situação?',
    options: [
      { value: 'casa', label: 'Minha casa', hint: 'família, estudo, streaming' },
      { value: 'gamer', label: 'Jogar online', hint: 'quero a menor latência possível' },
      { value: 'empresa', label: 'Minha empresa', hint: 'não posso ficar fora do ar' },
      { value: 'casa', label: 'Trabalho em casa', hint: 'reuniões por vídeo o dia todo' },
    ],
  },
  {
    id: 'pessoas',
    question: 'Quantas pessoas usam ao mesmo tempo?',
    options: [
      { value: '0', label: 'Até 2', hint: 'uso tranquilo' },
      { value: '1', label: 'De 3 a 5', hint: 'casa ou equipe pequena' },
      { value: '2', label: 'De 6 a 10', hint: 'bastante gente junto' },
      { value: '3', label: 'Mais de 10', hint: 'movimento o dia inteiro' },
    ],
  },
  {
    id: 'uso',
    question: 'O que mais pesa no seu uso?',
    options: [
      { value: '0', label: 'Redes e mensagens', hint: 'uso leve' },
      { value: '1', label: 'Streaming e vídeo', hint: 'filmes, séries, chamadas' },
      { value: '2', label: 'Downloads e uploads', hint: 'arquivos grandes' },
      {
        value: '3',
        label: 'Sistemas e câmeras',
        hint: 'operação conectada o tempo todo',
      },
    ],
  },
]
