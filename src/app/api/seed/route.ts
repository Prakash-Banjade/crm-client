import { getSession } from "@/lib/get-session"

export async function GET() {
    const data = await getSession();

    return new Response(JSON.stringify(data))

    // const { data, error } = await authClient.signUp.email({
    //     email: "prakash@gmail.com",
    //     password: "12345678",
    //     name: "Prakash"
    // });
    // if (error) return new Response(error.message, { status: 500 });
    // return new Response("Seeded")
}