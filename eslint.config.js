import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Configuração padrão recomendada pelo ESLint
  eslint.configs.recommended,

  // Configuração padrão recomendada pelo TypeScript-ESLint
  ...tseslint.configs.recommended,

  // Configuração do Prettier para desativar regras conflitantes
  // Esta deve ser a última para poder sobrescrever as outras.
  prettierConfig,
);