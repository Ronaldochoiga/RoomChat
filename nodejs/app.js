const http = require('http')
const port = 3000

const server = http.createServer(function(request, response){
    response.write('hello thre. the node server is up and running')
    response.end()
})
server.listen(port, function(error) {
    if (error) {
	console.log('something went wrong', error)
    }else {
	console.log('server listening to the intended port' +port)
    }
})
