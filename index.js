const axios = require('axios'), config = require('./config.json'), fs = require('fs'); 
  
 const start = async () => { 
     const peer_ids = []; 
     for(let i = 0; i < 100; i++) peer_ids.push(config.group_id -= 1);
     const { response: { items } } = await API("messages.getConversationsById", {peer_ids: peer_ids.join(","), peer_id: config.group_id}); 
  
     for(const item of items.filter(x => x.can_write.allowed)) { 
         await new Promise(async resolve => {
             const { error } = await API("messages.send", {message: "&#13;", random_id: 0, peer_id: item.peer.id}); 
  
             if(!error) { 
                 await API("messages.markAsUnreadConversation", {peer_id: item.peer.id});
                 console.log(`Сообщение отправлено | ID: ${item.peer.id}`); 
             } else return console.log(`Сообщение не было отправлено | ID: ${item.peer.id} | ${error.error_msg} | Code: ${error.error_code}`); 
  
             fs.writeFileSync(__dirname + "/config.json", JSON.stringify({...config, group_id: item.peer.id}, null, 4)); 
             setTimeout(resolve, config.delay); 
         }) 
     } 
  
     start(); 
 } 
  
 async function API(method, params) { 
     return (await axios({url: "https://api.vk.com/method/" + method, method: "GET", params: {access_token: config.access_token, v: '5.131', ...params}})).data; 
 } 
  
 start();
 
 