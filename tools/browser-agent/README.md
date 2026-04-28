# Browser Agent Local

Agente local de browser para validar o RotaNota com Playwright, sem depender de instalacao temporaria.

## Instalar

```powershell
npm install
npm run install:browsers
```

## Usar

Abrir um site manualmente:

```powershell
npm run open -- http://127.0.0.1:3000
```

Gravar um fluxo:

```powershell
npm run codegen -- http://127.0.0.1:3000
```

Tirar screenshot automatica:

```powershell
npm run snapshot -- http://127.0.0.1:3000
```

Checagem rapida:

```powershell
npm run doctor
```
