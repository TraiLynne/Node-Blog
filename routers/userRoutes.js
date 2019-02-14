const express = require('express');

const router = express.Router();

const db = require('../data/helpers/userDb');

router.use(express.json());


// C - Create
router.post('/', async (req, res) => {
    const newUser = req.body;

    try {
        if (!newUser.name || newUser.name === '') {
            res
                .status(400)
                .json({
                errorMessage: 'INCOMPLETE: Please attach a name to this new user.'
            })
        } else {
            let assignedId = await db.insert(newUser);
            newUser.id = assignedId.id;

            res
                .status(200)
                .json(newUser);
        }

    } catch (err) {
        res
            .status(500)
            .json({
                errorMessage: 'Houston, we have a problem.'
            });
    }
    
});

// Ra - ReadAll
router.get('/', async (req, res) => {
    try {
        const users = await db.get();
        const sortBy = req.query.sortby || 'id';

        if (users.length === 0) {
            res
                .status(404)
                .json({
                    errorMessage: 'No posts found at this time. Please try again later'
                });
        } else {
            sortedUsers = users.sort(
                (a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)
            )

            res
                .status(200)
                .json(sortedUsers);
        }
    } catch (err) {
        res
            .status(500)
            .json({
                errorMessage: 'Houston, we have a problem.'
            });
    }
});

// R1 - ReadOne
router.get('/:userId', async (req, res) => {
    const id = req.params.userId;

    try {
        let user = await db.get(id);
        let posts = await db.getUserPosts(id);

        user = {
            ...user,
            posts: posts
        }

        user ?
            res
                .status(200)
                .json(user)
            :
            res
                .status(404)
                .json({
                    errorMessage: 'No user was found with that ID'
                });
    } catch (err) {
        res
            .status(500)
            .json({
                errorMessage: 'Houston, we have a problem'
            });
    }
});

// U - Update
router.put('/:userId', async (req, res) => {
    const id = req.params.userId;
    const updatedUser = req.body;

    try {
        let user = await db.get(id);

         if (!updatedUser.name || updatedUser.name === '') {
             res
                 .status(400)
                 .json({
                     errorMessage: 'INCOMPLETE: Please attach a name to this user.'
                 })
         } else if (!user) {
             res
                 .status(404)
                 .json({
                     errorMessage: `No user was found with the id of ${id}`
                 });
         } else {
             await db.update(id, updatedUser);
             res
                 .status(200)
                 .json(updatedUser);
         }
            
    } catch (err) {
        res
            .status(500)
            .json({
                errorMessage: 'Houston, we have a problem'
            });
    }
});

// D - Destroy
router.delete('/:userId', async (req, res) => {
    const id = req.params.userId;
    let user = await db.get(id);

    try {
        if (!user) {
            res
                .status(404)
            .json({
                errorMessage: `No user was found with the id of ${id}`
            });
        } else {
            const response = await db.remove(id);
            const users = await db.get();
            
            response ?
                res
                    .status(200)
                    .json(users)
            :
                res
                    .status(500)
                    .json({
                        errorMessage: 'There was a problem deleting the record'
                    });
            
        }
    } catch (err) {
        res
            .status(500)
            .json({
                errorMessage: 'Houston we have a problem'
            });
    }
});

module.exports = router;