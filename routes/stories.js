const express = require('express');
const User = require('../models/User');
const Story = require('../models/Story');
const {
    ensureAuthenticated
} = require('../helpers/auth');
/*******************************************************************/
const router = express.Router();
/*******************************************************************/
////////////////     1
// Stories Index
router.get('/', (req, res, next) => {
    Story.find({
            status: 'public'
        })
        .populate('user')
        .sort({
            date: 'desc'
        })
        .then(stories => {
            res.render('stories/index', {
                stories
            });
        });
});
////////////////     2
// Add Story Form
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render("stories/add");
});
////////////////     3
// Process Add Story
router.post('/', (req, res, next) => {
    let allowComments = req.body.allowComments ? true : false;
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }
    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});
////////////////     4
// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if (story.status == 'public') {
                res.render('stories/show', {
                    story
                });
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {
                        res.render('stories/show', {
                            story
                        });
                    } else {
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories');
                }
            }
        });
});
////////////////     5
// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect(`/stories`);
            } else {
                res.render('stories/edit', {
                    story
                });
            }
        });
});
////////////////     5
// Edit Story Form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            let allowComments = req.body.allowComments ? true : false;
            // New values
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;

            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });
        });
});
////////////////     6
// Delete Story
router.delete('/:id', (req, res) => {
    Story.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard');
        });
});
////////////////     7
// Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {

            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            // Add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                });

        });
});
////////////////     8
// List stories from a user
router.get('/user/:userId', (req, res) => {
    Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories
            });
        });
});
////////////////     9
// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
            user: req.user.id
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});
////////////////     10
/*******************************************************************/
module.exports = router;