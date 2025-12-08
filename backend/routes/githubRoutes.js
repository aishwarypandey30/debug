import express from "express";
import { getCommits, getRepoTree } from "../controllers/githubController.js";

const router = express.Router();

// Route to get commit history
router.get("/commits", getCommits);

// Route to get the recursive file tree
router.get("/tree", getRepoTree);

export default router;
