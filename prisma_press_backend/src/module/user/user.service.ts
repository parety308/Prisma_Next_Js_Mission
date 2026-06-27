import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";

const registerUserIntoDB = async (payload: UserPayload) => {
    const { email, password, name, profileImage } = payload;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User with this email already exists");
    };

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profile:{
                create: {
                    profileImage: profileImage || null
                }
            }
        }
    });
    // console.log("User created successfully:", createdUser);
    // if (createdUser.id) {
    //     // await prisma.profile.create({
    //     //     data: {
    //     //         user_id: createdUser?.id,
    //     //         // profileImage: profileImage || null
    //     //     }
    //     // });
    // }
    // else {
    //     console.log("User creation failed, profile not created.");
    // }

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    });

    return user;
}

export const userService = { registerUserIntoDB }