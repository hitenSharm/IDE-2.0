const containerCommand = (extension) =>{
    switch (extension) {
        case ".py":
            return "docker run -d -it python:v1 /bin/bash"            
        case ".cpp":
            return "docker run -d -it cpp:v1 /bin/bash";        
        default:
            break;
    }
}

module.exports=containerCommand;