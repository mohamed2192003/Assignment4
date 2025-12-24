const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
let users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

app.post('/add-user', (req,res)=>{
    let {name, email} = req.body;
    let userExists = users.find(user => user.email === email);
    if(userExists){
        return res.json({message: 'User already exists', userExists});
    }else{
        let id = users.length + 1;
        users.push({id, name, email});
        fs.writeFileSync('./users.json', JSON.stringify(users));
        return res.json({message: 'User added successfully', users});
    }
})

app.patch('/update-user/:id', (req, res) => {
    let { id } = req.params;
    let { name, email } = req.body;
    let userData = users.find(user => user.id == id);
    if (!userData) {
        return res.json({ message: 'User not found' });
    }
    if (email && userData.email === email) {
         res.json({message: 'Email cannot be the same as the existing one', user: userData});
    }
    if (name) userData.name = name;
    if (email) userData.email = email;
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.json({message: 'User updated successfully', user: userData});
});

app.delete('/delete-user/:id', (req, res) => {
    let { id } = req.params;
    let userIndex = users.findIndex(user => user.id == id);
    if (userIndex === -1) {
        res.json({ message: 'User not found' });
    }else{
        users.splice(userIndex, 1);
        fs.writeFileSync('./users.json', JSON.stringify(users));
        res.json({ message: 'User deleted successfully', users });
    }
})

app.get('/get-user-by-name/:name', (req, res) => {
    let { name } = req.params;
    let userData = users.find(user => user.name.toLowerCase() === name.toLowerCase());
    if(!userData){
        res.json({message: 'User not found'});
    }else{
        res.json({user: userData});
    }
});

app.get('/get-all-users', (req, res) => {
    res.json({users});
})

app.get('/get-user-by-min-age/:minAge',(req, res) => {
    let { minAge } = req.params;
    minAge = Number(minAge);
    let filteredUsers = users.filter(user => user.age >= minAge);
    if (filteredUsers.length === 0) {
         res.json({ message: 'no user found' });
    }else{
        res.json(filteredUsers);
    }
});

app.get('/get-user-by-id',(req,res)=>{
    let { id } = req.query;
    let userData = users.find(user => user.id == id);
    if(!userData){
        res.json({message: 'User not found'});
    }else{
        res.json({user: userData});
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});