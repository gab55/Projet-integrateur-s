const app = require('./src/app');
const { connecterBD } = require("./src/config/db");
const PORT = process.env.PORT || 3000;

async function demarrer() {
    try{
        await connecterBD(process.env.MONGO_URI); 
        app.listen(PORT, () =>{
           console.log(`Serveur en écoute sur http://localhost:${PORT}`);
        });
    }catch (erreur) {
        console.error("Démarrage annulé :", erreur.message);
        process.exit(1);
    } 
}

demarrer();