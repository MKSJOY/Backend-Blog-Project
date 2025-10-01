import mongoose from 'mongoose';


const postSchema = new mongoose.Schema(
{
title: {
type: String,
required: [true, 'Please add a title'],
},
content: {
type: String,
required: [true, 'Please add content'],
},
author: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
},
{ timestamps: true }
);


export default mongoose.model('Post', postSchema);