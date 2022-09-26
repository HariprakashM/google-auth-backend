const mongoose=require('mongoose');
const employeeSchema=mongoose.Schema({
    employeename:{type:String,required:true},
    email:{type:String,required:true},
    role:{type:String,required:true},
    age:{type:String,required:true},
},{timestamps:true});

const employeeModel=mongoose.model('employees', employeeSchema);
module.exports=employeeModel;