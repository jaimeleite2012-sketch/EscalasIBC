# Escalas IBC 5.1 - Correção da prévia do WhatsApp

## O que foi corrigido
- Nova imagem Open Graph em JPG 1200x630.
- Nome de arquivo novo: `og-image-v51.jpg` para forçar nova leitura.
- Metatags Open Graph completas.
- `og:image:secure_url`, largura, altura, tipo e alt.
- Ícones PWA atualizados.
- Manifest atualizado.

## Arquivos que precisam ir para o GitHub
Substitua tudo na raiz do repositório por estes arquivos:
- index.html
- manifest.json
- service-worker.js
- assets/

## Como testar corretamente
1. Atualize todos os arquivos no GitHub.
2. Aguarde o deploy finalizar.
3. Abra no navegador:
   https://jaimeleite2012-sketch.github.io/EscalasIBC/assets/og-image-v51.jpg
   Se a imagem abrir, o arquivo está publicado.
4. Envie no WhatsApp o link com cache buster:
   https://jaimeleite2012-sketch.github.io/EscalasIBC/?v=51

Observação: o WhatsApp pode manter cache da URL antiga. Por isso, teste com `?v=51`.
