const socket = io('http://localhost:3001');

const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.message-container');
var audio=new Audio('ting.mp3'); 
const appendMessage = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;  // Auto-scroll to the bottom
if(position=='left'){
  audio.play();
}
};

const name = prompt('Enter your name to join');
console.log(`User name: ${name}`);
socket.emit('new-user-joined', name);
console.log(`Emitted new-user-joined with name: ${name}`);

socket.on('user-joined', name => {
  console.log(`User joined: ${name}`);
  appendMessage(`${name} joined the chat`, 'right');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});

socket.on('receive', data => {
  console.log(`Message received from ${data.name}: ${data.message}`);
  appendMessage(`${data.name}: ${data.message}`, 'left');
});

socket.on('user-left', name => {
  console.log(`User left: ${name}`);
  appendMessage(`${name} left the chat`, 'left');
});
