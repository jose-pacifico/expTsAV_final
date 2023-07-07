export interface MigracaoDB {
  consultas?: Array<{ model: string; query: string }>;
}

const migracoes: Map<number, MigracaoDB> = new Map<number, MigracaoDB>();

migracoes.set(1, {
  consultas: [
    {
      model: 'Funcionarios',
      query: `ALTER TABLE Funcionarios DROP idade;`,
    },
  ],
});

migracoes.set(2, {
  consultas: [
    {
      model: 'Funcionarios',
      query: `ALTER TABLE Funcionarios DROP fone;`,
    },
  ],
});

migracoes.set(3, {
  consultas: [
    {
      model: 'Funcionarios',
      query: `ALTER TABLE Funcionarios DROP endereco;`,
    },
  ],
});

migracoes.set(4, {
  consultas: [
    {
      model: 'Funcionarios',
      query: `ALTER TABLE Funcionarios ADD COLUMN senha char(100) not null AFTER name;`,
    },
  ],
});

export { migracoes };
