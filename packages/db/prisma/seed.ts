import { prismaClient } from "../src"

const USER_ID = "17";

async function seed() {

    await prismaClient.user.create({
        data: {
            id: USER_ID,
            email: "testj2dx5@test.com",
        },
    });

    const website = await prismaClient.webSite.create({
        data: {
            userId: USER_ID,
            name: "Test",
            url: "https://tesdctv23.com",
            id: "17",
        },
    });

    const validator = await prismaClient.validator.create({
        data: {
            ip: "127.0.0.1",
            publicKey: "1234567890",
            location: "Test",
        },
    });

    await prismaClient.websiteTicks.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            status: "UP",
            latency: 0,
            createdAt: new Date(),
        },
    });

    await prismaClient.websiteTicks.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            status: "UP",
            latency: 0,
            createdAt: new Date( Date.now()),
        },
    });

    await prismaClient.websiteTicks.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            status: "UP",
            latency: 0,
            createdAt: new Date( Date.now() - 1000 * 60 *20),
        },
    });
    await prismaClient.websiteTicks.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            status: "UP",
            latency: 0,
            createdAt: new Date( Date.now() - 1000 * 60 *30),
        },
    });

    
    
}
seed();