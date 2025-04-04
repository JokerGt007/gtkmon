const express = require('express');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const path = require('path'); // Importa o módulo 'path' para manipulação de caminhos de arquivos
const app = express();
const port = 3000;

// Inicializa o Firebase Admin SDK com o arquivo de credenciais correto
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS || '{}');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// Referência à coleção "Pokemons"
const db = firebaseAdmin.firestore();
const pokemonsRef = db.collection('Pokemons');

// Middleware para permitir requisições de outras origens (CORS)
app.use(cors());
app.use(express.json());

// Função para obter o último ID de Pokémon cadastrado
async function getLastPokemonId() {
  const snapshot = await pokemonsRef.orderBy('id', 'desc').limit(1).get();
  if (!snapshot.empty) {
    const lastPokemon = snapshot.docs[0].data();
    return lastPokemon.id || 0; // Retorna o ID ou 0 se não encontrar
  }
  return 0; // Se não houver Pokémons cadastrados
}

// Rota para adicionar um novo Pokémon
app.post('/addPokemon', async (req, res) => {
  try {
    const pokemon = req.body;
    const lastId = await getLastPokemonId();
    const newId = lastId + 1;

    // Adiciona o Pokémon ao Firestore com ID numérico crescente
    await pokemonsRef.doc(newId.toString()).set({
      ...pokemon,
      id: newId,
    });

    res.status(201).json({ message: "Pokémon adicionado com sucesso!", id: newId });
  } catch (error) {
    console.error('Erro ao adicionar Pokémon:', error);
    res.status(500).json({ message: "Erro ao adicionar Pokémon", error: error.message });
  }
});
// Rota para obter todos os Pokémons
app.get('/getPokemons', async (req, res) => {
  try {
    // console.log('Iniciando busca de Pokémons...');
    const snapshot = await db.collection('Pokemons').orderBy('id', 'asc').get();
    if (snapshot.empty) {
      console.log('Nenhum Pokémon encontrado');
      return res.status(404).json({ message: 'Nenhum Pokémon encontrado' });
    }
    const pokemons = snapshot.docs.map(doc => doc.data());
    return res.status(200).json(pokemons);
  } catch (error) {
    console.error('Erro ao buscar Pokémons:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
