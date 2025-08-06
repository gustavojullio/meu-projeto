// const mongoose = require('mongoose');


// const produtoSchema = new mongoose.Schema({
//   nome: String,
//   qtde: Number, 
//   unidade: String,
//   valor: Number
// });


// const trabalhadorSchema = new mongoose.Schema({
//   nome: String
// });

// const servicoSchema = new mongoose.Schema({
//     proprietario: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Usuario',
//     required: true
//   },
//   data: Date,
//   talhao: String,
//   servico_tipo: [String],
//   valor_servico: Number, 
//   produtos: [produtoSchema],
//   trabalhadores: [trabalhadorSchema]
// });

// module.exports = mongoose.model('Servico', servicoSchema);

const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: String,
  qtde: Number, 
  unidade: String,
  valor: Number
});

const trabalhadorSchema = new mongoose.Schema({
  nome: String
});

const servicoSchema = new mongoose.Schema({
  proprietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  data: {
    type: Date,
    required: true // Data também é um bom candidato para ser obrigatório
  },
  talhao: {
    type: String,
    required: [true, 'O campo talhão é obrigatório.']
  },
  servico_tipo: {
    type: [String],
    required: true,
    // Validação para garantir que o array não seja enviado vazio
    validate: [val => val.length > 0, 'É necessário selecionar pelo menos um tipo de serviço.']
  },
  valor_servico: {
    type: Number,
    required: [true, 'O valor do serviço é obrigatório.']
  }, 
  produtos: [produtoSchema], // Produtos podem ser opcionais
  trabalhadores: {
    type: [trabalhadorSchema],
    required: true,
    validate: [val => val.length > 0, 'É necessário adicionar pelo menos um trabalhador.']
  }
});

module.exports = mongoose.model('Servico', servicoSchema);

