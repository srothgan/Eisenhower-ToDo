import { type NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import Task from "../../../models/task"
import type { NextApiRequest, NextApiResponse } from 'next';
export async function POST(req: NextRequest, res: NextResponse){
    await connectMongoDB()
    const {userId, name, note, date, container} = await req.json();

    console.log("storing task:", { userId, name, note, date, container });

    if (!userId || !name || !note || !date || !container ) {
        return NextResponse.json({ message: 'All fields are required' },
          { status: 400 }
        );
    }
    try{
        const newTask = new Task({
            userId,
            name,
            note, // Ensure this is included
            date,
            container
        });
          
        console.log("the created task", newTask)
        await newTask.save()

        return NextResponse.json({ message: "Task created." }, { status: 201 });
        
    }catch(error){
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }


}

export async function GET(req: NextRequest, res: NextResponse) {
    const  id  = req.nextUrl.searchParams.get('id');
    console.log("method called with", id)    

    console.log("Called for user ID", id);

    if (!id) {
        return NextResponse.json({ message: "User Id is missing." }, { status: 400 })
    }

    await connectMongoDB();

    try {
        const tasks = await Task.find({ userId: id });
        console.log("retrieved the tasks", tasks)
        return NextResponse.json({tasks }, { status: 200 })
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}