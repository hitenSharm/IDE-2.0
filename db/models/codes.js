const mongoose = require("mongoose");

const codeSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    codes:[{
        name:String,
        lang:String,
        codeData:String
    }]
})

module.exports = mongoose.model('AllCodes',codeSchema);