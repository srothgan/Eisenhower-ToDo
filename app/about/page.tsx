"use client"
import React from "react";

const Personal = () => {




    return (
        <div className="flex flex-col w-full p-4 gap-12 text-slate-800">
            <div>
                <h3>The Project</h3>
                <p className='ml-4'>The Eisenhower ToDo Matrix project was created to help students organise their tasks by utilising the famous Eisenhower Matrix named after  US-president und WW2-General Dwight D. Eisenhower. It allows user to structure their tasks into four categories depending on importance and urgency.</p>
            </div>
            <div>
                <h3>The Author</h3>
                <p className='ml-4'>The project was created by Simon Peter Rothgang, a student from the University Münster. It was made open-source to improve the design and possibly also the functionality behind it.</p>
            </div>
        </div>
    );
};

export default Personal;
