const express = require("express");
const users = require("./users-model");

// Creates a stadalone "mini" express application
// that we can merge with the main one in "index.js"
const router = express.Router();

router.get("/users", (req, res) => {
  // console.log(req.query);
  // users.find({sortBy: req.query.sortBy})
  users
    .find(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the users",
      });
    });
});

router.get("/users/:id", (req, res) => {
  users
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.post("/users", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Missing user name or email",
    });
  }

  users
    .add(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.put("/users/:id", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Missing user name or email",
    });
  }

  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

router.delete("/users/:id", (req, res) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

// create endpoint that returns all the posts for a user
router.get("/users/:id/posts", (req, res) => {
  // these model functions return a promise, so we have to wait for
  // the promise to resolve with '.then' or reject with '.catch'
  users
    .findUserPosts(req.params.id)
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Could not get user posts" });
    });
});

router.get("/users/:userId/posts/:postId", (req, res) => {
  users
    .findUserPostById(req.params.userId, req.params.postId)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Post was not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Could not get user post" });
    });
});

// create endpoint for adding a new post for a user
router.post("/users/:id", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      message: "Please enter a quote",
    });
    return;
  }

  users
    .addUserPost(req.params.id, req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Could not create post" });
    });
});

// 'require' and 'module.exports' is using a method called commonJS,
// which is an older way of doing modules like in React (import/export)
module.exports = router;
