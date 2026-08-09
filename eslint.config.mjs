import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          // AQUÍ ESTÁN LAS REGLAS DE ARQUITECTURA MULTI-DOMINIO
          depConstraints: [
            {
              sourceTag: 'domain:auth',
              onlyDependOnLibsWithTags: ['type:shared'],
            },
            {
              sourceTag: 'domain:expediente',
              onlyDependOnLibsWithTags: ['type:shared', 'domain:auth'],
            },
            {
              sourceTag: 'domain:backoffice',
              onlyDependOnLibsWithTags: ['type:shared', 'domain:auth'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['domain:auth', 'domain:expediente', 'domain:backoffice', 'type:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
