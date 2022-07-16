let interval;
onmessage = function(event){
    let { command } = event.data;
    switch(command){
        case "START":
            interval = setInterval(() => {
                postMessage({
                    status: "interval:running"
                })
            }, 1000)
            break;
        case "STOP":
            clearInterval(interval)
            postMessage({
                status: "interval:ended"
            })
            break;
        default:
            console.log("okay")
    }
}