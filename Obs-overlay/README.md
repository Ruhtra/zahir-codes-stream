#  &nbsp;&nbsp; Obs-overlay
  ### Overlay para obs
  &nbsp; &nbsp; &nbsp; Aplicativo que controla os vídeos do obs via comandos da twitch <br>
  &nbsp; &nbsp; &nbsp; e cria uma cena com a interface montada dos vídeos. <br>

  #### &nbsp; &nbsp; O app pode ser configurado através de uma interface gráfica ao inciar

<br>

---
#  &nbsp;&nbsp; Para executar o aplicativo

## Requisitos:
  + **Versão do Obs superior a V28.0.0**

## Executar:
  + Faça a instalação dos módulos com ``` npm install ```
  + Utilize ``` npm start ``` para executa-lo via npm

## Criar executavel:
  + Execute ``` npm run build ``` para gerar o executavel 
  + Em seguida acesse "**release-builds**, para encontrar a pasta do seu app 
  
<br>

---
#  &nbsp;&nbsp; Configuração:
  + **Channel** -> Nome do canal que ele irá receber mensagens do chat  
  + **Password** -> Senha de acesso remoto do obs
  + **Commands**
    + **Prefix** -> Simbolo que será usado para identificação do comando 
    + **Blue** &nbsp;&nbsp; -> Nome do comando para trocar a overlay para **azul**
    + **White** ->Nome do comando para trocar a overlay para **branco**
    + **Pink**&nbsp;&nbsp;&nbsp; ->Nome do comando para trocar a overlay para **rosa**
  + **Alertas**
    + **Alert** -> Link que mostra os alertas
    + **Chat** -> Link que mostra o chat daa twitch

<br>

---
#  &nbsp;&nbsp; Criar cena do obs
  + ### Após configurar o aplicativo clique em **Create Scene** para criar a cena do obs
  + ### Será criado um arquivo chamado **Collection-obs.json** na pasta raíz do aplicativo