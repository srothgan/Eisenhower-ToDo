import { type NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import Task from "../../../models/task"

export async function POST(req: NextRequest, res: NextResponse){
    await connectMongoDB()
    const {userId, name, note, date, container} = await req.json();

    console.log("Received data:", { userId, name, note, date, container });

    if (!userId || !name || !note || !date || !container ) {
        return NextResponse.json({ message: 'All fields are required' },
          { status: 400 }
        );
    }
    try{
        const newTask = new Task({
            userId,
            name, 
            note,
            date,
            container
        })
        await Task.deleteMany({ userId });

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