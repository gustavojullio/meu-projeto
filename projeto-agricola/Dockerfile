FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento (para os testes)
RUN npm install

# Copia todo o resto do código da sua aplicação
COPY . .


# --- Estágio 2: Produção (Production Stage) ---
# Começamos de uma imagem nova e limpa, a 'alpine', que é muito leve
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências do estágio de construção
COPY --from=builder /usr/src/app/package*.json ./

# Instala APENAS as dependências de produção, de forma otimizada
RUN npm ci --only=production

# Copia o código da aplicação já preparado do estágio de construção
COPY --from=builder /usr/src/app .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]