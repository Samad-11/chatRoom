'use server'

import * as bcrypt from 'bcrypt'
import prisma from './prisma'


export async function signUp(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {


        if (!(username || password)) {
            return { message: "username or password missing ! ", ok: false }
        }
        const protectedPassword = await bcrypt.hash(password, 10)


        const user = await prisma.user.create({
            data: {
                username,
                password: protectedPassword
            }
        })
        if (!user) {
            return { message: "Error while creating new user ! ", ok: false }
        }
        return { message: "New user created successfully ! ", ok: true }
    } catch (error) {
        return { message: "Error while creating new user ! ", ok: false }

    }

}


export async function newMessage(text: string) {
    if (!text.trim()) {
        return
    }

    try {
        const msg = await prisma.chats.create({
            data: {
                message: text
            }
        })
    } catch (error) {

    }
}

export async function getAllMessage() {
    try {
        const messages = await prisma.chats.findMany();

        if (!messages) {
            return
        }
        console.log("server", messages);


        return messages;
    } catch (error) {

    }
}