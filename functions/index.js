'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');



var serviceAccount = require("../permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "..your database url"
});


const express = require('express');
const app = express();
const db = admin.firestore();
const cors = require('cors');
app.use(cors({origin:true}));



//
app.get('/api/subject', async (req, res) => {
  return res.status(200).json({status:'success'})

});
app.post('/api/create', (req, res,subjectId) => {

    (async () => {
        try{
            await admin.firestore().collection('subjects').doc("subjectId")
            .create({
                name: req.body.name,
                lessons:req.body.lessons
                
            })
            return res.status(200).json({status: "new subject added"
            }).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});
 
app.get('/api/read/:id', (req, res) => {

    (async () => {
        try{
            const document = db.collection('subjects').doc(req.params.id);
            let subjects = await document.get();
            let response = subjects.data();

            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});
 
app.get('/api/read', (req, res) => {

    (async () => {
        try
        {
           let query = db.collection('subjects');
           let response = [];

           await query.get().then(async(querySnapshot)  =>  {
               let docs = querySnapshot.docs;

               for(let doc of docs)
               {
                let lesson_query = db.collection('subjects').doc(doc.id).collection("lessions");
                await lesson_query.get().then(snapshot =>{
                    let lessions = snapshot.docs;

                    lessions.forEach(element => {

                        const selectedItem = {
                           
                                    name: doc.data().name,
                                    lesson: element.data().name                              
                          };
                         
                                response.push(selectedItem);
                    });
                    
                });
                
               }
               console.log(response)
               return res.status(200).send({data:response});
           })
           
        }
        catch(error)
        {
            console.log(response)
            return res.status(500).send(error);
        }
    })();

});
 



// Expose the API as a function
exports.api = functions.https.onRequest(app);
