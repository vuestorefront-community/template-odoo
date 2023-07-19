export default function (req, res, next) {
    if(process.env.NODE_ENV !== 'production'){
        console.log('')            
        console.log('----------------------------');
        console.log('--- INÍCIO DA REQUISIÇÃO ---');
        console.log('----------------------------');
        console.log('Método:', req.method);
        console.log('URL:', req.url);
        
        const params = req.method === 'GET' ? req.query : req.body;
        console.log('Parâmetros:', params);

        console.log('-------------------------');
        console.log('--- FIM DA REQUISIÇÃO ---');
        console.log('-------------------------');  
        console.log('')            
        next();
    }
}