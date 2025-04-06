import 'dotenv/config';
import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.post("/api/v1/website", authMiddleware, async(req, res) => {
    const userId = req.userid;
    const { url, name } = req.body;

    const data = await prismaClient.webSite.create({
        data: {
            userId,
            url,
            name,
        }
    })
    res.status(201).json({ "id": data.id});

})

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
    const userId = req.userid;
    const { websiteId } = req.params;

    const data = await prismaClient.webSite.findUnique({
        where: {
            id: websiteId, 
            userId,
            deleted: false
        },
        include: {
            websiteTicks: true,
        }
    })

    res.status(200).json(data);
})

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    const userId = req.userid;

    const websites = await prismaClient.webSite.findMany({
        where: {
            userId,
            deleted: false
        },
        include: {
            websiteTicks: true,
        }
    })

    res.status(200).json({"websites" : websites});

})

app.delete("/api/v1/website/:id", authMiddleware, async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const data = await prismaClient.webSite.update({
        where: {
            id,
            userId
        },
        data: {
            deleted: true
        }
    })

    res.status(200).json({message: "Website deleted successfully"});
})

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});