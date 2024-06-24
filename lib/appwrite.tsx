import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage,
    Permission,
    Role
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.pbc.prizebox',
    projectId: '6678d4a20006356740f4',
    databaseId: '6678d64e0037760ebb73',
    usersCollectionId: '6678d672002bc4417cc6',
    cardsCollectionId: '6678d79000011c9b4437',
    activeCards_storageId: '6678d9eb0022f9f4b9a1'
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

//registering a user
export async function createUser(email: string, password: string, username: string, fullName: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        const sess = await signIn(email, password);

        console.log(sess)
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
                fullName: fullName,
            },
            [Permission.write(Role.user(newAccount.$id))],
        );
        return newUser;
    } catch (error) {
        throw new Error(error as string);
    }
}

//signing a new user in
export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error as string);
    }
}

//getting an account
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        throw new Error(error as string);
    }
}

//getting the current session user and data
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

//signing a user out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        throw new Error(error as string);
    }
}

interface FileUpload {
    mimeType: string,
    name: string;
    size: number;
    uri: string;
    [key: string]: any;
}

function convertToFileUpload(file: File): FileUpload {
    return {
        mimeType: file.type,
        name: file.name || 'default_name',
        size: file.size || 0,
        uri: file.name || 'default_url',
    };
}

//uploading a new file
export async function uploadFile(fileUpload: FileUpload | null, type: string) {
    if (!fileUpload) return;

    const asset = {
        name: fileUpload.name,
        type: fileUpload.mimeType,
        size: fileUpload.size,
        uri: fileUpload.uri
    };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.activeCards_storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error as string)
    }
}

//retrieving file preview
export async function getFilePreview(fileId: string, type: string) {
    let fileUrl;
    
    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.activeCards_storageId, fileId);
        } 
        else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.activeCards_storageId,
                fileId,
                2000,
                20000,  
                "top" as ImageGravity,
                100
            )
        }
        else {
            throw new Error("Invalid file type");
        }
        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error as string);
    }
}

interface VideoPostForm {
    thumbnail: File;
    video: File;
    title: string;
    prompt: string;
    userId: string;
}

//creating video post
export async function createVideoPost(form: VideoPostForm) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(convertToFileUpload(form.thumbnail), "image"),
            uploadFile(convertToFileUpload(form.video), "video"),
        ])

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.cardsCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt, 
                creator: form.userId,
            }
        );
        return newPost;
    } catch (error) {
        throw new Error(error as string);
    }
}

//get all video posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.cardsCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}

//get video posts that match search query
export async function searchPosts(query: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.cardsCollectionId,
            [Query.search("title", query)]
        );

        if (!posts) throw new Error("something went wrong...");

        return posts.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}

//get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.cardsCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}

//get user video posts
export async function getUserPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.cardsCollectionId,
            [Query.equal("creator", userId)]
        );

        if (!posts) throw new Error("something went wrong...");

        return posts.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}
// 666632d90032b9d35744