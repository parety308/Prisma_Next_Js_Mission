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
            profile: {
                create: {
                    profileImage: profileImage || null
                }
            }
        }
    });

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
};

const getUserProfileFromDB = async (user_id: any) => {
    const userProfile = await prisma.user.findUniqueOrThrow({
        where: { id: user_id },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    });
    return userProfile;
};

const updateUserProfileIntoDB = async (user_id: string, payload: any) => {
    const user = await prisma.profile.update({
        where: { user_id },
        data: payload
    })
    return user;
}

export const userService = { registerUserIntoDB, getUserProfileFromDB, updateUserProfileIntoDB };