import React from 'react'
import CommentCard from './CommentCard'

function CommentGrid() {
  return (
    <div className='flex w-screen h-fit gap-2 bg--950  overflow-x-scroll'>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>

    </div>
  )
}

export default CommentGrid