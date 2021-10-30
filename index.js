const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

//definindo o template
app.set("view engine", "ejs");

//midleware para o server receber os dados do formulario
app.use(express.urlencoded({ extended: true}))

//gerar itens publicos
const publicFolder = path.join(__dirname, "public"); //public é a pasta
const expressPublic = express.static(publicFolder); // usar arquivos publicos
app.use(expressPublic);

//rotas

app.get("/", (req, res) => {
  const data = fs.readFileSync("./store/dados.json"); //pega o server
  const dataFormJSON = JSON.parse(data);
  res.render('index', {
    title: 'Postagens do Wagner',
    posts: dataFormJSON
  })

})

app.get("/cadastro", (req, res) => {
  const { postagem } = req.query;
  res.render('cadastro', {
    title: 'Criar Publicação',
    postagem
  })
  
})

app.post('/salvar', (req, res) => {
  const { post, name } = req.body; // estes sao os parametro que vem do form. esta sendo desestruturado
  const data = fs.readFileSync("./store/dados.json"); //pega o server
  const dataFormJSON = JSON.parse(data); // converte em json para fazer o push

  dataFormJSON.push({
    post,
    name,
  }); // faz um push
  const dataFormString = JSON.stringify(dataFormJSON); // devolve para string
  fs.writeFileSync("./store/dados.json", dataFormString); //armazena no server

  res.redirect("/cadastro?postagem=ok"); //passa parametro para verificar se foi enviado ou nao
})

app.use((req, res) => {
  
    //pagina de erro 404
  res.send("Página não encontrada");
});


//rota para receber dados

app.post("/salvar", (req, res) => {
  res.render("salvar");
})

// server execute
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Servidor rodadando na porta ${port}`));
