// const { Socket } = require('dgram')
const express=require('express')
const path=require('path')
const app=express()
const PORT = process.env.PORT || 4000
const server= app.listen(PORT,()=> console.log(`chat server on port ${PORT}`))

const io=require('socket.io')(server)


app.use(express.static(path.join(__dirname,'public')))

let socketsConnected= new Set()

io.on('connection',onConnected) 

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log("socket disconnected",socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('status', (data)=>{
        socket.broadcast.emit('status',data)
    })

    socket.on('exit-msg', (data)=>{
        socket.broadcast.emit('exit-msg',data)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })

    socket.on('join-msg', (data)=>{
        socket.broadcast.emit('join-msg',data)
    })


}