const socket=io()

const clientsTotal= document.getElementById('client-total')

const messageContainer=document.querySelector(".messages")
const nameInput=document.getElementById("name-input")
const joinBtn=document.getElementById("join-btn")
const chatScreen=document.getElementById("chat-screen")
const sendButton=document.getElementById("send-msg-btn")
const messageForm=document.querySelector(".msg-box")
const messageInput=document.getElementById("msg-input")
const exitButton=document.getElementById("exit-chat-btn")
const instructionsList=document.getElementById("instructions")

joinBtn.addEventListener('click',()=>{

    if(nameInput.value==''){
        window.alert("Enter a name")
        return;
    }

    instructionsList.style.display="none"
    joinBtn.style.display="none"
    chatScreen.style.display="block"
    clientsTotal.style.display="block"

    socket.emit('join-msg',{
        joinMsg: `${nameInput.value} joined the chat`,
    })
})


socket.on('join-msg',(data)=>{
    console.log(data.joinMsg)
    const joinmsg=document.createElement("div")
    joinmsg.innerHTML=`
    <div id="status">
       ${data.joinMsg} 
    </div>
    `
    messageContainer.appendChild(joinmsg)
})


sendButton.addEventListener('click',(e)=>{
    e.preventDefault()
    sendMessage()
})

/*linking enter key to send button*/
messageInput.addEventListener("keyup",function(event){
    if(event.keyCode==13){
        event.preventDefault();
        sendButton.click();
    }
});

socket.on('clients-total',(data)=>{
    clientsTotal.innerText=`Number of members: ${data}`
})

function sendMessage(){
    if(messageInput.value === '') return;
    console.log(messageInput.value)
    const data={
        name: nameInput.value,
        message: messageInput.value,
        
    }
    socket.emit('message',data)

    addMessage(true,data);

}

socket.on('chat-message',(data)=>{
    console.log(data)
    addMessage(false,data);
})

function addMessage(isOwnmsg,data){
    clearUpdateMessages();
    
    const messageElement = document.createElement('div');
    if(isOwnmsg==true){
        messageElement.classList.add('message','my-msg');
            messageElement.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${data.message.trim()}</div>
            </div>
            `;
    }
    else{
        messageElement.classList.add('message','other-msg');
            messageElement.innerHTML = `
            <div>
                <div class="name">${data.name}</div>
                <div class="text">${data.message.trim()}</div>
            </div>
            `;

    }
            
            messageContainer.appendChild(messageElement);
            messageContainer.scrollTop=messageContainer.scrollHeight;
            messageInput.value="";
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('status',{
        status: `${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('status',{
        status: `${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('status',{
        status: '',
    })
})

socket.on('status',(data)=>{
    clearUpdateMessages();
    const statusElement=document.createElement("div")
    statusElement.innerHTML= `
    <div class="status" id="status">
       ${data.status}
    </div>
    `
    messageContainer.appendChild(statusElement)

})

function clearUpdateMessages(){
    document.querySelectorAll("div.status").forEach(element=>{
        element.parentNode.removeChild(element);
    })
}

socket.on('exit-msg',(data)=>{
    console.log(data.exitMsg)
    const exitMsg=document.createElement("div")
    exitMsg.innerHTML=`
    <div id="status">
       ${data.exitMsg} 
    </div>
    `
    messageContainer.appendChild(exitMsg)
})

exitButton.addEventListener('click',(e)=>{
    e.preventDefault();
    
    if(confirm("Exit chatroom?")==true){
        
        socket.emit('exit-msg',{
            exitMsg: `${nameInput.value} left`,
        })

        // const YourexitMsg=document.createElement("div")
        // YourexitMsg.innerHTML=`
        // <div class="status" id="status">
        //    You left
        // </div>
        // `
        // messageContainer.appendChild(YourexitMsg);
       
        chatScreen.style.display="none";
        clientsTotal.style.display="none";
        joinBtn.style.display="inline-block"
        instructionsList.style.display="block"
     
    }
    else{
        return;
    }
})


