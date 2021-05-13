const generateCmd = (extension) =>{
    switch (extension) {
        case ".py":
            return `"python3 codeFile.py<inputFile.txt"` ;                       
        case ".cpp":
            return `"g++ codeFile.cpp && ./a.out<inputFile.txt"`;        
        default:
            break;
    }
}

module.exports=generateCmd;