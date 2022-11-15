var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose()

// Stores currently editing ID
var currentDocument = -1;

// GET user page data
router.get('/home', function(req, res, next) {
    let db = new sqlite3.Database('testdb.sqlite3', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
        if(err){
          console.log("ERROR " + err);
          exit(1);
        }
  
        db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'blog'`,
            (err, rows) => {
                if(rows.length >= 1){
                    console.log("Table exists");
                    db.all(`SELECT id, title, txt, date FROM blog ORDER BY date DESC`, 
                        (err, rows) => {
                            console.log(`returning ${rows.length} records`);
                            console.log(rows);
                            res.json(rows);
                        }
                    );
                } else {
                    console.log("Creating table");
                    db.exec(`CREATE TABLE blog (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(60) NOT NULL,
                        txt text NOT NULL, date DATETIME NOT NULL DEFAULT(DATETIME('now')));`,
                        () => {
                            db.all(`SELECT id, title, txt, date FROM blog ORDER BY date DESC`, 
                            (err, rows) => {
                                console.log(rows);
                                res.json(rows);
                            });
                        }
                    );
                }
            }
        );
    });
});

// Creates a POST HTTP endpoint to add data to the database
router.post('/add', (req, res, next) => {
    console.log("Adding to database");
    let db = new sqlite3.Database('testdb.sqlite3',
    (err) => {
        if (err) {
            console.log("ERROR " + err);
            exit(1);
        }
        
        //Sanitizes input
        if (req.body.txt && req.body.title && req.body.title.length <= 60) {
            db.exec(`INSERT INTO blog (title, txt) VALUES ('${req.body.title}','${req.body.txt}');`);
            res.sendStatus(201);
        } else {
            console.log("Invalid input for creating a new blog");
            res.sendStatus(400);
        }
    });
});

// Creates a DELETE HTTP endpoint to delete an entry based on ID
router.delete('/delete/:entryId', (req, res, next) => {
    let db = new sqlite3.Database('testdb.sqlite3', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
        if(err){
            console.log("ERROR " + err);
            exit(1);
        }
        //Validates input and conditions
        db.all(`SELECT * FROM blog WHERE id = ${req.params.entryId}`,
            (err, rows) => {
                if (rows < 1) {
                    console.log("ID not found");
                } else {
                    console.log("Deleting " + req.params.entryId);
                    db.exec(`DELETE FROM blog WHERE id='${req.params.entryId}';`);
                }
                res.json(null);
            }
        );
    });
});

//Part 1 of edit functionality to store the ID
router.get('/setId/:editId', (req, res, next) => {
    currentDocument = req.params.editId;
    res.sendStatus(200);
});

// Return currently editing data
router.get('/getEdit', (req, res, next) => {
    let db = new sqlite3.Database('testdb.sqlite3', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
        if(err){
          console.log("ERROR " + err);
          exit(1);
        }
  
        db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'blog'`,
            (err, rows) => {
                db.all(`SELECT id, title, txt FROM blog WHERE id=${currentDocument}`, 
                    (err, rows) => {
                        res.json(rows);
                    }
                );
            }
        );
    });
});

// Updates the DB
router.post('/edit', (req, res, next) => {
    console.log("Editing entry " + currentDocument);
    let db = new sqlite3.Database('testdb.sqlite3',
    (err) => {
        if (err) {
            console.log("ERROR " + err);
            exit(1);
        }
        
        //Sanitizes input
        if (req.body.txt && req.body.title) {
            db.exec(`UPDATE blog SET title='${req.body.title}', txt='${req.body.txt}' WHERE id='${currentDocument}';`);
            res.sendStatus(200);
        } else {
            console.log("Parameters are missing");
            res.sendStatus(400);
        }
    });
});

module.exports = router;