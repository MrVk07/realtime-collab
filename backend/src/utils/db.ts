import { connect, disconnect } from "mongoose";

export const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        await connect(uri);
        console.log('_________________________Connected to MONGODB_________________________')
    } catch (error) {
        console.log(error);
        throw new Error("Could not Connect To MongoDB");
    }
}


export const disconnectFromDatabase = async () => {
    try {
        await disconnect();
    } catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect From MongoDB");
    }
}