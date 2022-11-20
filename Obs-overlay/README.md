# Obs-overlay
Overlay para obs
  Código back-end que controla os vídeos do obs

  Rode "pkg ." para gerar um executavel
  Ou rode "npm start" para iniciar o server direto
  
  ---

 Requisitos
   + **Versão do Obs superior a V28.0.0**
 
 Para configurar o app, é necessário alterar as informações no arquivo **"config.json"**  
   + **Channels** -> Lista de canais que ele irá receber mensagens do chat  
   + **Password** -> senha de acesso remoto do obs
   + **Prefix** -> Simbolo que será usado para identificação do comando  
   + **commands** -> Nome dos comandos
   + **link alert** -> link para mostrar alerta
   + **link chat** -> link para mostrar chat

É tambem necessário criar o arquivo de importação para o obs
Para isso execute vá para **Create_Collection** e execute o **"main.js"**
   + **Importar o arquivo que foi criado "Collection-obs.json" no obs**