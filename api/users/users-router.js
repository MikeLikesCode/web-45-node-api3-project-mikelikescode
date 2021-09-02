const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.get("/:id", validateUserId, (req, res, next) => {
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then((post) => {
      console.log(post);
      res.status(201).json({ id: post.id, name: req.body.name });
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  Users.update(id, update)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Users.getById(id);
    await Users.remove(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  Posts.get()
    .then((posts) => {
      const userPosts = posts.filter((post) => {
        if (req.params.id == post.user_id) {
          return post;
        }
      });
      res.status(200).json(userPosts);
    })
    .catch(next);
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const addPost = await Posts.insert({
        user_id: req.params.id,
        text: req.body.text,
      });
      res.status(201).json(addPost);
    } catch (err) {
      next(err);
    }
  }
);

// eslint-disable-next-line
router.use((err, req, res, next) => {
  // we plug it AFTER the endpoints
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad inside the user router!",
  });
});

// do not forget to export the router
module.exports = router;
