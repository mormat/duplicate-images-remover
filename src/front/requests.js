
let requests = window.requests

if (!requests) {
    requests = {
        'post': async (path, args) => {
            const url = "http://localhost:3000" + path;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Accept':       'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(args)
            });
            
            return await response.json();
        },
        'trigger': async (name) => {
            if (name === 'select-folder') {
                return ['/home/mathieu/Images/Tests']
            }
        }
    }
}

export default requests
