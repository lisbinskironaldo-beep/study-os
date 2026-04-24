# Documentos, PDF em Texto e sync entre PCs

## Objetivo

Este guia explica o que precisa estar pronto para abrir documentos no `premium study`, salvar o texto extraido e reencontrar o mesmo material em outro computador.

## O que o sistema aceita hoje

- upload em PDF (`.pdf` ou `application/pdf`)
- validacao de PDF textual
- fallback de extracao por IA para PDFs pequenos quando a camada local vier fraca
- abertura do modo `PDF em Texto` para editar uma copia textual estavel
- sync de biblioteca por conta quando houver login e banco configurado

## O que precisa para abrir documentos corretamente

### 1. Ambiente local ou web funcionando

Local:

```powershell
vercel dev
```

Abrir:

- `http://localhost:3000/`
- `http://localhost:3000/ops/`

Producao:

- `https://rota-nota.vercel.app/`

### 2. Login na mesma conta

Para reencontrar o mesmo estudo em outro PC, entre com a mesma conta Google usada ao salvar o material.

Sem login:

- o estudo continua no cache local do navegador
- outro PC nao recebe esse item automaticamente

Com login:

- a Biblioteca premium sincroniza o snapshot do estudo por conta
- o texto salvo em `PDF em Texto` pode ser retomado em outro PC

### 3. Schema do Supabase aplicado

Aplicar o arquivo:

- `docs/supabase_premium_schema.sql`

Esse schema cria, entre outras tabelas:

- `premium_study_library_items`
- `premium_pdf_assets`
- `premium_pdf_annotations`

Sem esse schema:

- a biblioteca pode continuar local
- o outro PC nao vai recuperar os estudos sincronizados como esperado

### 4. Login Google configurado

Na Vercel:

- `GOOGLE_CLIENT_ID` ou `ROTANOTA_GOOGLE_CLIENT_ID`

No Google Cloud, em `Authorized JavaScript origins`, cadastrar as origins exatas:

- `https://rota-nota.vercel.app`
- `http://localhost:3000`
- qualquer preview exato da Vercel que estiver sendo usado

Sem isso, o login pode falhar com:

- `Erro 400: origin_mismatch`

### 5. PDF textual valido

O fluxo `PDF em Texto` foi feito para PDF com camada real de texto.

Funciona melhor com:

- PDF exportado de Word
- PDF gerado por editor
- PDF com texto selecionavel

Pode falhar ou extrair pouco com:

- PDF escaneado
- imagem dentro de PDF
- arquivo corrompido

Agora existe um fallback por IA para tentar recuperar texto quando a leitura local vier fraca, mas ele nao substitui todos os casos:

- funciona melhor em PDFs pequenos
- depende de Gemini configurado no ambiente
- ainda pode falhar em documento muito pesado, corrompido ou visualmente ruim

Regra de produto atual:

- `Aprender` continua priorizando o fluxo gratis com texto local
- `PDF em Texto` abre gratis quando o PDF ja vier textual
- quando o arquivo parecer escaneado ou imagem, a conversao robusta para texto editavel fica no premium

## Como garantir que o outro PC abra igual

1. entrar no site com a mesma conta Google
2. carregar o PDF
3. esperar o texto aparecer em `PDF em Texto`
4. clicar em `Salvar`
5. aguardar a persistencia local e, quando houver login, a sync remota
6. no outro PC, entrar com a mesma conta
7. abrir a `Biblioteca premium`
8. retomar o estudo salvo

## O que exatamente e salvo

No navegador atual:

- cache local em IndexedDB
- snapshot do estudo
- texto extraido
- estado atual do material

Quando houver login e banco configurado:

- item da Biblioteca premium sincronizado por conta
- snapshot do estudo salvo no backend
- metadados do PDF e anotacoes, quando o fluxo correspondente estiver ativo

## O que nao esta garantido automaticamente

- OCR de PDF escaneado
- sincronizacao sem login
- pastas de organizacao dentro da biblioteca
- reabertura de um arquivo local que nunca foi salvo na biblioteca

## Checklist rapido de diagnostico

Se um PC abre e o outro nao:

1. confirmar que ambos estao na mesma versao publicada ou no mesmo commit local
2. confirmar login com a mesma conta Google
3. confirmar schema do Supabase aplicado
4. confirmar que o PDF e textual
5. confirmar que a rede nao esta bloqueando `cdnjs.cloudflare.com`
6. confirmar que o estudo foi salvo antes de trocar de maquina
7. abrir pela Biblioteca premium em vez de depender apenas do ultimo rascunho local

## Dono/admin

Para o dono entrar como premium em qualquer navegador:

- `ROTANOTA_OWNER_EMAILS=email1@dominio.com,email2@dominio.com`
- `ROTANOTA_OWNER_USER_IDS=google:123,google:456`

Essas envs liberam o premium por conta, nao por navegador.
