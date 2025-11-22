@echo off
echo ========================================
echo   Instalando Dependencias de Testes
echo ========================================
echo.

echo [1/3] Instalando Jest e TypeScript Jest...
call npm install --save-dev jest @types/jest ts-jest

echo.
echo [2/3] Instalando React Native Testing Library...
call npm install --save-dev @testing-library/react-native @testing-library/jest-native

echo.
echo [3/3] Instalando jest-expo (preset React Native)...
call npm install --save-dev jest-expo

echo.
echo ========================================
echo   Instalacao Concluida!
echo ========================================
echo.
echo Para rodar os testes, use:
echo   npm test
echo   npm run test:watch
echo   npm run test:coverage
echo.
pause
