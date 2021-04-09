const mongoose = require('mongoose');

const Schema=mongoose.Schema;


const notes=new Schema({
    name:"String",
    notebody:"String"

});

module.exports=mongoose.model('notes',notes)