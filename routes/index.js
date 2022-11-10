var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose()

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
                    db.all(`SELECT title, txt, date FROM blog ORDER BY date DESC`, 
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
                        //INSERT INTO blog (title, txt) VALUES ('test first entry', 'This is a description'), ('Another entry', 'Another Description');`,
                        () => {
                            db.exec(`INSERT INTO blog (title, txt) VALUES ('test first entry', 'This is a description'), ('Another entry', 'Another Description');`);
                            db.all(`SELECT title, txt, date FROM blog ORDER BY date DESC`, 
                            (err, rows) => {
                                console.log(rows);
                                // TODO add displaying data to page
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
        if (req.body.text && req.body.title && req.body.title.length <= 60) {
            db.exec(`INSERT INTO blog (title, txt) VALUES ('${req.body.title}','${req.body.txt}');`);
        } else {
            console.log("Invalid input for creating a new blog");
        }
    });
});

// Creates a DELETE HTTP endpoint to delete an entry based on ID
router.post('/delete', (req, res, next) => {
    let db = new sqlite3.Database('testdb.sqlite3', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
        if(err){
            console.log("ERROR " + err);
            exit(1);
        }

        //Validates input and conditions
        if (req.body.idnum) {
            db.all(`SELECT * FROM blog WHERE id = ${req.body.idnum}`,
                (err, rows) => {
                    if (rows < 1) {
                        console.log("ID not found");
                        res.redirect('/home');
                    } else {
                        console.log("Deleting " + req.body.idnum);
                        db.exec(`DELETE FROM blog WHERE id='${req.body.idnum}';`);
                        res.redirect('/home');
                    }
                }
            );
        } else {
            console.log("ERROR idnum not specified");
            res.redirect('/home');
        } 
    });
});

module.exports = router;