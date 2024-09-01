module.exports = {
  env: { browser: true, es2020: true, "node":true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/prop-types':'warn',
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        "name": "react-redux",
        "importNames": ["useSelector", "useDispatch"],
        "message": "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
      }
    ],
  },
}
