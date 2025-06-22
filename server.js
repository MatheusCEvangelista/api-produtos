const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const produtoRoutes = require('./routes/produto.routes');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

// Desativa o buffering implícito do Mongoose
mongoose.set('bufferCommands', false);

async function startServer() {
  try {
    console.log('🌍 URI do Mongo:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Conectado ao MongoDB');
    console.log('⛓ Estado da conexão:', mongoose.connection.readyState); // 1 = conectado

    const app = express();
    const PORT = process.env.PORT || 3001;

    app.use(cors());
    app.use(express.json());

    app.use('/produtos', produtoRoutes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Função robusta para listar rotas (inclui rotas aninhadas)
    function listarRotas(app) {
      if (!app._router || !app._router.stack) return [];

      const rotas = [];

      app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          // rota simples
          const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
          rotas.push(`${methods} ${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
          // rotas aninhadas
          middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(', ');
              rotas.push(`${methods} ${handler.route.path}`);
            }
          });
        }
      });

      return rotas;
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);

      const rotas = listarRotas(app);
      console.log('📡 Rotas disponíveis:', rotas.length ? rotas : '[Nenhuma rota encontrada]');
    });

    server.on('error', (err) => {
      console.error('💥 Erro no servidor HTTP:', err?.message || 'Erro desconhecido');
    });

  } catch (err) {
    console.error('❌ Erro ao conectar ou iniciar o servidor:');
    if (err && typeof err === 'object') {
      console.error('🪵 Mensagem:', err.message || '[mensagem indisponível]');
      console.error('🧱 Stack trace:', err.stack || '[sem stack]');
    } else {
      console.error('🪵 Erro inesperado:', err ?? '[erro indefinido]');
    }
  }
}

startServer().catch((err) => {
  console.error('🔥 Erro inesperado fora do try/catch de startServer:');
  if (err && typeof err === 'object') {
    console.error('🪵 Mensagem:', err.message || '[mensagem indisponível]');
    console.error('🧱 Stack trace:', err.stack || '[sem stack]');
  } else {
    console.error('🪵 Erro bruto:', err ?? '[erro indefinido]');
  }
});
