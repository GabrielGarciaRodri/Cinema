const { MongoClient } = require('mongodb');

//NO OLVIDAR ARREGLAR LAS PROMESAS 

//* ¡¡¡FOR REAL NO OLVIDAR AGREGAR LAS VARIABLES DE ENTORNO*//
async function main() {
    const uri = "mongodb+srv://ggarcia:<db_password>@cluster0.ywga3.mongodb.net/";     
    //CAMBIAR LA PASSWORD

    const client = new MongoClient(uri);
    new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect();

    await listDatabases(client);

    try {
        await client.connect();
    
        await listDatabases(client);
    
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};